const Product = require('../models/Product');

exports.getProductList = (req, res) => {
    Product.getAll((error, products) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).send('Error fetching products');
        }
        const userId = req.session.userId; // Get userId from session
        res.render('product', { product: products, userId });
    });
};

exports.getProductDetails = (req, res) => {
    const productId = req.params.id;
    Product.findById(productId, (error, product) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Error fetching product');
        }
        res.render('productDetails', { product });
    });
};

// Add new product
exports.addProduct = (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    Product.create(name, description, price, imageUrl, (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.status(500).send('Error adding product');
        }
        res.redirect('/product');
    });
};

// Update a product
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, description, price, imageUrl } = req.body;
    Product.update(productId, name, description, price, imageUrl, (error, results) => {
        if (error) {
            console.error('Error updating product:', error);
            return res.status(500).send('Error updating product');
        }
        res.redirect('/product');
    });
};

// Delete a product
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    Product.delete(productId, (error, results) => {
        if (error) {
            console.error('Error deleting product:', error);
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/product');
    });
};
