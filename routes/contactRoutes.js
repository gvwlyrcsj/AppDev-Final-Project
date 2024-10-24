const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET: Render the contact form page
router.get('/', contactController.getContactForm);

// POST: Handle form submission to save new contact
router.post('/', contactController.postContact);

module.exports = router;
