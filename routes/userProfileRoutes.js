const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/sign-in');
};

router.get('/:token', isAuthenticated, userProfileController.getUserProfileById);

router.post('/upsert', isAuthenticated, userProfileController.upsertProfile);

router.get('/:token', isAuthenticated, userProfileController.getUserProfileById);

router.post('/upsert', isAuthenticated, userProfileController.upsertProfile);


router.get('/checkoutSuccess', (req, res) => {
    res.render('checkoutSuccess'); 
});
router.post('/update-profile', userProfileController.updateUserProfile);
module.exports = router;
