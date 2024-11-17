const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get the user's cart
router.get('/', cartController.getCart);
router.post('/checkout', cartController.checkout);

// POST route to add item to cart
router.post('/add', authMiddleware, cartController.addToCart);

router.delete('/delete/:id', cartController.removeItem);

router.post('/checkoutSuccess', cartController.checkoutSuccess);

module.exports = router;
