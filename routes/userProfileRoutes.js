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

router.get('/:token', isAuthenticated, userProfileController.getUserProfileById);

router.post('/upsert', isAuthenticated, userProfileController.upsertProfile);

router.get('/checkoutsuccess', (req, res) => {
    res.render('checkoutSuccess'); 
});

router.post('/checkout/update-address', (req, res) => {
    const { street_name, barangay, city, zip_code } = req.body;

    updateAddress(req.user.id, street_name, barangay, city, zip_code)
        .then(() => {
            res.redirect('/checkoutSuccess');
        })
        .catch(err => {
            console.error(err);
            // Optionally, redirect to an error page or display an error message
            res.redirect('/checkout');
        });
});

module.exports = router;
