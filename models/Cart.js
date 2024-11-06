const pool = require('./db');

// Function to add a product to the cart (Promise-based)
function addToCart(userId, productId, size, quantity, price) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cart (user_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)';
        const values = [userId, productId, size, quantity, price];

        pool.execute(query, values, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return reject(error); // Reject the promise with the error
            }
            resolve(results); // Resolve the promise with results on success
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

// Function to fetch selected cart details (Promise-based)
function getSelectedCartDetails(userId, selectedItems) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT cart.id, addproducts.name, addproducts.imageUrl, cart.size, cart.quantity, cart.price
            FROM cart
            JOIN addproducts ON cart.product_id = addproducts.id
            WHERE cart.user_id = ? AND cart.id IN (?);
        `;

        pool.query(query, [userId, selectedItems], (error, results) => {
            if (error) {
                console.error("Error fetching selected cart details:", error);
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
    getSelectedCartDetails
};
