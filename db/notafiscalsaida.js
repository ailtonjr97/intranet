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

let selectNotasFiscalSaida = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('select * from sf2_cabecalhonfsaida order by emissao desc');
    return rows;
}

let selectNotaFiscalSaida = async(doc)=>{
    const conn = await connect();
    const [rows] = await conn.query('select * from sf2_cabecalhonfsaida sc where doc = ?', [doc]);
    return rows[0];
}


let countNotaFiscalSaida = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem FROM sf2_cabecalhonfsaida');
    return rows[0].contagem;
}

let insertNotaFiscalSaida = async(results)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sf2_cabecalhonfsaida");

    let values = [];

    results.forEach(result => {
        values.push([
            result.emissao,
            result.filial,
            result.chvnfe,
            result.doc,
            result.serie,
            result.cliente,
            result.loja,
            result.tipocli,
            result.vend1,
            result.fimp
        ]) 
    });

    await conn.query("INSERT INTO sf2_cabecalhonfsaida (emissao, filial, chvnfe, doc, serie, cliente, loja, tipocli, vend1, fimp) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

let insertItensNotaFiscalSaida = async(results)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sd2_itensdevendanf");

    let values = [];

    results.forEach(result => {
        values.push([
            result.loja,
            result.filial,
            result.doc,
            result.serie,
            result.cliente,
            result.item,
            result.cod,
            result.um,
            result.pedido,
            result.tipo,
            result.origlan,
            result.tes,
            result.cf,
            result.quant,
            result.prunit
        ]) 
    });

    await conn.query("INSERT INTO sd2_itensdevendanf (loja, filial, doc, serie, cliente, item, cod, um, pedido, tipo, origlan, tes, cf, quant, prunit) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

let selectNFSsaidaItens= async(doc)=>{
    const conn = await connect();
    const [rows] = await conn.query("select *, sb1.descri as 'descritivo', sd2.tipo as 'sd2tipo' from sf2_cabecalhonfsaida sf2 inner join sd2_itensdevendanf as sd2 on sf2.doc = sd2.doc and sf2.serie = sd2.serie and sf2.cliente = sd2.cliente and sf2.loja = sd2.loja inner join sb1_produtos sb1 on sb1.cod = sd2.cod where sf2.doc = ? order by item asc", [doc]);
    return rows;
}

module.exports = {
    selectNotasFiscalSaida,
    countNotaFiscalSaida,
    insertNotaFiscalSaida,
    insertItensNotaFiscalSaida,
    selectNotaFiscalSaida,
    selectNFSsaidaItens,
};