const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/Controller');

// Routes for Gallery
router.get('/', galleryController.getGallery);

module.exports = router;
