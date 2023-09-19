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

let selectClientes = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM clientes');
    return rows;
}

let selectCliente = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM clientes WHERE id = ?', id);
    return rows[0];
}

let countClientes = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem_clientes FROM clientes');
    return rows[0].contagem_clientes;
}

let insertClientes = async(clientes)=>{
    const conn = await connect();

    await conn.query("TRUNCATE clientes");

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

    await conn.query("INSERT INTO clientes (cod, nome, cod_mun, mun, nreduz, grpven, loja, endereco, codpais, est, cep, tipo, cgc, filial, xcartei) VALUES ?", [values], function(err) {
        if (err) throw err;
    conn.end();
    });
}

module.exports = {
    selectClientes,
    countClientes,
    insertClientes,
    selectCliente
};