const db = require('../db/produtos.js')
const axios = require('axios')
const sql = require('mssql')

const sqlConfig = {
  user: process.env.MSUSER,
  password: process.env.MSPASSWORD,
  database: process.env.MSDATABASE,
  server: process.env.MSSERVER,
  pool: {
    max: 10,
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
        res.render('logistica/produtos', {
            results: await db.countProdutos(),
            produtos: await db.selectProdutos()
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
        await db.insertProdutos(response.data.objects)
        res.redirect('/logistica/produtos')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const detalhes = async(req, res)=>{
    try {
        let produto = await db.selectProduto(req.params.id)
        res.render('logistica/detalhes', {
            produto: produto
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