const ProductModel = require('../models/Product');

<<<<<<< Updated upstream
exports.getProductList = async (req, res) => {
=======

exports.getCart = async (req, res) => {
>>>>>>> Stashed changes
    try {
        const [products] = await ProductModel.getAll(); // Fetch all products
        res.render('product', { addproduct: products, userId: req.userId });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};
<<<<<<< Updated upstream
=======

exports.checkout = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/sign-in');

        // Get selected item IDs from request body
        const selectedItems = JSON.parse(req.body.selectedItems);

        // Fetch only selected cart items
        const cartItems = await Cart.getSelectedCartDetails(userId, selectedItems);

        // Calculate total for selected items
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Render the checkout page with selected items and total
        res.render('checkout', { cartItems, total });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).send("Error processing checkout");
    }
};

>>>>>>> Stashed changes
