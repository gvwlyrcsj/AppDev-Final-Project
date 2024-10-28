const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const Cart = require('../models/Cart'); // Import Cart model

// Route to get the user's cart
router.get('/', cartController.getCart);

// POST route to add item to cart
router.post('/add', (req, res) => {
    const { userId, productId, size, quantity } = req.body;

    // Log received data
    console.log("Received data:", { userId, productId, size, quantity });

    // Price map based on size
    const priceMap = { small: 59, medium: 69, large: 79, xl: 89 };
    const price = priceMap[size];

    // Check for valid size and price
    if (!price) {
        console.error("Invalid size selected:", size);
        return res.status(400).json({ success: false, message: 'Invalid size selected.' });
    }

    // Add item to cart
    Cart.addToCart(userId, productId, size, quantity, price)
        .then(() => {
            res.json({ success: true, message: "Product added to cart successfully!" });
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
            res.status(500).json({ success: false, message: 'Error adding to cart.' });
        });
});

// cartRoutes.js
router.delete('/delete/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await Cart.removeItem(itemId);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ success: false, message: 'Error deleting item.' });
    }
});


module.exports = router;
