const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();
require('dotenv').config();


const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Middleware to set local variables based on session
app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    res.locals.loggedIn = !!req.session.userId; // Set loggedIn based on session
    next();
});

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

// Restrict access to product route
app.get('/product', (req, res) => {
    if (req.session.userId) {
        res.render('product'); 
    } else {
        res.redirect('/sign-in'); 
    }
});

app.get('/', (req, res) => {
    res.redirect('/about');
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
app.get('/api/barangays', (req, res) => {
    const city = req.query.city;
    if (barangays[city]) {
        res.json(barangays[city]);
    } else {
        res.status(404).json({ error: 'City not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
