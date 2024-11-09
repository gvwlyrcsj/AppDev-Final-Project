const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const kioskRoutes = require('./routes/kioskRoutes');  // Import the kiosk route

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(session({
    secret: 'hanahgwykingsk',
    resave: false,
    saveUninitialized: true
}));

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

// Routes
app.use('/cart', cartRoutes);
app.use('/', authRoutes);
app.use('/userProfile', userProfileRoutes);
app.use('/', adminRoutes);
app.use('/product', productRoutes);
app.use('/manageProduct', require('./routes/manageProductRoutes'));
app.use('/about', require('./routes/aboutRoutes'));
app.use('/contact', require('./routes/contactRoutes'));
app.use('/faq', require('./routes/faqRoutes'));
app.use('/gallery', require('./routes/galleryRoutes'));
app.use('/help', require('./routes/helpRoutes'));
app.use('/service', require('./routes/serviceRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));

// Add kiosk route
app.use('/kiosk', kioskRoutes);  // Add this line to set up the kiosk route

// Product route restriction
app.get('/product', (req, res) => {
    if (req.session.userId) {
        res.render('product'); 
    } else {
        res.redirect('/sign-in'); 
    }
});

// Default route
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
