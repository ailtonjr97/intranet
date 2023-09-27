const axios = require('axios')
const db = require('../db/clientes')
const pvdb = require('../db/pedidosDeVenda')
const nfs = require('../db/notafiscalsaida')

const home = async(req, res)=>{
    res.render('faturamento/home')
}

const condPag = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
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
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const apis = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
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
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
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

const pedidosDeVenda = async(req, res)=>{
    try {
        res.render('faturamento/pedidosdevenda', {
            results: await pvdb.countPedidosDeVenda(),
            contents: await pvdb.selectPedidosDeVenda()
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarSC5 = async(req, res)=>{
    try {
        const [limitadorSC5, limitadorSC6] = await Promise.all([
            axios.get(process.env.APITOTVS + "CONSULTA_SC5/get_all", {auth: {username: process.env.USERTOTVS , password: process.env.SENHAPITOTVS}}),
            axios.get(process.env.APITOTVS + "CONSULTA_SC6/get_all", {auth: {username: process.env.USERTOTVS , password: process.env.SENHAPITOTVS}})
        ])
        
        const [responseSC5, responseSC6] = await Promise.all([
            axios.get(process.env.APITOTVS + "CONSULTA_SC5/get_all?limit=" + limitadorSC5.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}}),
            axios.get(process.env.APITOTVS + "CONSULTA_SC6/get_all?limit=" + limitadorSC6.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        ])

        await Promise.all([
            pvdb.insertPedidosDeVenda(responseSC5.data.objects),
            pvdb.insertItensPedidoDeVenda(responseSC6.data.objects)
        ])
        res.redirect('/faturamento/pedidosdevenda')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const pedidosDeVendaDetalhes = async(req, res)=>{
    try {
        res.render('faturamento/pedidosdevendadetalhes', {
            pedido: await pvdb.selectPedidoDeVenda(req.params.id, req.params.filial),
            itens: await pvdb.selectPedidosMaisItens(req.params.id, req.params.filial)
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const notasFicalSaida = async(req, res)=>{
    try {
        res.render('faturamento/notasfiscaisdesaida', {
            results: await nfs.countNotaFiscalSaida(),
            contents: await nfs.selectNotasFiscalSaida()
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarSF2 = async(req, res)=>{
    try {
        const [limitadorSD2, limitadorSF2] = await Promise.all([
            axios.get(process.env.APITOTVS + "CONSULTA_SD2/get_all", {auth: {username: process.env.USERTOTVS , password: process.env.SENHAPITOTVS}}),
            axios.get(process.env.APITOTVS + "CONSULTA_SF2/get_all", {auth: {username: process.env.USERTOTVS , password: process.env.SENHAPITOTVS}})
        ])
        
        const [responseSD2, responseSF2] = await Promise.all([
            axios.get(process.env.APITOTVS + "CONSULTA_SD2/get_all?limit=" + limitadorSD2.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}}),
            axios.get(process.env.APITOTVS + "CONSULTA_SF2/get_all?limit=" + limitadorSF2.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        ])

        await Promise.all([
            nfs.insertNotaFiscalSaida(responseSF2.data.objects),
            nfs.insertItensNotaFiscalSaida(responseSD2.data.objects)
        ])
        res.redirect('/faturamento/nota-fiscal-saida')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const notaFiscalSaidaDetalhes = async(req, res)=>{
    try {
        res.render('faturamento/notafiscalsaidadetalhes', {
            nota: await nfs.selectNotaFiscalSaida(req.params.doc),
            itens: await nfs.selectNFSsaidaItens(req.params.doc)
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

module.exports = {
    home,
    condPag,
    gruposDeVenda,
    clientes,
    atualizarSA1,
    detalhes,
    pedidosDeVenda,
    atualizarSC5,
    pedidosDeVendaDetalhes,
    notasFicalSaida,
    atualizarSF2,
    notaFiscalSaidaDetalhes
};