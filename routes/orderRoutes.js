const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orderHistory', orderController.getOrderHistory);
router.get('/orders', orderController.getAllOrders);
router.post('/update-order-status', orderController.updateOrderStatus);

module.exports = router;
