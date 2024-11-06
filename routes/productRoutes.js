const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const Cart = require('../models/Cart');

// Function to fetch products from the database
function getProductsFromDatabase(callback) {
    const query = 'SELECT * FROM addproducts';
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
        const userId = req.session.userId; // Get userId from session
        res.render('product', { product: addproduct, userId: userId });
    });
});

// Route to view details of a specific product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;

    // Fetch product by ID from the database
    const query = 'SELECT * FROM addproducts WHERE id = ?';
    pool.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product details:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        const product = results[0]; // Get the first product
        res.render('productDetails', { product: product }); // Render the product details view
    });
});

// Route to handle adding products to the cart
router.post('/cart/add', (req, res) => {
    const { productId, size, quantity } = req.body;
    const userId = req.session.userId;

    // Log userId to check if it's retrieved correctly
    console.log("User ID from session:", userId);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not logged in.' });
    }
    if (!productId || !size || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid input data.' });
    }

    // Proceed to add the item to the cart
    Cart.addToCart(userId, productId, size, quantity, (error, result) => {
        if (error) {
            console.error('Error adding to cart:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while adding the product to the cart.' });
        }
        // Send success response if addition is successful
        return res.json({ success: true, message: 'Product added to cart successfully!' });
    });
});

module.exports = router;
