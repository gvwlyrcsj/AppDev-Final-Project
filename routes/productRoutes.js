const express = require('express');
const router = express.Router();
const db = require('../models/db');
const Cart = require('../models/Cart'); // Ensure you have this model for cart operations

// Function to fetch products from the database
async function getProductsFromDatabase() {
    const query = 'SELECT * FROM addproducts'; // Adjust this according to your table
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Route to render the product page
router.get('/', async (req, res) => {
    try {
        const addproduct = await getProductsFromDatabase(); // Fetch products from your database
        const userId = req.session.userId; // Get userId from session
        res.render('product', { product: addproduct, userId: userId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle adding products to the cart
router.post('/cart/add', async (req, res) => {
    const { productId, size, quantity } = req.body;
    const userId = req.session.userId; // Get userId from session

    // Check if user is logged in
    if (!userId) {
        return res.redirect('/sign-up'); // Redirect to sign-up page if not logged in
    }

    // Check if all required data is present
    if (!productId || !size || !quantity) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        const result = await Cart.addToCart(userId, productId, size, quantity);
        
        if (result) {
            return res.json({ success: true, message: 'Product added to cart successfully!' });
        } else {
            return res.json({ success: false, message: 'Failed to add product to cart.' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while adding the product to the cart.' });
    }
});

module.exports = router;
