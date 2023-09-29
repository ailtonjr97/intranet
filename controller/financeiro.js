const axios = require("axios");
const sql = require('mssql');

const sqlConfig = {
    user: process.env.MSUSER,
    password: process.env.MSPASSWORD,
    database: process.env.MSDATABASE,
    server: process.env.MSSERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };

const home = async(req, res)=>{
    try {
            await sql.connect(sqlConfig);
            await sql.query("select * from ESTOQUE").forEach(element => {
                console.log(element)
            });
            console.log()
       } catch (error) {
            res.render('error')
            console.log(error)
       }
};

module.exports = {
    home,
};