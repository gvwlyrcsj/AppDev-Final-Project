// models/User.js
const mysql = require('mysql2');
const pool = require('./db');
const bcrypt = require('bcrypt');

class User {
    static findByEmail(email) {
        const sql = 'SELECT id, username, email, password, role FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            pool.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0] || null);
            });
        });
    }

    static create(username, email, password, role) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return reject(err);
                
                const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
                pool.query(sql, [username, email, hashedPassword, role], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
        });
    }
    
    static findById(id) {
        const sql = 'SELECT id, username, email FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            pool.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0] || null);
            });
        });
    }
    
    static updateBasicInfo(id, username, email) {
        const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            pool.query(sql, [username, email, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = User;
