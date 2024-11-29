const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

app.use(flash());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//session
app.use(session({
    secret: 'hanahgwykingsk',
    resave: false,
    saveUninitialized: true
}));


app.get('/', (req, res) => {
    res.render('about', {
        userId: req.session.userId,
        username: req.session.username,
        token: req.session.token
    });
});

app.use((req, res, next) => {
    res.locals.token = req.session.token;
    res.locals.username = req.session.username;
    next();
});

// Middleware to attach the db pool to each request
app.use((req, res, next) => {
    req.db = db;
    next();
});

const authMiddleware = require('./middleware/authMiddleware');
app.use(authMiddleware);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

const productRoutes = require('./routes/productRoutes');

const cartRoutes = require('./routes/cartRoutes');
app.use('/cart', cartRoutes);

const userProfileRoutes = require('./routes/userProfileRoutes');
app.use('/userProfile', userProfileRoutes);

const kioskRoutes = require('./routes/kioskRoutes');
app.use('/kiosk', kioskRoutes);

app.get('/startKiosk', (req, res) => {
    res.sendFile(path.join(__dirname, './views/start-order.html'));
});

const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/checkout', checkoutRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/', orderRoutes);

app.use('/product', productRoutes);
app.use('/manageProduct', require('./routes/manageProductRoutes'));

// product
app.get('/addProduct', require('./controllers/manageProductController').getAddProduct);
app.post('/addProduct', require('./controllers/manageProductController').postAddProduct);
app.get('/updateProduct/:id', require('./controllers/manageProductController').getUpdateProduct);
app.post('/updateProduct/:id', require('./controllers/manageProductController').postUpdateProduct);
app.get('/deleteProduct/:id', require('./controllers/manageProductController').deleteProduct);

app.use('/about', require('./routes/aboutRoutes'));
app.use('/contact', require('./routes/contactRoutes'));
app.use('/faq', require('./routes/faqRoutes'));
app.use('/gallery', require('./routes/galleryRoutes'));
app.use('/help', require('./routes/helpRoutes'));
app.use('/service', require('./routes/serviceRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));


// app.js
const { saveOrderToDatabase } = require('./models/kioskDb'); // Import the function to save the order.

app.use(bodyParser.json()); // Middleware to parse JSON request body.

app.post('/submitOrder', (req, res) => {
    const orderData = req.body.orders; // The orders array sent from the client
    const totalAmount = req.body.totalAmount; // The total amount sent from the client
    const dineOutOption = req.body.dineOutOption; // Whether the order is for dine-in or take-out

    // Save the order to the database
    saveOrderToDatabase(orderData, totalAmount, dineOutOption)
        .then(() => {
            res.status(200).json({ message: 'Order placed successfully!' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error placing order!', error: error.message });
        });
});
const { updateStockLevels } = require('./models/kioskDb'); // Import the function to update stock levels

app.post('/submitInventory', (req, res) => {
    const orderData = req.body.orders; // The orders array sent from the client
    const totalAmount = req.body.totalAmount; // The total amount sent from the client
    const dineOutOption = req.body.dineOutOption; // Whether the order is for dine-in or take-out

    // Update the stock levels in the database
    updateStockLevels(orderData)
        .then(() => {
            res.status(200).json({ message: 'Order placed successfully!' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error placing order!', error: error.message });
        });
});

// Start the server
const PORT = process.env.PORT || 300;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
