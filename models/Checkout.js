const db = require('./db');

async function createOrder(userId, totalAmount) {
    const query = 'INSERT INTO orders (user_id, total_amount, payment_method, order_status) VALUES (?, ?, "COD", "Pending")';

    return new Promise((resolve, reject) => {
        db.execute(query, [userId, totalAmount], (error, results) => {
            if (error) {
                console.error("Error creating order:", error);
                return reject(error);
            }
            resolve(results.insertId); // Return the new order ID
        });
    });
}

async function addOrderItems(orderId, cartItems) {
    const query = 'INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)';

    for (const item of cartItems) {
        await new Promise((resolve, reject) => {
            db.execute(query, [orderId, item.product_id, item.size, item.quantity, item.price], (error) => {
                if (error) {
                    console.error("Error adding order item:", error);
                    return reject(error);
                }
                resolve();
            });
        });
    }
}

async function clearCart(userId) {
    const query = 'DELETE FROM cart WHERE user_id = ?';

    return new Promise((resolve, reject) => {
        db.execute(query, [userId], (error) => {
            if (error) {
                console.error("Error clearing cart:", error);
                return reject(error);
            }
            resolve();
        });
    });
}

module.exports = {
    createOrder,
    addOrderItems,
    clearCart,
};
