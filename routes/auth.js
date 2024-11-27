const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render Forgot Password Page
router.get('/forgot-password', authController.renderForgotPasswordPage);

// Handle Forgot Password Form Submission
router.post('/forgot-password', authController.forgotPassword);

// Render Reset Password Page
router.get('/reset-password', authController.renderResetPasswordPage);

// Handle Reset Password Form Submission
router.post('/reset-password', authController.resetPassword);

router.get('/sign-in', authController.getSignIn);
router.post('/sign-in', authController.signin);
router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authController.signup);
router.get('/logout', authController.logout);

module.exports = router;
