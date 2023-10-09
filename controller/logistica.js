const mysqlConnect = require('../db');
const sql = require('mssql');
const fs = require('fs')

const sqlConfig = {
    user: process.env.MSUSER,
    password: process.env.MSPASSWORD,
    database: process.env.MSDATABASE,
    server: process.env.MSSERVER,
    pool: {
      max: 40,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }

const home = async(req, res)=>{
    res.render('logistica/home')
}

const produtos = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();

        const resultsQuery = `SELECT COUNT(*) AS contagem FROM sb1_produtos WHERE cod like '%${req.query.CODIGO}%' AND descri LIKE '%${req.query.DESCRI}%'`;
        const contentsQuery = `SELECT * FROM sb1_produtos WHERE cod like '%${req.query.CODIGO}%' AND descri LIKE '%${req.query.DESCRI}%'`;
        
        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);

        res.render('logistica/produtos', {
            results: results[0][0].contagem,
            contents: contents[0]
        });

    } catch (error) {
        console.log(error)
        res.render('error')
    };
}

const atualizarSB1 = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        var data = fs.readFileSync('storage/sb1.csv')
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.replace(/[())]+/g, ''))

        var data2 = fs.readFileSync('storage/sb1.csv')
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.replace(/['"]+/g, ''))
        .map(e => e.split(',').map(e => e.trim())); // split each line to array

        const values = [];
        const colunas = []

        data2[0].forEach(async element => {
            colunas.push(element)
        });

        data.forEach(async (element, index) => {
            if(index < 17112) return;
            values.push(element)
        });
    
        await conn.query(`INSERT INTO sb1_produtos (${colunas}) VALUES (${values})`, [], function(err) {
            if (err) throw err;
        });

        // res.redirect('/logistica/produtos')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const detalhes = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        const produto = await conn.query('SELECT * FROM sb1_produtos WHERE id = ?', req.params.id);

        res.render('logistica/detalhes', {
            produto: produto[0][0]
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const produtosKorp = async(req, res)=>{
    try {
        if(req.query.LIMITE == undefined || req.query.LIMITE == 'undefined' || req.query.LIMITE == ''){
            var limite = 200
        }else{
            limite = req.query.LIMITE
        }

        if(req.query.CODIGO == undefined || req.query.CODIGO == 'undefined' || req.query.CODIGO == ''){
            var codigo = ''
        }else{
            codigo = req.query.CODIGO
        }

        if(req.query.DESCRI == undefined || req.query.DESCRI == 'undefined' || req.query.DESCRI == ''){
            var descri = ''
        }else{
            descri = req.query.DESCRI
        }

        await sql.connect(sqlConfig);

        const resultsQuery = `select count(id) as 'contagem' from ESTOQUE where CODIGO LIKE '%${codigo}%' and DESCRI LIKE '%${descri}%' AND STATUS <> 'I'`;
        const contentsQuery = `select top ${limite} CODIGO, DESCRI from ESTOQUE where CODIGO LIKE '%${codigo}%' and DESCRI LIKE '%${descri}%' AND STATUS <> 'I'`;

        const results = await sql.query(resultsQuery)
        const contents = await sql.query(contentsQuery)

        res.render('logistica/produtosKorp', {
            results: results.recordset[0].contagem,
            contents: contents.recordset
        });
       } catch (error) {
            res.render('error')
            console.log(error)
       }
};

const produtosKorpDetalhes = async(req, res)=>{
    try {
        await sql.connect(sqlConfig);

        const detailsQuery = `select * from ESTOQUE where CODIGO = '${req.params.id}'`;

        const details = await sql.query(detailsQuery)

        res.render('logistica/produtoskorpdetalhes', {
            details: details.recordset[0],
        });

    } catch (error) {
        res.render('error');
        console.log(error);
    }
}

const itenskorptotvs = async (req, res)=>{
    try {
        await sql.connect(sqlConfig);

        if(req.query.LIMITE == undefined || req.query.LIMITE == 'undefined' || req.query.LIMITE == ''){
            var limite = 200
        }else{
            limite = req.query.LIMITE
        }

        if(req.query.CODFIBRA == undefined || req.query.CODFIBRA == 'undefined' || req.query.CODFIBRA == ''){
            var codfibra = ''
        }else{
            codfibra = req.query.CODFIBRA
        }

        if(req.query.CODIGOTOTVS == undefined || req.query.CODIGOTOTVS == 'undefined' || req.query.CODIGOTOTVS == ''){
            var codigototvs = ''
        }else{
            codigototvs = req.query.CODIGOTOTVS
        }

        if(req.query.DESCRICAO == undefined || req.query.DESCRICAO == 'undefined' || req.query.DESCRICAO == ''){
            var descricao = ''
        }else{
            descricao = req.query.DESCRICAO
        }

        const resultsQuery = `SELECT COUNT(CODFIBRA) as contagem from CST_ITENS_TOTVS WHERE CODFIBRA LIKE '%${codfibra}%' AND B1_X_COD LIKE '%${codigototvs}%' AND DESCRICAO LIKE '%${descricao}%'`;
        const contentsQuery = `SELECT TOP ${limite} CODFIBRA, B1_X_COD, DESCRICAO from CST_ITENS_TOTVS WHERE CODFIBRA LIKE '%${codfibra}%' AND B1_X_COD LIKE '%${codigototvs}%' AND DESCRICAO LIKE '%${descricao}%'`;
        
        const results = await sql.query(resultsQuery)
        const contents = await sql.query(contentsQuery)

        res.render('logistica/itenskorptotvs', {
            results: results.recordset[0].contagem,
            contents: contents.recordset,
        });
    } catch (error) {
        res.render('error');
        console.log(error);
    }
}


module.exports = {
    home,
    produtos,
    atualizarSB1,
    detalhes,
    produtosKorp,
    produtosKorpDetalhes,
    itenskorptotvs
};