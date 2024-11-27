const Admin = require('../models/Admin');
const db = require('../models/db');
const moment = require('moment');  

//display admin dashboard's analytics
exports.getDashboardData = async (req, res) => {
    try {
        // Fetch sales data from model
        const monthlySales = await Admin.getMonthlySales();
        const weeklySales = await Admin.getWeeklySales();
        const dailySales = await Admin.getDailySales();

        // Get best seller
        const bestSeller = await Admin.getBestSeller();
        const bestSellerProduct = await Admin.getBestSellerProduct(bestSeller[0].product_id);

        // Fetch past 7 days' sales data
        const past7DaysSales = await Admin.getPast7DaysSales();
        const dates = past7DaysSales.map(sale => sale.date);
        const sales = past7DaysSales.map(sale => sale.total);

        res.render('admin', {
            monthlySales: monthlySales[0].total,
            weeklySales: weeklySales[0].total,
            dailySales: dailySales[0].total,
            bestSeller: bestSellerProduct[0].name,
            bestSellerImage: bestSellerProduct[0].imageUrl,
            salesDates: JSON.stringify(dates),
            salesData: JSON.stringify(sales)
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Error fetching dashboard data');
    }
};

exports.getReportPage = (req, res) => {
    res.render('report', { rows: null }); // Initial load with no data
};

exports.generateReport = async (req, res) => {
    const { reportType, startDate, endDate } = req.body;

    try {
        let query = '';
        let params = [];

        switch (reportType) {
            case 'daily':
                query = `SELECT DATE_FORMAT(order_date, '%m/%d/%Y') AS date, 
                                COUNT(orders.id) AS order_count, 
                                SUM(order_items.quantity * order_items.price) AS total_sale 
                         FROM orders 
                         JOIN order_items ON orders.id = order_items.order_id
                         WHERE DATE(order_date) = CURDATE()
                         GROUP BY DATE_FORMAT(order_date, '%m/%d/%Y')`;
                break;
            case 'weekly':
                query = `SELECT DATE_FORMAT(order_date, '%m/%d/%Y') AS date, 
                                COUNT(orders.id) AS order_count, 
                                SUM(order_items.quantity * order_items.price) AS total_sale 
                         FROM orders 
                         JOIN order_items ON orders.id = order_items.order_id
                         WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
                         GROUP BY DATE_FORMAT(order_date, '%m/%d/%Y')
                         UNION ALL
                         SELECT 'TOTAL' AS date, 
                                SUM(order_count) AS order_count, 
                                SUM(total_sale) AS total_sale 
                         FROM (
                             SELECT WEEK(order_date) AS week, 
                                    COUNT(orders.id) AS order_count, 
                                    SUM(order_items.quantity * order_items.price) AS total_sale 
                             FROM orders 
                             JOIN order_items ON orders.id = order_items.order_id
                             WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
                             GROUP BY WEEK(order_date)
                         ) AS week_data`;
                break;
            case 'monthly':
                query = `SELECT DATE_FORMAT(order_date, '%m/%d/%Y') AS date, 
                                COUNT(orders.id) AS order_count, 
                                SUM(order_items.quantity * order_items.price) AS total_sale 
                         FROM orders 
                         JOIN order_items ON orders.id = order_items.order_id
                         WHERE MONTH(order_date) = MONTH(CURDATE())
                         GROUP BY DATE_FORMAT(order_date, '%m/%d/%Y')
                         UNION ALL
                         SELECT 'TOTAL' AS date, 
                                SUM(order_count) AS order_count, 
                                SUM(total_sale) AS total_sale 
                         FROM (
                             SELECT WEEK(order_date) AS week, 
                                    COUNT(orders.id) AS order_count, 
                                    SUM(order_items.quantity * order_items.price) AS total_sale 
                             FROM orders 
                             JOIN order_items ON orders.id = order_items.order_id
                             WHERE MONTH(order_date) = MONTH(CURDATE())
                             GROUP BY WEEK(order_date)
                         ) AS week_data`;
                break;
                case 'yearly':
                    query = `SELECT DATE_FORMAT(order_date, '%Y-%m-%d') AS date, 
                                    COUNT(orders.id) AS order_count, 
                                    SUM(order_items.quantity * order_items.price) AS total_sale 
                             FROM orders 
                             JOIN order_items ON orders.id = order_items.order_id
                             WHERE YEAR(order_date) = YEAR(CURDATE())
                             GROUP BY DATE_FORMAT(order_date, '%Y-%m-%d')
                             ORDER BY DATE_FORMAT(order_date, '%Y-%m-%d')`;
                    break;
                                
            case 'custom':
                query = `SELECT DATE_FORMAT(order_date, '%m/%d/%Y') AS date, 
                                COUNT(orders.id) AS order_count, 
                                SUM(order_items.quantity * order_items.price) AS total_sale 
                         FROM orders 
                         JOIN order_items ON orders.id = order_items.order_id
                         WHERE DATE(order_date) BETWEEN ? AND ?
                         GROUP BY DATE_FORMAT(order_date, '%m/%d/%Y')
                         UNION ALL
                         SELECT 'TOTAL' AS date, 
                                SUM(order_count) AS order_count, 
                                SUM(total_sale) AS total_sale 
                         FROM (
                             SELECT WEEK(order_date) AS week, 
                                    COUNT(orders.id) AS order_count, 
                                    SUM(order_items.quantity * order_items.price) AS total_sale 
                             FROM orders 
                             JOIN order_items ON orders.id = order_items.order_id
                             WHERE DATE(order_date) BETWEEN ? AND ?
                             GROUP BY WEEK(order_date)
                         ) AS week_data`;
                params = [startDate, endDate, startDate, endDate];
                break;
            default:
                return res.status(400).send('Invalid report type');
        }

        const [rows] = await db.promise().query(query, params);

        const bestSellerQuery = `SELECT DATE_FORMAT(orders.order_date, '%m/%d/%Y') AS date, addproducts.name AS product_name, SUM(order_items.quantity) AS total_quantity
                                 FROM order_items 
                                 JOIN orders ON order_items.order_id = orders.id
                                 JOIN addproducts ON order_items.product_id = addproducts.id
                                 WHERE DATE(orders.order_date) BETWEEN ? AND ?
                                 GROUP BY DATE_FORMAT(orders.order_date, '%m/%d/%Y'), addproducts.name
                                 ORDER BY DATE_FORMAT(orders.order_date, '%m/%d/%Y'), total_quantity DESC`;

        const [bestSellers] = await db.promise().query(bestSellerQuery, [startDate || '2021-01-01', endDate || '2099-12-31']);

        const bestSellerMap = bestSellers.reduce((acc, curr) => {
            if (!acc[curr.date] || acc[curr.date].total_quantity < curr.total_quantity) {
                acc[curr.date] = curr;
            }
            return acc;
        }, {});

        res.render('report', { rows, reportType, startDate, endDate, bestSellers: bestSellerMap });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getManageAdminPage = async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, username, email, role FROM users WHERE role = "admin"');
        res.render('manageAdmin', { users });
    } catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchUser = async (req, res) => {
    const { search } = req.body;

    try {
        const [users] = await db.promise().query('SELECT id, username, email, role FROM users WHERE username LIKE ?', [`%${search}%`]);
        res.render('manageAdmin', { users });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        // Fetch sales data
        const monthlySales = await Admin.getMonthlySales();
        const weeklySales = await Admin.getWeeklySales();
        const dailySales = await Admin.getDailySales();
        const yearlySales = await Admin.getYearlySales();

        // Get best seller
        const bestSeller = await Admin.getBestSeller();
        const bestSellerProduct = await Admin.getBestSellerProduct(bestSeller[0].product_id);

        // Fetch past 7 days' sales data
        const past7DaysSales = await Admin.getPast7DaysSales();
        const dates = past7DaysSales.map(sale => sale.date);
        const sales = past7DaysSales.map(sale => sale.total);

        res.render('admin', {
            monthlySales: monthlySales[0].total,
            weeklySales: weeklySales[0].total,
            dailySales: dailySales[0].total,
            yearlySales: yearlySales[0].total,
            bestSeller: bestSellerProduct[0].name,
            bestSellerImage: bestSellerProduct[0].imageUrl,
            salesDates: JSON.stringify(dates),
            salesData: JSON.stringify(sales),
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Error fetching dashboard data');
    }
};

exports.updateUserRole = async (req, res) => {
    const { userId, role } = req.body;

    try {
        await db.promise().query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        res.redirect('/manageAdmin');
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send('Internal Server Error');
    }
};

