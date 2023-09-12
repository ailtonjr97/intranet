const db = require('../db/produtos.js')
const axios = require('axios')

const home = async(req, res)=>{
    res.render('logistica/home')
}

const produtos = async(req, res)=>{
    try {
        const api = await axios.get(process.env.APIKRONOS + "/sb1/consultar", {auth: {username: "admin", password: process.env.SENHAKRONOS}})
        res.render('logistica/produtos', {
            results: api.data.length,
            apis: api.data
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarSB1 = async(req, res)=>{
    try {
        await axios.get(process.env.APIKRONOS + "/sb1/atualizar", {auth: {username: "admin", password: process.env.SENHAKRONOS}})
        res.redirect('/logistica/produtos')
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

module.exports = {
    home,
    produtos,
    atualizarSB1
};