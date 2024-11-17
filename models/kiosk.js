const db = require('./db'); 

// Fetch all products
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM addproducts'; 
        db.query(sql, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

// Add a new product
exports.create = (name, description, price, imageUrl) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO addproducts (name, description, price, imageUrl) VALUES (?, ?, ?, ?)';
        db.query(query, [name, description, price, imageUrl], (err, results) => {
            if (err) {
                console.error('Error inserting product into database:', err);
                return reject(err); 
            }
            resolve(results); 
        });
    });
};

// Find a product by its ID
exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM addproducts WHERE id = ?'; 
        db.query(sql, [id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result[0]);
        });
    });
};

// Update an existing product
exports.update = (id, name, description, price, imageUrl) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE addproducts SET name = ?, description = ?, price = ?'; 
        const params = [name, description, price];

        if (imageUrl) {
            sql += ', imageUrl = ?';
            params.push(imageUrl);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        db.query(sql, params, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

// Delete a product
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM addproducts WHERE id = ?'; 
        db.query(sql, [id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};
