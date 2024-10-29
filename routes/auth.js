const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // Ensure correct path

// Render sign-up page
router.get('/sign-up', (req, res) => {
    res.render('sign-up'); // This will render the sign-up form
});

// Sign-up route for handling form submission
router.post('/sign-up', (req, res) => {
    const { username, email, password, role } = req.body;

    User.findByEmail(email, (error, existingUser) => {
        if (error) {
            console.error('Error finding user by email:', error); // Log any error finding user
            return res.status(500).send('Server error');
        }

        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }

        User.create(username, email, password, role, (error, result) => {
            if (error) {
                console.error('Error creating user:', error); // Log the specific error here
                return res.status(500).send('Error creating user');
            }
            res.redirect('/sign-in'); // Redirect after successful sign-up
        });
    });
});

// Render sign-in page
router.get('/sign-in', authController.getSignIn); // Ensure this is correctly defined

// Sign-in route for handling form submission
router.post('/sign-in', authController.signin); // Ensure this is correctly defined

// Logout route with query parameter for refresh
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/'); // Redirect to home on error
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/sign-in?loggedOut=true'); // Redirect to sign-in with a query parameter
    });
});

module.exports = router;
