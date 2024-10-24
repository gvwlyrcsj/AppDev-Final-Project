const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/Controller');

// Routes for Services
router.get('/', serviceController.getService);

module.exports = router;
