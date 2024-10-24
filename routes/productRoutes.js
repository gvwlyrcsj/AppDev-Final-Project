const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // Import your database connection pool

// Route to display products
router.get('/', (req, res) => {
    const query = 'SELECT * FROM addproducts'; // SQL query to fetch all products

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching products: ', err);
            return res.status(500).send('Internal Server Error');
        }

        // Pass the products and userId (from session) to the product.ejs template
        res.render('product', {
            product: result,   // Make sure the key here matches what you use in EJS
            userId: req.session.userId || null // Pass userId if available
        });
    });
});

module.exports = router;
