const express = require('express');
const router = express.Router();
const helpController = require('../controllers/Controller');

// Routes for Help
router.get('/', helpController.getHelp);

module.exports = router;
