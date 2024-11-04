const express = require('express');
const router = express.Router();

// Middleware to check if the user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.redirect('/sign-in?accessDenied=true'); // Redirect to sign-in with an accessDenied flag
    }
};

// Route to render admin page
router.get('/admin', ensureAdmin, (req, res) => {
    res.render('admin'); // Render the admin page
});

module.exports = router;
