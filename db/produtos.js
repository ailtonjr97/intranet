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

let selectProdutos = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sb1_produtos');
    return rows;
}

let selectProduto = async(produto)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sb1_produtos WHERE id = ?', produto);
    return rows[0];
}

let countProdutos = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem_produtos FROM sb1_produtos');
    return rows[0].contagem_produtos;
}


let insertProdutos = async(produtos)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sb1_produtos");

    let values = [];

    produtos.forEach(produto => {
        values.push([produto.cod, produto.tipo, produto.um, produto.grupo, produto.peso, produto.urev, produto.desc, produto.pesbru]) 
    });

    await conn.query("INSERT INTO sb1_produtos (cod, tipo, um, grupo, peso, urev, descri, pesbru) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

module.exports = {
    selectProdutos,
    countProdutos,
    insertProdutos,
    selectProduto
};