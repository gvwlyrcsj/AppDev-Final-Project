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
             ORDER BY orders.order_date ASC`, 
            [userId]
        );

        res.render('orderHistory', { orderHistory });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).send("Error fetching order history");
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [allOrders] = await pool.promise().query(
            `SELECT orders.id AS order_id, orders.order_date, orders.order_status AS status, 
                    order_items.product_id, order_items.size, order_items.quantity, order_items.price, 
                    addproducts.name AS product_name, addproducts.imageUrl 
             FROM orders 
             JOIN order_items ON orders.id = order_items.order_id 
             JOIN addproducts ON order_items.product_id = addproducts.id 
             ORDER BY orders.order_date ASC`
        );

        // Format the order date on the server side and ensure status defaults to 'pending'
        allOrders.forEach(order => {
            const date = new Date(order.order_date);
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = ("0" + date.getMinutes()).slice(-2);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            order.formattedOrderDate = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;

            if (!order.status) {
                order.status = 'pending';  
            }
        });

        res.render('orders', { allOrders });
    } catch (error) {
        console.error("Error fetching all order histories:", error);
        res.status(500).send("Error fetching all order histories");
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await pool.promise().query(
            `UPDATE orders SET order_status = ? WHERE id = ?`,
            [status, orderId]
        );

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
