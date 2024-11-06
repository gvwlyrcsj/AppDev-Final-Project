const Cart = require('../models/Cart');
const Checkout = require('../models/Checkout');

const Product = require('../models/Product'); // Assuming Product model to fetch product details

exports.viewCheckout = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/sign-in');

    try {
        const { productId, size, quantity, price } = req.query;

        if (productId && size && quantity && price) {
            // Fetch product details from the database
            const product = await Product.findById(productId); // Adjust to your database method
            if (!product) {
                return res.status(404).send("Product not found.");
            }

            const total = parseFloat(price) * parseInt(quantity);

            // Render checkout with a single product item
            return res.render('checkout', {
                cartItems: [{
                    product_id: productId,
                    name: product.name, // Adding product name
                    imageUrl: product.imageUrl, // Adding product image URL
                    size: size,
                    quantity: parseInt(quantity),
                    price: parseFloat(price)
                }],
                total
            });
        }

        // Full cart checkout
        const cartItems = await Cart.getCartDetails(userId);
        
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

    const { productId, size, quantity, price } = req.query;

    if (productId && size && quantity && price) {
        // Calculate total for single product checkout
        const total = parseFloat(price) * parseInt(quantity);

        createOrder(userId, total, (err, orderId) => {
            if (err) {
                console.error("Error during checkout:", err);
                return res.status(500).send("An error occurred while processing your order.");
            }

            addOrderItems(orderId, [{
                product_id: productId,
                size,
                quantity: parseInt(quantity),
                price: parseFloat(price)
            }], (err) => {
                if (err) {
                    console.error("Error adding order items:", err);
                    return res.status(500).send("An error occurred while adding order items.");
                }

                res.render('checkoutSuccess', { orderId });
            });
        });
    } else {
        // Process regular cart checkout if no single product is specified
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
    }
};
