const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.viewCheckout);
router.post('/confirm', checkoutController.confirmCheckout);
router.get('/checkoutSuccess', checkoutController.checkoutSuccess);
router.get('/cancel', checkoutController.cancelOrder);

module.exports = router;
