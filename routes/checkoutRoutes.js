const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const userProfileController = require('../controllers/userProfileController');

router.get('/', checkoutController.viewCheckout);
router.post('/confirm', checkoutController.confirmCheckout);
router.get('/edit-address', userProfileController.editAddressPage);
router.post('/update-address', userProfileController.updateAddress);
router.get('/checkoutSuccess', checkoutController.checkoutSuccess);
router.post('/confirmCheckout', checkoutController.confirmCheckout);
router.post('/cancel', checkoutController.cancelOrder);

module.exports = router;
