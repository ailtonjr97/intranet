const axios = require('axios');
const db = require('../db/info')

const info = async(req, res)=>{
    res.render('info/info');
};

const empresas = async(req, res)=>{
    const contents = await axios.get(process.env.APITOTVS + "api/framework/environment/v1/companies", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
    res.render("info/empresas", {
        contents: contents.data.items
    });
};

const filiais = async(req, res)=>{
    const contents = await axios.get(process.env.APITOTVS + "api/framework/environment/v1/branches", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
    res.render("info/filiais", {
        contents: contents.data.items
    });
};

const modulos = async(req, res)=>{
    const contents = await axios.get(process.env.APITOTVS + "api/framework/v1/menus?pagesize=150", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
    res.render("info/modulos", {
        contents: contents.data.items
    });
};

const parametros = async(req, res)=>{
    try {
        res.render('info/parametros', {
            contents: await db.selectParametros(),
            results: await db.countParametros()
        })
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const insertVPC = async(req, res)=>{
    try {
        const records = await axios.get(process.env.APITOTVS + "api/framework/v1/systemParameters", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        let limitador = records.data.remainingRecords + 10;
        const content = await axios.get(process.env.APITOTVS + "api/framework/v1/systemParameters?pageSize=" + limitador, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        await db.insertParametros(content.data.items);
        res.redirect("/informacoes/parametros")
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

module.exports = {
    info,
    empresas,
    filiais,
    modulos,
    parametros,
    insertVPC
}