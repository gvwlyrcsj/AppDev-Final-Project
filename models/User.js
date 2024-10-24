const mysql = require('mysql2');
const pool = require('./db'); 
const bcrypt = require('bcrypt');

const User = {
    // Method to create a new user in the database
    create: (username, email, password, role, callback) => {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
        const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';

        try {
            pool.query(sql, [username, email, hashedPassword, role], (error, results) => {
                if (error) {
                    console.error('Error inserting user:', error); // Log the error
                    return callback(error);
                }
                callback(null, results); // Call the callback function with the results
            });
        } catch (error) {
            console.error('Unexpected error:', error); // Log unexpected errors
            callback(error);
        }
    },

    // Method to find a user by email in the database
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';

        // Query the 'users' table to find a user by email
        pool.query(sql, [email], (error, results) => {
            if (error) {
                console.error('Error finding user by email:', error); // Log the error for easier debugging
                return callback(error);
            }
            callback(null, results[0]); // Return the first user found (if any)
        });
    }
};

module.exports = User;
