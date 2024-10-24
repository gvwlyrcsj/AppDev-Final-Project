const express = require('express');
const router = express.Router();
const faqController = require('../controllers/Controller');

// Routes for FAQ
router.get('/', faqController.getFAQ);

module.exports = router;
