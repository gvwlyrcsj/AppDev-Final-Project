const mysql = require('mysql2');
const pool = require('./db');
const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = ?';
            const [results] = await pool.promise().query(query, [username]);
            return results.length > 0 ? results[0] : null;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email) {
        try {
            const sql = 'SELECT id, username, email, password, role FROM users WHERE email = ?';
            const [results] = await pool.promise().query(sql, [email]);
            return results[0] || null;
        } catch (err) {
            throw err;
        }
    }

    static async create(username, email, password, role) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
            const [results] = await pool.promise().query(sql, [username, email, hashedPassword, role]);
            return results;
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        try {
            const sql = 'SELECT id, username, email FROM users WHERE id = ?';
            const [results] = await pool.promise().query(sql, [id]);
            return results[0] || null;
        } catch (err) {
            throw err;
        }
    }

    static async updateBasicInfo(id, username, email) {
        try {
            const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
            const [results] = await pool.promise().query(sql, [username, email, id]);
            return results;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;
