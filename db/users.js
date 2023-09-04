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
    const [rows] = await conn.query('SELECT COUNT(*) AS usersCount FROM users');
    return rows[0];
}

let insertUser = async(user)=>{
    const conn = await connect();
    const values = [user.name, user.email, user.password, user.salt];
    await conn.query('INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)', values);
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

module.exports = {insertUser, users, countUsers, getUserByUsername, getUserById};