const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/Controller');

// Routes for User Profile
router.get('/', userProfileController.getUserProfile);
router.post('/', userProfileController.updateUserProfile);

module.exports = router;
