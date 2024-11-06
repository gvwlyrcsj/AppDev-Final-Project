const db = require('./db');

// Fetch all products
exports.getAll = (callback) => {
    const sql = 'SELECT * FROM addproducts';
    db.query(sql, (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

// Add a new product
exports.create = (name, description, price, imageUrl, callback) => {
    const sql = 'INSERT INTO addproducts (name, description, price, imageUrl) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, price, imageUrl], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

// Find a product by ID
exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM addproducts WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0]); 
        });
    });
};

// Update a product
exports.update = (id, name, description, price, imageUrl, callback) => {
    let sql = 'UPDATE addproducts SET name = ?, description = ?, price = ?';
    const params = [name, description, price];
    if (imageUrl) {
        sql += ', imageUrl = ?';
        params.push(imageUrl);
    }
    sql += ' WHERE id = ?';
    params.push(id);
    db.query(sql, params, (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

// Delete a product
exports.delete = (id, callback) => {
    const sql = 'DELETE FROM addproducts WHERE id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};
