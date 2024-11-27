const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.redirect('/sign-in?accessDenied=true'); // Redirect to sign-in with an accessDenied flag
    }
};

router.get('/orderHistory', orderController.getOrderHistory);
router.get('/orders', ensureAdmin, orderController.getAllOrders);
router.post('/update-order-status', orderController.updateOrderStatus);

module.exports = router;
