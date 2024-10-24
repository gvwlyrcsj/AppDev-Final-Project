const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// GET: Display feedback (list of contacts)
router.get('/', feedbackController.getFeedback);

module.exports = router;
