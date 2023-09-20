const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: '192.168.0.85',
        port: '3306',
        user: 'intranet_totvs',
        password: 'Lambari171',
        database: 'INTRANET_TOTVS',
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

let selectPedidosDeVenda = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sc5_pedidosdevenda');
    return rows;
}

let selectPedidoDeVenda = async(num)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM sc5_pedidosdevenda WHERE num = ?', num);
    return rows[0];
}


let countPedidosDeVenda = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS contagem FROM sc5_pedidosdevenda');
    return rows[0].contagem;
}

let insertPedidosDeVenda = async(results)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sc5_pedidosdevenda");

    let values = [];

    results.forEach(result => {
        values.push([
            result.nota,
            result.tpfrete,
            result.condpag,
            result.tipocli,
            result.blq,
            result.liberok,
            result.lojacli,
            result.vend1,
            result.cliente,
            result.tipo,
            result.num,
            result.emissao,
            result.xflagtr,
            result.filial,
            result.xpedtr
        ]) 
    });

    await conn.query("INSERT INTO sc5_pedidosdevenda (nota, tpfrete, condpag, tipocli, blq, liberok, lojacli, vend1, cliente, tipo, num, emissao, xflagtr, filial, xpedtr) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

let insertItensPedidoDeVenda = async(results)=>{
    const conn = await connect();

    await conn.query("TRUNCATE sc6_itenspedidodevenda");

    let values = [];

    results.forEach(result => {
        values.push([
            result.loja,
            result.num,
            result.item,
            result.produto,
            result.qtdven,
            result.qtdent,
            result.prcven,
            result.descont,
            result.valor,
            result.oper,
            result.tes,
            result.cf,
            result.cli,
            result.entreg,
            result.datfat,
            result.nota,
            result.blq,
            result.filial,
        ]) 
    });

    await conn.query("INSERT INTO sc6_itenspedidodevenda (loja, num, item, produto, qtdven, qtdent, prcven, descont, valor, oper, tes, cf, cli, entreg, datfat, nota, blq, filial) VALUES ?", [values], function(err) {
        if (err) throw err;
    });
}

let selectPedidosMaisItens = async(num)=>{
    const conn = await connect();
    const [rows] = await conn.query("select sc6.produto as 'produto', sb1.descri 'descritivo' from sc6_itenspedidodevenda sc6 inner join sc5_pedidosdevenda as sc5 on sc6.num = sc5.num inner join sb1_produtos as sb1 on sc6.produto = sb1.cod where sc5.num = ?", num);
    return rows;
}

module.exports = {
    selectPedidosDeVenda,
    countPedidosDeVenda,
    insertPedidosDeVenda,
    insertItensPedidoDeVenda,
    selectPedidosMaisItens,
    selectPedidoDeVenda
};