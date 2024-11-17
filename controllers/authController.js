const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// token; ex. localhost:3000/userProfile/jdwihdihdpqjhdpoqwhdphdejce79
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.getSignIn = (req, res) => {
    res.render('sign-in', { error: null }); // Pass error as null
};

// Handle sign-in form submission
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findByEmail(email);

        if (!existingUser) {
            return res.render('sign-in', { error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.render('sign-in', { error: 'Invalid email or password' });
        }

        req.session.userId = existingUser.id;  
        req.session.username = existingUser.username; 
        req.session.role = existingUser.role;

        const token = createToken(existingUser.id);
        req.session.token = token;

        // Redirect based on user role
        if (existingUser.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/product');
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal server error');
    }
};

// Render the sign-up page
exports.getSignUp = (req, res) => {
    res.render('sign-up', { error: null }); 
};

// Handle sign-up logic
exports.signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Check if the username is already taken
        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return res.render('sign-up', { error: 'Username is already taken' });
        }

        // Check if the email is already registered
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.render('sign-up', { error: 'Email is already registered' });
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.render('sign-up', { error: 'Passwords do not match' });
        }

        // Create new user
        const role = 'user'; 
        await User.create(username, email, password, role);
        res.redirect('/sign-in');
    } catch (error) {
        console.error(error);
        return res.render('sign-up', { error: 'Server Error' });
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
