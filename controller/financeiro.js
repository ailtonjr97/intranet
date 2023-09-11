const axios = require('axios')

const home = async(req, res)=>{
    res.render('financeiro/home')
}

const condPag = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        res.render('financeiro/condPag', {
            apis: apis.data.objects,
            results: apis.data.objects.length
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

module.exports = {
    home,
    condPag
};