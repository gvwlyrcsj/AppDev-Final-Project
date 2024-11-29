const db = require('./db');

exports.getMonthlySales = async () => {
    const [rows] = await db.promise().query(`
        SELECT SUM(total_amount) AS total
        FROM orders
        WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    `);
    return rows;
};

exports.getWeeklySales = async () => {
    const [rows] = await db.promise().query(`
        SELECT SUM(total_amount) AS total
        FROM orders
        WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
    `);
    return rows;
};

exports.getDailySales = async () => {
    const [rows] = await db.promise().query(`
        SELECT SUM(total_amount) AS total
        FROM orders
        WHERE DATE(order_date) = CURDATE()
    `);
    return rows;
};

exports.getBestSeller = async () => {
    const [rows] = await db.promise().query(`
        SELECT product_id, SUM(quantity) AS total_sold
        FROM order_items
        GROUP BY product_id
        ORDER BY total_sold DESC
        LIMIT 1
    `);
    return rows;
};

exports.getBestSellerProduct = async (productId) => {
    const [rows] = await db.promise().query(`
        SELECT name, imageUrl
        FROM addproducts
        WHERE id = ?
    `, [productId]);
    return rows;
};

exports.getPast7DaysSales = async () => {
    const [rows] = await db.promise().query(`
        SELECT DATE(order_date) AS date, SUM(total_amount) AS total
        FROM orders
        WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(order_date)
        ORDER BY DATE(order_date)
    `);
    return rows;
};

exports.getYearlySales = async () => {
    const [rows] = await db.promise().query(`
        SELECT DATE(order_date) AS date, SUM(total_amount) AS total
        FROM orders
        WHERE YEAR(order_date) = YEAR(CURDATE())
        GROUP BY DATE(order_date)
        ORDER BY DATE(order_date)
    `);
    return rows;
};

exports.getYearlyBestSeller = async () => {
    const [rows] = await db.promise().query(`
        SELECT addproducts.id AS product_id, 
               addproducts.name AS product_name, 
               addproducts.imageUrl AS product_image, 
               SUM(order_items.quantity) AS total_sold
        FROM order_items
        JOIN orders ON order_items.order_id = orders.id
        JOIN addproducts ON order_items.product_id = addproducts.id
        WHERE YEAR(orders.order_date) = YEAR(CURDATE())
        GROUP BY addproducts.id, addproducts.name, addproducts.imageUrl
        ORDER BY total_sold DESC
        LIMIT 1
    `);
    return rows.length > 0 ? rows[0] : null; // Return the top-selling product or null if no data
};
