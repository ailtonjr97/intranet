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

let selectClientes = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sa1_clientes');
    return rows;
}

let selectCliente = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sa1_clientes WHERE id = ?', id);
    return rows[0];
}

let countClientes = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem_clientes FROM sa1_clientes');
    return rows[0].contagem_clientes;
}

let insertClientes = async(clientes)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sa1_clientes");

    let values = [];

    clientes.forEach(cliente => {
        values.push([
            cliente.cod,
            cliente.nome,
            cliente.cod_mun,
            cliente.mun,
            cliente.nreduz,
            cliente.grpven,
            cliente.loja,
            cliente.end,
            cliente.codpais,
            cliente.est,
            cliente.cep,
            cliente.tipo,
            cliente.cgc,
            cliente.filial,
            cliente.xcartei
        ]) 
    });

    await conn.query("INSERT INTO sa1_clientes (cod, nome, cod_mun, mun, nreduz, grpven, loja, endereco, codpais, est, cep, tipo, cgc, filial, xcartei) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

module.exports = {
    selectClientes,
    countClientes,
    insertClientes,
    selectCliente
};