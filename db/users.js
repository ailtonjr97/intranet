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
    const values = [user.name, user.email, user.password, user.salt, user.active];
    await conn.query('INSERT INTO users (name, email, password, salt, active) VALUES (?, ?, ?, ?, ?)', values);
}

let getUserByUsername = async(username)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', username);
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
    const values = [body.name, body.email, parameter];
    await conn.query('UPDATE users SET name = ?, email = ? WHERE id = ?', values);
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
    editarUser
};