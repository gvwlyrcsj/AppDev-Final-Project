const User = require('../models/User');
const bcrypt = require('bcrypt');

// Handle user signup
exports.signup = (req, res) => {
    const { username, email, password, role } = req.body;

    User.findByEmail(email, (error, existingUser) => {
        if (error) {
            console.error('Error finding user by email:', error); // Log error
            return res.status(500).send('Server error');
        }

        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err); // Log error
                return res.status(500).send('Server error');
            }

            User.create(username, email, hashedPassword, role, (error, result) => {
                if (error) {
                    console.error('Error creating user:', error); // Log error
                    return res.status(500).send('Error creating user');
                }
                res.status(201).send('User created successfully');
            });
        });
    });
};

// Render sign-in page
exports.getSignIn = (req, res) => {
    res.render('sign-in'); 
};

// Handle sign-in form submission
exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (error, existingUser) => {
        if (error) {
            console.error('Error finding user by email:', error);
            return res.status(500).send('Server error');
        }

        if (!existingUser) {
            return res.status(400).send('Invalid email or password');
        }

        const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password');
        }

        // Set user session
        req.session.userId = existingUser.id;
        req.session.username = existingUser.username;  // Store username in session
        req.session.role = existingUser.role;

        // Redirect based on user role
        if (existingUser.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/product');
        }
    });
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error destroying session:', error); // Log error
            return res.status(500).send('Server error');
        }

        // Clear cookies
        res.clearCookie('connect.sid'); // Replace with your session cookie name if different

        // Redirect to sign-in page with a query parameter
        res.redirect('/sign-in?loggedOut=true'); // Redirect with a query parameter
    });
};
