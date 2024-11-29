const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.redirect('/sign-in?accessDenied=true'); // Redirect to sign-in with an accessDenied flag
    }
};

router.get('/', ensureAdmin, feedbackController.getFeedback);

module.exports = router;
