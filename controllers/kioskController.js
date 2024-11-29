const ProductModel = require('../models/kiosk');

// Display all products
exports.getManageProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.render('manageProduct', { products });
    });
};
