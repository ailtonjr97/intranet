const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(process.env.SQLCONNECTION);
    global.connection = connection;
    return connection;
}

connect();

let selectProdutos = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM produtos');
    return rows;
}

let selectProduto = async(produto)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM produtos WHERE id = ?', produto);
    return rows[0];
}

let countProdutos = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem_produtos FROM produtos');
    return rows[0].contagem_produtos;
}


let insertProdutos = async(produtos)=>{
    const conn = await connect();

    await conn.query("TRUNCATE produtos");

    let values = [];

    produtos.forEach(produto => {
        values.push([produto.cod, produto.tipo, produto.um, produto.grupo, produto.peso, produto.urev, produto.desc, produto.pesbru]) 
    });

    await conn.query("INSERT INTO produtos (cod, tipo, um, grupo, peso, urev, descri, pesbru) VALUES ?", [values], function(err) {
        if (err) throw err;
    conn.end();
    });
}

module.exports = {
    selectProdutos,
    countProdutos,
    insertProdutos,
    selectProduto
};