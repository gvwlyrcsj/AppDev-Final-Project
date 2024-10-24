const express = require('express');
const router = express.Router();
const manageProductController = require('../controllers/manageProductController');

// Route to view all products
router.get('/', manageProductController.getManageProducts);

// Route to render the add product form
router.get('/addProduct', manageProductController.getAddProduct);
router.post('/addProduct', manageProductController.postAddProduct);

// Route to render the update product form
router.get('/updateProduct/:id', manageProductController.getUpdateProduct);
router.post('/updateProduct/:id', manageProductController.postUpdateProduct);

// Route to delete a product
router.get('/deleteProduct/:id', manageProductController.deleteProduct);

module.exports = router;
