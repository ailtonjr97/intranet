const axios = require('axios');
const db = require('../db/users.js');

const info = async(req, res)=>{
    res.render('info/info');
};

const empresas = async(req, res)=>{
    const contents = await axios.get(process.env.APITOTVS + "api/framework/environment/v1/companies", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
    res.render("info/empresas", {
        contents: contents.data.items
    });
};

module.exports = {
    info,
    empresas
}