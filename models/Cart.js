const db = require('./db');

// Function to add a product to the cart
function addToCart(userId, productId, size, quantity, price) {
    const query = 'INSERT INTO cart (user_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, productId, size, quantity, price];

    return new Promise((reject) => {
        db.execute(query, values, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return reject(error); // Reject the promise if an error occurs
            }
        });
    });
}

// Function to fetch cart details with product name, size, quantity, and price
function getCartDetails(userId) {
    const query = `
        SELECT cart.id, addproducts.name, addproducts.imageUrl, cart.size, cart.quantity, cart.price
        FROM cart
        JOIN addproducts ON cart.product_id = addproducts.id
        WHERE cart.user_id = ?;
    `;

    return new Promise((resolve, reject) => {
        db.execute(query, [userId], (error, results) => {
            if (error) {
                console.error("Error fetching cart details:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Function to remove an item from the cart
function removeItem(itemId) {
    const query = 'DELETE FROM cart WHERE id = ?';
    
    return new Promise((resolve, reject) => {
        db.execute(query, [itemId], (error, results) => {
            if (error) {
                console.error("Error deleting item:", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getSelectedCartDetails(userId, selectedItems) {
    const query = `
        SELECT cart.id, addproducts.name, addproducts.imageUrl, cart.size, cart.quantity, cart.price
        FROM cart
        JOIN addproducts ON cart.product_id = addproducts.id
        WHERE cart.user_id = ? AND cart.id IN (?);
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId, selectedItems], (error, results) => {
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