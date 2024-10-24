const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // Import your database connection pool

// Route to add product to cart
router.post('/add', (req, res) => {
    const { productId, userId } = req.body;

    // SQL query to insert product into the cart table
    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)'; // Default quantity is 1 for simplicity

    pool.query(query, [userId, productId], (err, result) => {
        if (err) {
            console.error('Error adding product to cart: ', err);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/cart'); // Redirect to cart page after adding the product
    });
});

module.exports = router;
