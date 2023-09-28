const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: process.env.SQLUSER,
        password: process.env.SQLPASSWORD,
        database: process.env.SQLDATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
    global.connection = pool;
    return pool;
}

connect();

const selectParametros = async()=>{
    const conn = await connect();
    const [rows] = await conn.query("select * from vpc_parametros");
    return rows
}

const countParametros = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem FROM vpc_parametros');
    return rows[0].contagem;
}

const insertParametros = async(results)=>{
    const conn = await connect();

    await conn.query("TRUNCATE vpc_parametros");

    let values = [];

    results.forEach(result => {
        values.push([
            result.systemparameterid,
            result.branchid,
            result.type,
            result.code,
            result.description[0].descriptionText,
            result.value[0].parameterValue,
        ]) 
    });

    await conn.query("INSERT INTO vpc_parametros (systemparameterid, branchid, tipo, code, description, value) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

module.exports = {
    insertParametros,
    selectParametros,
    countParametros
};