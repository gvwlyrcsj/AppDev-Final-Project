const express = require('express');
const router = express.Router();

// Middleware to ensure user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware
    } else {
        res.status(403).send('Access Denied'); // User is not an admin, send access denied
    }
};

// Route to render admin page
router.get('/admin', ensureAdmin, (req, res) => {
    res.render('admin'); // Render the admin page
});

module.exports = router;
