const pool = require('./db');

// Function to add a product to the cart (Promise-based)
function addToCart(userId, productId, size, quantity, price) {
    return new Promise((resolve, reject) => {
        // First, check if the item already exists in the cart
        const checkQuery = 'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size = ?';
        const checkValues = [userId, productId, size];

        pool.execute(checkQuery, checkValues, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return reject(error);
            }

            if (results.length > 0) {
                // Item exists, update the quantity
                const existingItem = results[0];
                const newQuantity = parseInt(existingItem.quantity, 10) + parseInt(quantity, 10); // Ensure this adds the correct quantity
                const updateQuery = 'UPDATE cart SET quantity = ? WHERE id = ?';
                const updateValues = [newQuantity, existingItem.id];

                pool.execute(updateQuery, updateValues, (error, results) => {
                    if (error) {
                        console.error("Database error:", error);
                        return reject(error);
                    }
                    resolve(results);
                });
            } else {
                // Item does not exist, insert new entry
                const insertQuery = 'INSERT INTO cart (user_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)';
                const insertValues = [userId, productId, size, quantity, price];

                pool.execute(insertQuery, insertValues, (error, results) => {
                    if (error) {
                        console.error("Database error:", error);
                        return reject(error);
                    }
                    resolve(results);
                });
            }
        });
    });
}

// Function to fetch cart details (Promise-based)
function getCartDetails(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT cart.id, addproducts.name, addproducts.imageUrl, cart.size, cart.quantity, cart.price
            FROM cart
            JOIN addproducts ON cart.product_id = addproducts.id
            WHERE cart.user_id = ?;
        `;

        pool.execute(query, [userId], (error, results) => {
            if (error) {
                console.error("Error fetching cart details:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Function to remove an item from the cart (Promise-based)
function removeItem(itemId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cart WHERE id = ?';

        pool.execute(query, [itemId], (error, results) => {
            if (error) {
                console.error("Error deleting item:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getSelectedCartDetails(userId, itemIds) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT cart.id, addproducts.id AS product_id, addproducts.name, addproducts.imageUrl, cart.size, cart.quantity, cart.price
            FROM cart
            JOIN addproducts ON cart.product_id = addproducts.id
            WHERE cart.user_id = ? AND cart.id IN (${itemIds.map(() => '?').join(', ')});
        `;

        pool.execute(query, [userId, ...itemIds], (error, results) => {
            if (error) {
                console.error("Error fetching selected cart details:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function removeItems(itemIds) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cart WHERE id IN (?)';
        pool.execute(query, [itemIds], (error, results) => {
            if (error) {
                console.error("Error deleting items:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

module.exports = {
    addToCart,
    getCartDetails,
    removeItem,
    getSelectedCartDetails,
    removeItems
};
