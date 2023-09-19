const axios = require('axios')
const db = require('../db/clientes')

const home = async(req, res)=>{
    res.render('faturamento/home')
}

const condPag = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        res.render('faturamento/condPag', {
            apis: apis.data.objects,
            results: apis.data.objects.length
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const gruposDeVenda = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        res.render('faturamento/gruposDeVenda', {
            apis: apis.data.objects,
            results: apis.data.objects.length
        })
    } catch (error) {
        console.log(error)
        res.render('error.ejs')
    }
}

const clientes = async(req, res)=>{
    try {
        res.render('faturamento/clientes', {
            results: await db.countClientes(),
            contents: await db.selectClientes()
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    };
}

const atualizarSA1 = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        await db.insertClientes(response.data.objects)
        res.redirect('/faturamento/clientes')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const detalhes = async(req, res)=>{
    try {
        const details = await db.selectCliente(req.params.id)
        res.render('faturamento/detalhes',{
            details: details
        })
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

module.exports = {
    home,
    condPag,
    gruposDeVenda,
    clientes,
    atualizarSA1,
    detalhes
};