const axios = require('axios');

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

module.exports = {
    info,
    empresas,
    filiais,
    modulos
}