const db = require('./db');

const Product = {
    searchByNameOrDescription: async (searchTerm) => {
        const query = `
            SELECT * FROM addproducts 
            WHERE name LIKE ? OR description LIKE ?
        `;
        const [results] = await db.promise().query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
        return results;
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM addproducts';
        db.query(sql, (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    },

    create: (name, description, price, imageUrl, quantity_in_stock, unit, callback) => {
        const query = `
            INSERT INTO addproducts (name, description, price, imageUrl, quantity_in_stock, unit)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [name, description, price, imageUrl, quantity_in_stock || 0, unit || null], (err, results) => {
            if (err) {
                console.error('Error inserting product into database:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM addproducts WHERE id = ?';
        db.query(sql, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result[0]);
        });
    },

    update: (id, name, description, price, imageUrl, quantity_in_stock, unit, callback) => {
        let sql = `
            UPDATE addproducts
            SET name = ?, description = ?, price = ?, quantity_in_stock = ?, unit = ?
        `;
        const params = [name, description, price, quantity_in_stock || 0, unit || null];

        if (imageUrl) {
            sql += ', imageUrl = ?';
            params.push(imageUrl);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        db.query(sql, params, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM addproducts WHERE id = ?';
        db.query(sql, [id], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    decrementInventory: async (productId, size, quantity) => {
        const sizeMapping = {
            small: { powder: 10, cupId: 12, cupAmount: 1, milk: 100 },
            medium: { powder: 15, cupId: 14, cupAmount: 1, milk: 150 },
            large: { powder: 20, cupId: 15, cupAmount: 1, milk: 200 },
            xl: { powder: 25, cupId: 16, cupAmount: 1, milk: 250 }
        };

        const decrement = sizeMapping[size];
        if (!decrement) throw new Error('Invalid size');

        const productsToDecrement = [
            { id: productId, amount: decrement.powder * quantity }, // Powder (e.g., Milk tea powder)
            { id: decrement.cupId, amount: decrement.cupAmount * quantity }, // Cup size specific ID
            { id: '11', amount: decrement.milk * quantity }, // Assuming '11' is the ID for milk
            { id: '13', amount: quantity } // Assuming '13' is the ID for straws
        ];

        for (let product of productsToDecrement) {
            const query = `
                UPDATE addproducts
                SET quantity_in_stock = quantity_in_stock - ?
                WHERE id = ?
            `;
            await db.promise().query(query, [product.amount, product.id]);
        }
    }
};

module.exports = Product;
