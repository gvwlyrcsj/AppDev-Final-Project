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

router.get('/checkoutsuccess', (req, res) => {
    // Render the checkout success page
    res.render('checkoutSuccess'); // Make sure you have a 'checkoutSuccess.ejs' view file in your views directory
});

router.post('/checkout/update-address', (req, res) => {
    const { street_name, barangay, city, zip_code } = req.body;

    updateAddress(req.user.id, street_name, barangay, city, zip_code)
        .then(() => {
            // Redirect to checkoutSuccess page after updating the address
            res.redirect('/checkoutSuccess');
        })
        .catch(err => {
            console.error(err);
            // Optionally, redirect to an error page or display an error message
            res.redirect('/checkout');
        });
});

module.exports = router;
