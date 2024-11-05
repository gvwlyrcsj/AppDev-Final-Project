const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route to display the checkout page
router.get('/', checkoutController.viewCheckout);

// Route to confirm the checkout
router.post('/confirm', checkoutController.confirmCheckout);

module.exports = router;
