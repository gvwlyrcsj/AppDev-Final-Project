const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/Controller'); 

router.get('/', aboutController.getAbout);

module.exports = router;
