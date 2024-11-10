const pool = require('../models/db'); 
const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            console.log("User is not logged in.");
            return res.redirect('/sign-in');
        }

        const cartItems = await Cart.getCartDetails(userId);
        console.log("Cart Items:", cartItems);

        if (cartItems.length === 0) {
            console.log("Cart is currently empty.");
        }

        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

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

        const selectedItems = JSON.parse(req.body.selectedItems); 
        const itemIds = selectedItems.map(Number);

        console.log("Selected Items:", selectedItems);
        console.log("Item IDs:", itemIds);

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).send("No items to checkout");
        }

        const cartItems = await Cart.getSelectedCartDetails(userId, itemIds);

        if (!cartItems || cartItems.length === 0) {
            console.error("Selected cart items not found for IDs:", itemIds);
            return res.status(400).send("No cart items found for selected IDs");
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const [userProfile] = await pool.promise().query(
            'SELECT * FROM user_profile WHERE user_id = ?', [userId]
        );

        const shippingAddress = userProfile.length > 0 ? {
            street_name: userProfile[0].street_name || "N/A",
            barangay: userProfile[0].barangay || "N/A",
            city: userProfile[0].city || "N/A",
            zip_code: userProfile[0].zip_code || "N/A"
        } : {};

        req.session.cartItems = cartItems;

        res.render('checkout', { cartItems, total, shippingAddress });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).send("Error processing checkout");
    }
};

async function addOrderItems(orderId, cartItems) {
    const orderItems = cartItems.map(item => [orderId, item.product_id, item.size, item.quantity, item.price]);
    console.log("Prepared order items for batch insert:", orderItems);

    const query = 'INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES ?';

    try {
        await pool.promise().query(query, [orderItems]);
        console.log("Order items added successfully");
    } catch (error) {
        console.error("Error adding order items:", error);
        throw error;
    }
}

// Update this part of your checkoutController's confirmCheckout function
async function confirmCheckout(req, res) {
    try {
        const userId = req.session.userId;
        const cartItems = req.session.cartItems; 

        if (!userId || !cartItems || cartItems.length === 0) {
            return res.status(400).send('No items to checkout');
        }

        const orderId = 40;  // Example order ID, replace with actual logic

        await addOrderItems(orderId, cartItems);

        await Cart.removeItems(cartItems.map(item => item.id));

        res.render('checkoutSuccess', { cartItems, total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Internal Server Error');
    }
}
