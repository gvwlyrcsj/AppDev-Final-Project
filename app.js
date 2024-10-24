const express = require('express');
const fileUpload = require('express-fileupload'); // Import the express-fileupload middleware
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const app = express();

// Controllers and Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');

// Set up middleware
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

// Middleware to attach the db pool to each request
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Authentication routes
app.use('/', authRoutes);

// Admin routes
app.use('/', adminRoutes);

// Access manageProduct directly without /admin prefix
app.use('/manageProduct', require('./routes/manageProductRoutes')); // For managing products

// Add specific routes to access updateProduct and deleteProduct directly
app.get('/addProduct', require('./controllers/manageProductController').getAddProduct);
app.post('/addProduct', require('./controllers/manageProductController').postAddProduct);
app.get('/updateProduct/:id', require('./controllers/manageProductController').getUpdateProduct);
app.post('/updateProduct/:id', require('./controllers/manageProductController').postUpdateProduct);
app.get('/deleteProduct/:id', require('./controllers/manageProductController').deleteProduct);

app.use('/about', require('./routes/aboutRoutes'));
app.use('/product', require('./routes/productRoutes'));
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
        res.render('product');
    } else {
        res.redirect('/sign-in');
    }
});

// Redirect root URL to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

const productRoutes = require('./routes/productRoutes'); // Import product routes
app.use('/product', productRoutes); // Use the product routes

// Remove the extra /product route handler from app.js, since it's handled in productRoutes.js
/*
app.get('/product', async (req, res) => {
    try {
        const addproduct = await getProductsFromDatabase(); // Replace this with your actual database call
        res.render('product', { addproduct }); // Pass the addproduct variable to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
