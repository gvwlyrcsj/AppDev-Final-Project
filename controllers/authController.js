const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// token; ex. localhost:3000/userProfile/jdwihdihdpqjhdpoqwhdphdejce79
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.getSignIn = (req, res) => {
    res.render('sign-in', {
        error: req.flash('error') || null,
        success: req.flash('success') || null,
    });
};

// Handle sign-in form submission
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findByEmail(email);

        if (!existingUser) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/sign-in');
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/sign-in');
        }

        req.session.userId = existingUser.id;  
        req.session.username = existingUser.username; 
        req.session.role = existingUser.role;

        const token = createToken(existingUser.id);
        req.session.token = token;

        req.flash('success', 'Successfully logged in');

        // Redirect based on user role
        if (existingUser.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/product');
        }
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Internal server error');
        res.redirect('/sign-in');
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
        req.flash('success', 'Account created successfully. Please log in.');
        res.redirect('/sign-in');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server Error');
        return res.render('sign-up', { error: req.flash('error') });
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

// Render Forgot Password Page
exports.renderForgotPasswordPage = (req, res) => {
    res.render('forgot-password', {
        success: req.flash('success'),
        error: req.flash('error')
    });
};

// Handle Forgot Password Form Submission
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash('error', 'No user found with that email address');
            return res.redirect('/forgot-password');
        }

        // Generate a token
        const token = createToken(user.id);

        // Create the reset link
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

        // Configure email transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // Use 465 for SSL, 587 for TLS
            secure: false, // true if using port 465
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_APP_PASSWORD, // Ensure this is set in .env
            },
        });

        // Compose the password reset email
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            html: `
                <p>You requested a password reset.</p>
                <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>
            `,
        };

        // Send the password reset email
        await transporter.sendMail(mailOptions);

        req.flash('success', 'Password reset link has been sent to your email address');
        res.redirect('/forgot-password');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/forgot-password');
    }
};

// Render Reset Password Page
exports.renderResetPasswordPage = (req, res) => {
    res.render('reset-password', {
        token: req.query.token,
        error: req.flash('error')
    });
};


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        req.flash('error', 'Token and new password are required');
        return res.redirect('/reset-password');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Update password in database
        await User.updatePassword(userId, newPassword);

        req.flash('success', 'Password has been reset successfully');
        res.redirect('/sign-in');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.flash('error', 'Reset link has expired. Please request a new one.');
            return res.redirect('/forgot-password');
        }
        if (error.name === 'JsonWebTokenError') {
            req.flash('error', 'Invalid reset link');
            return res.redirect('/forgot-password');
        }

        console.error('Error resetting password:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/forgot-password');
    }
};
