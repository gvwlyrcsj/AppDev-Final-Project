const Admin = require('../models/Admin');

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
