const axios = require('axios')

const home = async(req, res)=>{
    res.render('comercial/home')
}

const gruposDeVenda = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        res.render('comercial/gruposDeVenda', {
            apis: apis.data.objects,
            results: apis.data.objects.length
        })
    } catch (error) {
        console.log(error)
        res.render('error.ejs')
    }
}

module.exports = {
    home,
    gruposDeVenda
};