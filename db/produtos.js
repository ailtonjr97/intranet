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

let insertProduto = async(produtos)=>{
    const conn = await connect();
    let values = []
    produtos.forEach(produto => {
        conn.query('INSERT INTO produtos (cod, tipo, um, grupo, peso, urev, descri, pesbru) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            produto.cod, produto.tipo, produto.um, produto.grupo, produto.peso, produto.urev, produto.desc, produto.pesbru
        ])
    });
}

module.exports = {
    insertProduto
};