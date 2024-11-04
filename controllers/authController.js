const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to create a token from user ID
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.getSignIn = (req, res) => {
    res.render('sign-in'); 
};

// Handle sign-in form submission
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findByEmail(email);

        if (!existingUser) {
            return res.status(400).send('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password');
        }

        req.session.userId = existingUser.id;  
        req.session.username = existingUser.username; 
        req.session.role = existingUser.role;

        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;

        res.redirect('/product');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal server error');
    }
};

// Render the sign-up page
exports.getSignUp = (req, res) => {
    res.render('sign-up'); 
};

// Handle sign-up logic
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.render('sign-up', { error: 'User already exists' });
        }

        const role = 'user'; 
        await User.create(username, email, password, role);
        res.redirect('/sign-in');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};

// Handle logout logic
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/'); 
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};
