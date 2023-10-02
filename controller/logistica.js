const mysqlConnect = require('../db')
const axios = require('axios')
const sql = require('mssql')

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
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_PRO/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_PRO/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})

        const conn = await mysqlConnect.connect();
        await conn.query("TRUNCATE sb1_produtos");
    
        const values = [];
    
        response.data.objects.forEach(response => {
            values.push([response.cod, response.tipo, response.um, response.grupo, response.peso, response.urev, response.desc, response.pesbru]) 
        });
    
        await conn.query("INSERT INTO sb1_produtos (cod, tipo, um, grupo, peso, urev, descri, pesbru) VALUES ?", [values], function(err) {
            if (err) throw err;
        });

        res.redirect('/logistica/produtos')
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
            await sql.connect(sqlConfig);
            
            const query = `select CODIGO, DESCRI from ESTOQUE where CODIGO LIKE '%${req.query.CODIGO}%' and DESCRI LIKE '%${req.query.DESCRI}%' AND STATUS <> 'I'`;
            const contents = await sql.query(query)

            res.render('logistica/produtosKorp', {
                contents: contents.recordset
            });
       } catch (error) {
            res.render('error')
            console.log(error)
       }
};


module.exports = {
    home,
    produtos,
    atualizarSB1,
    detalhes,
    produtosKorp
};