const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send("Please sign in to view your cart.");
        }

        const cartItems = await Cart.getCartDetails(userId);
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.render('cart', { cartItems, total });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send("An error occurred while fetching the cart.");
    }
};

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