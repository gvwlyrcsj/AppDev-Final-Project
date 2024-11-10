const pool = require('../models/db');

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/sign-in');
        }

        const [orderHistory] = await pool.promise().query(
            `SELECT orders.id AS order_id, orders.order_date, orders.order_status AS status, 
                    order_items.product_id, order_items.size, order_items.quantity, order_items.price, 
                    addproducts.name AS product_name, addproducts.imageUrl 
             FROM orders 
             JOIN order_items ON orders.id = order_items.order_id 
             JOIN addproducts ON order_items.product_id = addproducts.id 
             WHERE orders.user_id = ? 
             ORDER BY orders.order_date DESC`, 
            [userId]
        );

        res.render('orderHistory', { orderHistory });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).send("Error fetching order history");
    }
};
