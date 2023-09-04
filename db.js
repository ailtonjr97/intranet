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

let insertUser = async(user)=>{
    const conn = await connect();
    const values = [user.name, user.email, user.password]
    await conn.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', values)
}

module.exports = {insertUser};