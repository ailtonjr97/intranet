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
    try {
        res.render('compras/home')
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const pedidosKorp = async(req, res)=>{
    try {
        if(req.query.NDOC == undefined || req.query.NDOC == 'undefined' || req.query.NDOC == ''){
            var NDOC = ''
        }else{
            NDOC = req.query.NDOC
        }

        if(req.query.RASSOC == undefined || req.query.RASSOC == 'undefined' || req.query.RASSOC == ''){
            var RASSOC = ''
        }else{
            RASSOC = req.query.RASSOC
        }

        if(req.query.LIMITE == undefined || req.query.LIMITE == 'undefined' || req.query.LIMITE == ''){
            var LIMITE = 200
        }else{
            LIMITE = req.query.LIMITE
        }

        await sql.connect(sqlConfig);

        const parcliseQuery = `SELECT TOP ${LIMITE} NDOC, DTEMI, RASSOC FROM PEDIDO_FOR WHERE NDOC LIKE '%${NDOC}%' AND RASSOC LIKE '%${RASSOC}%' order by NDOC DESC`;
        const parcliseCountQuery = `SELECT COUNT(NDOC) AS contagem FROM PEDIDO_FOR WHERE NDOC LIKE '%${NDOC}%' AND RASSOC LIKE '%${RASSOC}%'`; 

        const parclise = await sql.query(parcliseQuery);
        const parcliseCount = await sql.query(parcliseCountQuery);

        res.render('compras/pedidoskorp', {
            contents: parclise.recordset,
            parcliseContagem: parcliseCount.recordset[0].contagem
        });
    } catch (error) {
        console.log(error.originalError.info.message);
        res.render('error');
    }
}

const pedidosKorpDetalhes = async(req, res)=>{
    try {
        await sql.connect(sqlConfig);

        const parcliseQuery = `SELECT * FROM PEDIDO_FOR WHERE NDOC = ${req.params.id}`;
        const parcliseObsQuery = `SELECT CAST(CAST (OBS1 AS varbinary(MAX)) AS VARCHAR(MAX)) as obs FROM PEDIDO_FOR WHERE NDOC = ${req.params.id}`;
        const parcliseTranspQuery = `SELECT F.RASSOC AS transp FROM PEDIDO_FOR P left join FORNECED F ON P.TRANSP = F.CODIGO WHERE NDOC = ${req.params.id}`

        const parclise = await sql.query(parcliseQuery);
        const parcliseObs = await sql.query(parcliseObsQuery);
        const parcliseTranspObs = await sql.query(parcliseTranspQuery);

        res.render('compras/pedidoskorpdetalhes', {
            contents: parclise.recordset[0],
            obs: parcliseObs.recordset[0],
            transp: parcliseTranspObs.recordset[0].transp
        })
    } catch (error) {
        console.log(error);
        res.send('error')
    }
}

module.exports = {
    home,
    pedidosKorp,
    pedidosKorpDetalhes
};