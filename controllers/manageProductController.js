const Product = require('../models/Product');
const path = require('path');

// Display all products
exports.getManageProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.render('manageProduct', { products });
    });
};

// Render the add product form
exports.getAddProduct = (req, res) => {
    res.render('addProduct');
};

// Handle adding a new product
exports.postAddProduct = (req, res) => {
    const { name, description, price } = req.body;
    const image = req.files?.image; // Use optional chaining for safer access

    // Log the inputs received
    console.log('Adding product:', { name, description, price, image });

    if (image) {
        const imageUrl = `/uploads/${image.name}`; // Define imageUrl here
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        // Move the image to the uploads folder
        image.mv(uploadPath, (error) => {
            if (error) {
                console.error('Error uploading image:', error); // Log the image upload error
                return res.status(500).send('Error uploading image');
            }

            // Save product details into the database with the image URL
            Product.create(name, description, price, imageUrl, (error) => { // Removed image.data
                if (error) {
                    console.error('Error adding product to database:', error); // Log the database error
                    return res.status(500).send('Error adding product');
                }
                res.redirect('/manageProduct');
            });
        });
    } else {
        // Handle case where no image is uploaded
        Product.create(name, description, price, null, (error) => { // Removed image.data
            if (error) {
                console.error('Error adding product to database:', error); // Log the database error
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
        res.render('updateProduct', { product });
    });
};

// Handle updating an existing product
exports.postUpdateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;
    const image = req.files?.image;

    if (image) {
        const imageUrl = `/uploads/${image.name}`; // Define imageUrl here
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        image.mv(uploadPath, (error) => {
            if (error) {
                return res.status(500).send('Error uploading image');
            }
            Product.update(productId, name, description, price, imageUrl, (error) => {
                if (error) {
                    return res.status(500).send('Error updating product');
                }
                res.redirect('/manageProduct');
            });
        });
    } else {
        Product.update(productId, name, description, price, null, (error) => {
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
