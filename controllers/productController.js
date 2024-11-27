const Product = require('../models/Product');
const path = require('path');

exports.search = async (req, res) => {
    const searchTerm = req.query.q || ''; // Get the search term from query params
    try {
        const products = await Product.searchByNameOrDescription(searchTerm);
        res.json(products); // Respond with the search results as JSON
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Database query error' });
    }
};

// Display all products
exports.getManageProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }

        // Check for low stock products
        products.forEach(product => {
            if (product.quantity_in_stock < 100) {
                console.warn(`Warning: Low stock for product ID ${product.id}`);
            }
        });

        res.render('manageProduct', {
            products,
            userId: res.locals.userId,
            username: res.locals.username
        });
    });
};

// ... other controller methods unchanged

exports.fetchProducts = (req, res, next) => {
    Product.getAll((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.locals.products = products;
        next();
    });
};

// Render the add product form
exports.getAddProduct = (req, res) => {
    res.render('addProduct');
};

// Handle adding a new product
exports.postAddProduct = (req, res) => {
    const { name, description, price } = req.body;
    const image = req.files?.image;
    let imageUrl = null;

    if (image) {
        imageUrl = `/uploads/${image.name}`;
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        image.mv(uploadPath, (error) => {
            if (error) {
                return res.status(500).send('Error uploading image');
            }
            Product.create(name, description, price, imageUrl, (err) => {
                if (err) {
                    return res.status(500).send('Error adding product');
                }
                res.redirect('/manageProduct');
            });
        });
    } else {
        Product.create(name, description, price, imageUrl, (err) => {
            if (err) {
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
        if (error) {
            return res.status(500).send('Error fetching product');
        }
        if (!product) {
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
        const imageUrl = `/uploads/${image.name}`;
        const uploadPath = path.join(__dirname, '../public/uploads', image.name);

        image.mv(uploadPath, (error) => {
            if (error) {
                return res.status(500).send('Error uploading image');
            }
            Product.update(productId, name, description, price, imageUrl)
                .then(() => res.redirect('/manageProduct'))
                .catch((err) => res.status(500).send('Error updating product'));
        });
    } else {
        Product.update(productId, name, description, price, null)
            .then(() => res.redirect('/manageProduct'))
            .catch((err) => res.status(500).send('Error updating product'));
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