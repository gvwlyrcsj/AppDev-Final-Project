const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Function to fetch products from the database
function getProductsFromDatabase(callback) {
    const query = "SELECT * FROM addproducts WHERE description LIKE '%milktea%'";
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
}

// Route to render the product page
router.get('/', (req, res) => {
    getProductsFromDatabase((error, addproduct) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.render('kiosk', { product: addproduct });
    });
});

module.exports = router;
