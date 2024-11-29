const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/sign-in');

        const cartItems = await Cart.getCartDetails(userId);
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

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).send("No items to checkout");
        }

        const cartItems = await Cart.getSelectedCartDetails(userId, itemIds);
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const [userProfile] = await req.db.promise().query(
            'SELECT * FROM user_profile WHERE user_id = ?', [userId]
        );

        const shippingAddress = userProfile.length > 0 ? {
            name: userProfile[0].name || "N/A",
            phone: userProfile[0].phone || "N/A",
            street_name: userProfile[0].street_name || "N/A",
            barangay: userProfile[0].barangay || "N/A",
            city: userProfile[0].city || "N/A",
            zip_code: userProfile[0].zip_code || "N/A"
        } : {};

        req.session.cartItems = cartItems;

        res.render('checkout', { cartItems, total, userProfile: shippingAddress });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).send("Error processing checkout");
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.session.userId;
    const { productId, size, quantity } = req.body;

    try {
        const parsedQuantity = parseInt(quantity, 10);
        const priceMap = { small: 59, medium: 69, large: 79, xl: 89 };
        const price = priceMap[size];

        if (!price) {
            return res.status(400).json({ success: false, message: 'Invalid size selected.' });
        }

        await Cart.addToCart(userId, productId, size, parsedQuantity, price);
        res.json({ success: true, message: "Product added to cart successfully!" });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: 'Error adding to cart.' });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        await Cart.removeItem(itemId);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ success: false, message: 'Error deleting item.' });
    }
};

exports.checkoutSuccess = (req, res) => {
    const orderId = req.params.id;

    // Fetch order details including order items
    Order.findById(orderId, (err, order) => {
        if (err || !order) {
            return res.status(404).send('Order not found');
        }

        const orderItems = order.items;

        res.render('checkoutSuccess', {
            orderItems: orderItems,
            orderId: orderId
        });
    });
};
