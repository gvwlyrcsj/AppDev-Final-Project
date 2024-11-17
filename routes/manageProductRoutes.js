const express = require('express');
const router = express.Router();
const manageProductController = require('../controllers/manageProductController');

// Middleware to ensure the user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.redirect('/sign-in?accessDenied=true'); 
    }
};

// Route to view all products
router.get('/', ensureAdmin, manageProductController.getManageProducts);

// Route to render the add product form
router.get('/addProduct', ensureAdmin, manageProductController.getAddProduct);
router.post('/addProduct', ensureAdmin, manageProductController.postAddProduct);

// Route to render the update product form
router.get('/updateProduct/:id', ensureAdmin, manageProductController.getUpdateProduct);
router.post('/updateProduct/:id', ensureAdmin, manageProductController.postUpdateProduct);

// Route to delete a product
router.get('/deleteProduct/:id', ensureAdmin, manageProductController.deleteProduct);

module.exports = router;
