const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "climbing0673",
    database: "diwaninscription"
});

module.exports = pool;