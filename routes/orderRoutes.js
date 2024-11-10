const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orderHistory', orderController.getOrderHistory);

module.exports = router;
