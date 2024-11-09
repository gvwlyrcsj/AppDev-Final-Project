const ProductModel = require('../models/kiosk');

exports.getProductList = async (req, res) => {
    try {
        const [products] = await ProductModel.getAll(); // Fetch all products
        res.render('product', { addproduct: products, userId: req.session?.userId || null });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};
