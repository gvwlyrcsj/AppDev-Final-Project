const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const Cart = require('../models/Cart'); 

// Route to get the user's cart
router.get('/', cartController.getCart);
router.post('/checkout', cartController.checkout);

// POST route to add item to cart
router.post('/add', (req, res) => {
    const { userId, productId, size, quantity } = req.body;
    const parsedQuantity = parseInt(quantity, 10);

    const priceMap = { small: 59, medium: 69, large: 79, xl: 89 };
    const price = priceMap[size];

    if (!price) {
        console.error("Invalid size selected:", size);
        return res.status(400).json({ success: false, message: 'Invalid size selected.' });
    }

    try {
        Cart.addToCart(userId, productId, size, parsedQuantity, price)
            .then(() => {
                return res.json({ success: true, message: "Product added to cart successfully!" });
            })
            .catch(error => {
                console.error("Error adding to cart:", error);
                return res.status(500).json({ success: false, message: 'Error adding to cart.' });
            });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ success: false, message: 'Unexpected error occurred.' });
    }
});

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

router.post('/checkoutSuccess', async (req, res) => {
    const userId = req.session.userId;
    const cartItems = req.session.cartItems; 

    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).send('No items to checkout');
    }

    try {
        // After the checkout is successful, clear items from the cart
        await Cart.removeItems(cartItems.map(item => item.id));

        // Render the checkout success page with cart items and the total price
        res.render('checkoutSuccess', { cartItems, total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
