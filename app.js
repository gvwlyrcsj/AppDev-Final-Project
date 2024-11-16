const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();
require('dotenv').config();

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

// Middleware to set local variables based on session
app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    res.locals.loggedIn = !!req.session.userId; // Set loggedIn based on session
    next();
});

app.get('/', (req, res) => {
    res.redirect('/about');
});

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const kioskRoutes = require('./routes/kiosk');
app.use('/kiosk', kioskRoutes);
app.get('/startKiosk', (req, res) => {
    res.sendFile(path.join(__dirname, './views/start-order.html'));
});
app.use('/kiosk', kioskRoutes);  


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use(authMiddleware);

app.use('/cart', cartRoutes);
app.use('/', authRoutes);
app.use('/userProfile', userProfileRoutes);
app.use('/', adminRoutes);
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

const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/checkout', checkoutRoutes);
app.use('/profile', userProfileRoutes);

// Restrict access to product route
app.get('/product', (req, res) => {
    if (req.session.userId) {
        res.render('product'); 
    } else {
        res.redirect('/sign-in'); 
    }
});


const orderRoutes = require('./routes/orderRoutes');
app.use('/', orderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
