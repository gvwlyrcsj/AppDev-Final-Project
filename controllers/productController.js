const ProductModel = require('../models/Product');

exports.getProductList = async (req, res) => {
    try {
        const [products] = await ProductModel.getAll(); // Fetch all products
        const userId = req.session.userId; // Get userId from session
        res.render('product', { addproduct: products, userId: userId });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};
