const mysql = require('mysql2');

// Setting up a connection pool to manage database connections
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password if needed
    database: 'db_users' // Ensure the database name is correct
});

module.exports = pool;
