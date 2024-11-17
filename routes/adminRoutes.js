const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const ensureAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.redirect('/sign-in?accessDenied=true'); // Redirect to sign-in with an accessDenied flag
    }
};

router.get('/admin', ensureAdmin, adminController.getDashboardData);

// Report routes under admin 
router.get('/report', ensureAdmin, adminController.getReportPage); 
router.post('/report/generate', ensureAdmin, adminController.generateReport);module.exports = router;
