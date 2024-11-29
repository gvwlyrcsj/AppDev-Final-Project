const Product = require('../models/Product');
const path = require('path');

// Display all products
exports.getManageProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.render('manageProduct', {
            products,
            userId: res.locals.userId,
            username: res.locals.username
        });
    });
};

// Render the add product form
exports.getAddProduct = (req, res) => {
    res.render('addProduct', {
        userId: res.locals.userId,
        username: res.locals.username
    });
};

// Handle adding a new product
exports.postAddProduct = (req, res) => {
    const { name, description, price, quantity_in_stock, unit } = req.body;
    const image = req.files?.image;

    if (image) {
        const imageUrl = `/uploads/${image.name}`;
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        image.mv(uploadPath, (error) => {
            if (error) {
                console.error('Error uploading image:', error);
                return res.status(500).send('Error uploading image');
            }

            Product.create(name, description, price, imageUrl, quantity_in_stock, unit, (error) => {
                if (error) {
                    console.error('Error adding product to database:', error);
                    return res.status(500).send('Error adding product');
                }
                res.redirect('/manageProduct');
            });
        });
    } else {
        Product.create(name, description, price, null, quantity_in_stock, unit, (error) => {
            if (error) {
                console.error('Error adding product to database:', error);
                return res.status(500).send('Error adding product');
            }
            res.redirect('/manageProduct');
        });
    }
};

// Render the update product form
exports.getUpdateProduct = (req, res) => {
    const productId = req.params.id;

    Product.findById(productId, (error, product) => {
        if (error || !product) {
            return res.status(404).send('Product not found');
        }
        res.render('updateProduct', {
            product,
            userId: res.locals.userId,
            username: res.locals.username
        });
    });
};

// Handle updating an existing product
exports.postUpdateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, description, price, quantity_in_stock, unit } = req.body;
    const image = req.files?.image;

    if (image) {
        const imageUrl = `/uploads/${image.name}`;
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        image.mv(uploadPath, (error) => {
            if (error) {
                return res.status(500).send('Error uploading image');
            }
            Product.update(productId, name, description, price, imageUrl, quantity_in_stock, unit, (error) => {
                if (error) {
                    return res.status(500).send('Error updating product');
                }
                res.redirect('/manageProduct');
            });
        });
    } else {
        Product.update(productId, name, description, price, null, quantity_in_stock, unit, (error) => {
            if (error) {
                return res.status(500).send('Error updating product');
            }
            res.redirect('/manageProduct');
        });
    }
};

// Handle deleting a product
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;

    Product.delete(productId, (error) => {
        if (error) {
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/manageProduct');
    });
};

exports.updateProductQuantity = (req, res) => {
    const productId = req.params.id;
    const additionalQuantity = parseInt(req.body.quantity);

    Product.findById(productId, (error, product) => {
        if (error || !product) {
            return res.status(404).send('Product not found');
        }

        const newQuantity = product.quantity_in_stock + additionalQuantity;
        Product.updateQuantity(productId, newQuantity, (error) => {
            if (error) {
                return res.status(500).send('Error updating product quantity');
            }
            res.send('Product quantity updated successfully');
        });
    });
};
