const dotenv = require("dotenv");
dotenv.config();

const sqlConfig = {
    user: process.env.MSUSER,
    password: process.env.MSPASSWORD,
    database: process.env.MSDATABASE,
    server: process.env.MSSERVER,
    pool: {
      max: 40,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }
  
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
          connectionLimit: 40,
          maxIdle: 40, // max idle connections, the default value is the same as `connectionLimit`
          idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
          queueLimit: 0,
          enableKeepAlive: true,
          keepAliveInitialDelay: 10000
        });
      global.connection = pool;
      return pool;
  }

  
  module.exports = {
    sqlConfig,
    connect,
};