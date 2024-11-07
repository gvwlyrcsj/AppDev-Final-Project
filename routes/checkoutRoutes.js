const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route to display the checkout page
router.get('/', checkoutController.viewCheckout);

// Route to confirm the checkout
router.post('/confirm', checkoutController.confirmCheckout);

// Route to confirm order
router.post('/checkout/confirm', async (req, res) => {
    const { cartItems, userId, address, paymentMethod } = req.body;

    try {
        await orderController.saveOrder(cartItems, userId, address, paymentMethod);
        res.status(200).send('Order placed successfully!');
    } catch (error) {
        res.status(500).send('Error placing order');
    }
});

module.exports = router;
