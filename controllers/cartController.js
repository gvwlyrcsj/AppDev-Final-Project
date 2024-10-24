const ProductModel = require('../models/Product');

exports.getProductList = async (req, res) => {
    try {
        const [products] = await ProductModel.getAll(); // Fetch all products
        res.render('product', { addproduct: products, userId: req.userId });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};
