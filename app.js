const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();

// Controllers and Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(session({
    secret: 'hanahgwykingsk',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Middleware to make session available in views
app.use((req, res, next) => {
    res.locals.session = req.session; // Make session available to views
    next();
});

// Assuming username is stored in the session
app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    next();
  });  

// Middleware to attach the db pool to each request
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Authentication routes
app.use('/', authRoutes);

// Admin routes
app.use('/', adminRoutes);

// Product routes
app.use('/product', productRoutes);

// Access manageProduct directly without /admin prefix
app.use('/manageProduct', require('./routes/manageProductRoutes'));

// Add specific routes to access updateProduct and deleteProduct directly
app.get('/addProduct', require('./controllers/manageProductController').getAddProduct);
app.post('/addProduct', require('./controllers/manageProductController').postAddProduct);
app.get('/updateProduct/:id', require('./controllers/manageProductController').getUpdateProduct);
app.post('/updateProduct/:id', require('./controllers/manageProductController').postUpdateProduct);
app.get('/deleteProduct/:id', require('./controllers/manageProductController').deleteProduct);

// Other routes
app.use('/about', require('./routes/aboutRoutes'));
app.use('/contact', require('./routes/contactRoutes'));
app.use('/faq', require('./routes/faqRoutes'));
app.use('/gallery', require('./routes/galleryRoutes'));
app.use('/help', require('./routes/helpRoutes'));
app.use('/userProfile', require('./routes/userProfileRoutes'));
app.use('/service', require('./routes/serviceRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));

// Restrict access to product route
app.get('/product', (req, res) => {
    if (req.session.userId) {
        res.render('product'); // Render the product page
    } else {
        res.redirect('/sign-in'); // Redirect to sign-in if user is not authenticated
    }
});

// Redirect root URL to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Add the cart routes below your product routes
app.use('/cart', cartRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
