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

async function addToCart(user_id, product_id, size, quantity, price) {
    // Check if user_id exists in user_profile table
    const userExistsQuery = 'SELECT * FROM user_profile WHERE user_id = ?';
    
    const [user] = await db.execute(userExistsQuery, [user_id]);
    
    if (user.length === 0) {
        console.error("User does not exist!");
        return; // or throw an error if necessary
    }

    // Proceed to insert into the cart if the user exists
    const query = 'INSERT INTO cart (user_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)';
    
    try {
        await db.execute(query, [user_id, product_id, size, quantity, price]);
        console.log("Item added to cart successfully!");
    } catch (error) {
        console.error("Error adding to cart:", error);
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

async function confirmCheckout(req, res) {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/sign-in');

    const { productId, size, quantity, price } = req.query;

    try {
        // Handle single product checkout
        if (productId && size && quantity && price) {
            const total = parseFloat(price) * parseInt(quantity);
            const orderId = await createOrder(userId, total);

            // Adding a single item to the order_items table
            await addOrderItems(orderId, [{
                product_id: productId,
                size,
                quantity: parseInt(quantity),
                price: parseFloat(price)
            }]);

            return res.render('checkout', {
                cartItems: [/* cart item from query parameters */],
                total,
                shippingAddress,
                product_id: product[0].id,
                size,
                quantity: parseInt(quantity),
                price: parseFloat(price)
            });
                    }

        // Process full cart checkout
        const [cartItems] = await db.promise().query(
            'SELECT * FROM cart WHERE user_id = ?', [userId]
        );

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).send("No items to checkout.");
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderId = await createOrder(userId, total);

        // Adding all cart items to the order_items table
        await addOrderItems(orderId, cartItems);
        await clearCart(userId);

        res.render('checkoutSuccess', { orderId, cartItems, total });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    addToCart,
    clearCart,
    createOrder,
    confirmCheckout,
};
