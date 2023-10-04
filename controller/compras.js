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

        if(req.query.FORNECE == undefined || req.query.FORNECE == 'undefined' || req.query.FORNECE == ''){
            var FORNECE = ''
        }else{
            FORNECE = req.query.FORNECE
        }

        if(req.query.LIMITE == undefined || req.query.LIMITE == 'undefined' || req.query.LIMITE == ''){
            var LIMITE = 200
        }else{
            LIMITE = req.query.LIMITE
        }

        await sql.connect(sqlConfig);

        const parcliseQuery = `SELECT DISTINCT TOP ${LIMITE} NDOC, DTPED, FORNECE FROM PARCLISE WHERE NDOC LIKE '%${NDOC}%' AND FORNECE LIKE '%${FORNECE}%'`; //PEDIDOS ABERTOS
        const parcliseCountQuery = `SELECT COUNT(NDOC) as contagem FROM PARCLISE WHERE NDOC LIKE '%${NDOC}%' AND FORNECE LIKE '%${FORNECE}%'`; 

        const parclise = await sql.query(parcliseQuery);
        const parcliseCount = await sql.query(parcliseCountQuery);

        res.render('compras/pedidoskorp', {
            contents: parclise.recordset,
            parcliseContagem: parcliseCount.recordset[0].contagem
        });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

module.exports = {
    home,
    pedidosKorp
};