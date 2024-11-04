// routes/userProfileRoutes.js
const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/sign-in');
};

// Route to get user profile using token
router.get('/:token', isAuthenticated, userProfileController.getUserProfileById);

// Route to upsert user profile
router.post('/upsert', isAuthenticated, userProfileController.upsertProfile);

module.exports = router;
