const Cart = require('../models/Cart');
const Checkout = require('../models/Checkout');

exports.viewCheckout = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/sign-in');

    try {
        const cartItems = await Cart.getCartDetails(userId);
        
        // Check if cartItems are empty
        if (!cartItems || cartItems.length === 0) {
            return res.render('checkout', { cartItems: [], total: 0, message: "No items to checkout." });
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.render('checkout', { cartItems, total });
    } catch (error) {
        console.error("Error loading checkout:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.confirmCheckout = (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/sign-in');

    Cart.getCartDetails(userId, (err, cartItems) => {
        if (err || !cartItems || cartItems.length === 0) {
            return res.status(400).send("No items to checkout.");
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        createOrder(userId, total, (err, orderId) => {
            if (err) {
                console.error("Error during checkout:", err);
                return res.status(500).send("An error occurred while processing your order.");
            }

            addOrderItems(orderId, cartItems, (err) => {
                if (err) {
                    console.error("Error adding order items:", err);
                    return res.status(500).send("An error occurred while adding order items.");
                }

                clearCart(userId, (err) => {
                    if (err) {
                        console.error("Error clearing cart:", err);
                        return res.status(500).send("An error occurred while clearing your cart.");
                    }

                    res.render('checkoutSuccess', { orderId });
                });
            });
        });
    });
};
