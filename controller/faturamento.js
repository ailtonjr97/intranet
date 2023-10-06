const mysqlConnect = require('../db')
const axios = require('axios')
const sql = require('mssql')

const sqlConfig = {
    user: process.env.MSUSER,
    password: process.env.MSPASSWORD,
    database: process.env.MSDATABASE,
    server: process.env.MSSERVER,
    pool: {
      max: 40,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }

const home = async(req, res)=>{
    res.render('faturamento/home')
}

const condPag = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        const resultsQuery = `SELECT COUNT(*) AS contagem FROM se4_condicaodepagamento WHERE codigo like '%${req.query.CODIGO}%' AND descri LIKE '%${req.query.DESCRI}%'`;
        const contentsQuery = `SELECT * FROM se4_condicaodepagamento WHERE codigo like '%${req.query.CODIGO}%' AND descri LIKE '%${req.query.DESCRI}%'`;

        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);


        res.render('faturamento/condPag', {
            results: results[0][0].contagem,
            contents: contents[0]
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarSE4 = async(req, res) =>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
    
        const conn = await mysqlConnect.connect();
        await conn.query("TRUNCATE se4_condicaodepagamento");
    
        const values = [];
    
        response.data.objects.forEach(response => {
            values.push([response.filial, response.codigo, response.tipo, response.cond, response.descri]) 
        });
    
        await conn.query("INSERT INTO se4_condicaodepagamento (filial, codigo, tipo, cond, descri) VALUES ?", [values], function(err) {
            if (err) throw err;
        });
    
        res.redirect('/faturamento/condicao-de-pagamento')
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const gruposDeVenda = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        const resultsQuery = `SELECT COUNT(*) AS contagem FROM acy_gruposdevenda WHERE grpven like '%${req.query.GRPVEN}%' AND descri LIKE '%${req.query.DESCRI}%'`;
        const contentsQuery = `SELECT * FROM acy_gruposdevenda WHERE grpven like '%${req.query.GRPVEN}%' AND descri LIKE '%${req.query.DESCRI}%'`;

        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);


        res.render('faturamento/gruposdevenda', {
            results: results[0][0].contagem,
            contents: contents[0]
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarACY = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
    
        const conn = await mysqlConnect.connect();
        await conn.query("TRUNCATE acy_gruposdevenda");
    
        const values = [];
    
        response.data.objects.forEach(response => {
            values.push([response.grpven, response.descri]) 
        });
    
        await conn.query("INSERT INTO acy_gruposdevenda (grpven, descri) VALUES ?", [values], function(err) {
            if (err) throw err;
        });
    
        res.redirect('/faturamento/grupos-de-venda')
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const clientes = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        const resultsQuery = `SELECT COUNT(*) AS contagem FROM sa1_clientes WHERE cod like '%${req.query.COD}%' AND nome LIKE '%${req.query.NOME}%'`;
        const contentsQuery = `SELECT * FROM sa1_clientes WHERE cod like '%${req.query.COD}%' AND nome LIKE '%${req.query.NOME}%'`;

        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);


        res.render('faturamento/clientes', {
            results: results[0][0].contagem,
            contents: contents[0]
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const atualizarSA1 = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}})
    
        const conn = await mysqlConnect.connect();
        await conn.query("TRUNCATE sa1_clientes");
    
        const values = [];
    
        response.data.objects.forEach(response => {
            values.push([response.cod, response.nome, response.cod_mun, response.mun, response.nreduz, response.grpven, response.loja, response.end, response.codpais, response.est, response.cep, response.tipo, response.cgc, response.filial, response.xcartei]) 
        });
    
        await conn.query("INSERT INTO sa1_clientes (cod, nome, cod_mun, mun, nreduz, grpven, loja, endereco, codpais, est, cep, tipo, cgc, filial, xcartei) VALUES ?", [values], function(err) {
            if (err) throw err;
        });
    
        res.redirect('/faturamento/clientes')
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const detalhes = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();

        const detailsQuery = `SELECT * FROM sa1_clientes WHERE id = ${req.params.id}`;
        const details = await conn.query(detailsQuery);

        res.render('faturamento/detalhes',{
            details: details[0][0]
        })
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const pedidosDeVenda = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();
        const resultsQuery = `SELECT COUNT(*) AS contagem FROM sc5_pedidosdevenda WHERE num like '%${req.query.NUM}%' AND cliente LIKE '%${req.query.CLIENTE}%' AND filial LIKE '%${req.query.FILIAL}%'`;
        const contentsQuery = `SELECT * FROM sc5_pedidosdevenda WHERE num like '%${req.query.NUM}%' AND cliente LIKE '%${req.query.CLIENTE}%' AND filial LIKE '%${req.query.FILIAL}%'`;

        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);


        res.render('faturamento/pedidosdevenda', {
            results: results[0][0].contagem,
            contents: contents[0]
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

        const conn = await mysqlConnect.connect();

        await Promise.all([
            conn.query("TRUNCATE sc5_pedidosdevenda"),
            conn.query("TRUNCATE sc6_itenspedidodevenda")
        ]);
    
        const values = [];
        const values2 = [];

        await Promise.all([
            responseSC5.data.objects.forEach(response => {
                values.push([
                    response.nota,
                    response.tpfrete,
                    response.condpag,
                    response.tipocli,
                    response.blq,
                    response.liberok,
                    response.lojacli,
                    response.vend1,
                    response.cliente,
                    response.tipo,
                    response.num,
                    response.emissao,
                    response.xflagtr,
                    response.filial,
                    response.xpedtr]) 
            }),

            responseSC6.data.objects.forEach(response => {
                values2.push([
                    response.loja,
                    response.num,
                    response.item,
                    response.produto,
                    response.qtdven,
                    response.qtdent,
                    response.prcven,
                    response.descont,
                    response.valor,
                    response.oper,
                    response.tes,
                    response.cf,
                    response.cli,
                    response.entreg,
                    response.datfat,
                    response.nota,
                    response.blq,
                    response.filial,]) 
            }),
        ]);

        await Promise.all([
            conn.query("INSERT INTO sc5_pedidosdevenda (nota, tpfrete, condpag, tipocli, blq, liberok, lojacli, vend1, cliente, tipo, num, emissao, xflagtr, filial, xpedtr) VALUES ?", [values], function(err) {
                if (err) throw err;
            }),

            conn.query("INSERT INTO sc6_itenspedidodevenda (loja, num, item, produto, qtdven, qtdent, prcven, descont, valor, oper, tes, cf, cli, entreg, datfat, nota, blq, filial) VALUES ?", [values2], function(err) {
                if (err) throw err;
            })
        ])

        res.redirect('/faturamento/pedidosdevenda')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const pedidosDeVendaDetalhes = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();

        const [pedidoQuery, itensQuery] = await Promise.all([
            `SELECT *, sc5.filial as "filial_sc5" FROM sc5_pedidosdevenda as sc5 INNER JOIN sa1_clientes as sa1 on sc5.cliente = sa1.cod WHERE sc5.num = '${req.params.id}' and sc5.filial = '${req.params.filial}'`,
            `select * from sc6_itenspedidodevenda sc6 inner join sb1_produtos as sb1 on sc6.produto = sb1.cod where sc6.num = '${req.params.id}' and sc6.filial = '${req.params.filial}' order by item asc`
        ])

        const [pedido, itens] = await Promise.all([
            conn.query(pedidoQuery),
            conn.query(itensQuery)
        ])

        res.render('faturamento/pedidosdevendadetalhes',{
            pedido: pedido[0][0],
            itens: itens[0]
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const notasFicalSaida = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();

        const resultsQuery = `SELECT COUNT(*) AS contagem FROM sf2_cabecalhonfsaida WHERE doc LIKE '%${req.query.DOC}%' AND cliente LIKE '%${req.query.CLIENTE}%'`;
        const contentsQuery = `select * from sf2_cabecalhonfsaida WHERE doc LIKE '%${req.query.DOC}%' AND cliente LIKE '%${req.query.CLIENTE}%' order by emissao desc`;

        const results = await conn.query(resultsQuery);
        const contents = await conn.query(contentsQuery);

        res.render('faturamento/notasfiscaisdesaida', {
            results: results[0][0].contagem,
            contents: contents[0]
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

        const conn = await mysqlConnect.connect();

        await Promise.all([
            conn.query("TRUNCATE sf2_cabecalhonfsaida"),
            conn.query("TRUNCATE sd2_itensdevendanf")
        ]);
    
        const values = [];
        const values2 = [];

        await Promise.all([
            responseSF2.data.objects.forEach(response => {
                values.push([
                    response.emissao,
                    response.filial,
                    response.chvnfe,
                    response.doc,
                    response.serie,
                    response.cliente,
                    response.loja,
                    response.tipocli,
                    response.vend1,
                    response.fimp
                ]) 
            }),

            responseSD2.data.objects.forEach(response => {
                values2.push([
                    response.loja,
                    response.filial,
                    response.doc,
                    response.serie,
                    response.cliente,
                    response.item,
                    response.cod,
                    response.um,
                    response.pedido,
                    response.tipo,
                    response.origlan,
                    response.tes,
                    response.cf,
                    response.quant,
                    response.prunit
                ]) 
            }),
        ]);

        await Promise.all([
            conn.query("INSERT INTO sf2_cabecalhonfsaida (emissao, filial, chvnfe, doc, serie, cliente, loja, tipocli, vend1, fimp) VALUES ?", [values], function(err) {
                if (err) throw err;
            }),

            conn.query("INSERT INTO sd2_itensdevendanf (loja, filial, doc, serie, cliente, item, cod, um, pedido, tipo, origlan, tes, cf, quant, prunit) VALUES ?", [values2], function(err) {
                if (err) throw err;
            })
        ]);
        res.redirect('/faturamento/nota-fiscal-saida')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const notaFiscalSaidaDetalhes = async(req, res)=>{
    try {
        const conn = await mysqlConnect.connect();

        const [notaQuery, itensQuery] = await Promise.all([
            `select * from sf2_cabecalhonfsaida sc where doc = '${req.params.doc}'`,
            `select *, sb1.descri as 'descritivo', sd2.tipo as 'sd2tipo' from sf2_cabecalhonfsaida sf2 inner join sd2_itensdevendanf as sd2 on sf2.doc = sd2.doc and sf2.serie = sd2.serie and sf2.cliente = sd2.cliente and sf2.loja = sd2.loja inner join sb1_produtos sb1 on sb1.cod = sd2.cod where sf2.doc = '${req.params.doc}' order by item asc`,
        ])

        const [nota, itens] = await Promise.all([
            conn.query(notaQuery),
            conn.query(itensQuery)
        ])

        res.render('faturamento/notafiscalsaidadetalhes',{
            nota: nota[0][0],
            itens: itens[0]
        })
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const pedidosKorp = async(req, res)=>{
    try {
        await sql.connect(sqlConfig);

        if(req.query.PEDIDO == undefined || req.query.PEDIDO == 'undefined' || req.query.PEDIDO == ''){
            var pedido = ''
        }else{
            pedido = req.query.PEDIDO
        }

        if(req.query.LIMITE == undefined || req.query.LIMITE == 'undefined' || req.query.LIMITE == ''){
            var limite = 200
        }else{
            limite = req.query.LIMITE
        }

        if(req.query.STATUS == undefined || req.query.STATUS == 'undefined' || req.query.STATUS == ''){
            var status = ''
        }else{
            status = req.query.STATUS
        }

        const resultsQuery = `SELECT COUNT(R_E_C_N_O_) as contagem from CRM_PEDIDO WHERE PEDIDO LIKE '%${pedido}%' AND STATUS_PEDIDO LIKE '%${status}%'`;
        const contentsQuery = `SELECT top ${limite} CRM_PEDIDO.PEDIDO, CLIENTES.RASSOC, CRM_PEDIDO.DT_ENTREGA, CRM_PEDIDO.DT_EMISSAO, CRM_PEDIDO.USUARIO, CRM_PEDIDO.STATUS_PEDIDO from CRM_PEDIDO inner join CLIENTES on CRM_PEDIDO.CLIENTE = CLIENTES.CODIGO WHERE PEDIDO LIKE '%${pedido}%' AND STATUS_PEDIDO LIKE '%${status}%' order by CRM_PEDIDO.DT_EMISSAO desc`;

        const results = await sql.query(resultsQuery)
        const contents = await sql.query(contentsQuery)
        
        res.render('faturamento/pedidoskorp', {
            results: results.recordset[0].contagem,
            contents: contents.recordset,
        });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const pedidosKorpDetalhes = async(req, res)=>{
    try {
        await sql.connect(sqlConfig);

        const pedido = req.params.ano + '/' + req.params.id
        const contentsQuery = `SELECT * FROM CRM_PEDIDO WHERE PEDIDO = '${pedido}'`;
        const pedidoObsQuery = `SELECT CAST(CAST (OBSERVACAO AS varbinary(MAX)) AS VARCHAR(MAX)) as obs FROM CRM_PEDIDO WHERE PEDIDO = '${pedido}'`;

        const contents = await sql.query(contentsQuery);
        const obs = await sql.query(pedidoObsQuery);

        res.render('faturamento/pedidoskorpdetalhes', {
            contents: contents.recordset[0],
            chaves: Object.keys(contents.recordset[0]),
            obs: obs.recordset[0].obs
        });
    } catch (error) {
        console.log(error);
        res.render('error');
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
    notaFiscalSaidaDetalhes,
    atualizarSE4,
    atualizarACY,
    pedidosKorp,
    pedidosKorpDetalhes
};