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

let users = async(req, res)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
}

let countUsers = async(req, res)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS usersCount FROM users WHERE active = 1');
    return rows[0];
}

let insertUser = async(user)=>{
    const conn = await connect();
    const values = [user.name, user.email, user.password, user.salt, 1, 0];
    await conn.query('INSERT INTO users (name, email, password, salt, active, admin) VALUES (?, ?, ?, ?, ?, ?)', values);
}

let getUserByUsername = async(username)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', username);
    return rows[0];
}

let getUserByIntranetID = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users WHERE intranet_id = ?', id);
    return rows[0];
}

let getUserById = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', id);
    return rows[0];
}

let inactiveUsersCount = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT COUNT(*) AS inactiveUsersCount FROM users WHERE active = 0');
    return rows[0];
}

let inactivateUser = async(id)=>{
    const conn = await connect();
    await conn.query('UPDATE users SET active = 0 WHERE id = ?', id);
}

let activateUser = async(id)=>{
    const conn = await connect();
    await conn.query('UPDATE users SET active = 1 WHERE id = ?', id);
}

let editarUser = async(parameter, body)=>{
    const conn = await connect();
    const values = [body.name, body.email, body.admin, parameter];
    await conn.query('UPDATE users SET name = ?, email = ?, admin = ? WHERE id = ?', values);
}

let changePassword = async(id, hashedPassword)=>{
    const conn = await connect();
    const values = [hashedPassword, id];
    await conn.query('UPDATE users SET password = ? WHERE id = ?', values);
}



module.exports = {
    insertUser,
    users,
    countUsers,
    getUserByUsername,
    getUserById,
    inactiveUsersCount,
    inactivateUser,
    activateUser,
    editarUser,
    changePassword,
    getUserByIntranetID
};