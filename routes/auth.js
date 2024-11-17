// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure this path is correct

// Route definitions
router.get('/sign-up', (req, res) => {
    res.render('sign-up'); // Ensure you have a view called 'sign-up'
});

router.post('/sign-up', authController.signup);

router.get('/sign-in', authController.getSignIn);  // Ensure this function exists in authController
router.post('/sign-in', authController.signin);

router.get('/logout', authController.logout);

module.exports = router;
