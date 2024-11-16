exports.getAbout = (req, res) => {
    res.render('about'); 
};

exports.getSignUp = (req, res) => {
    res.render('sign-up'); 
};

exports.getSignUp = (req, res) => {
    res.render('sign-in'); 
};

exports.getContact = (req, res) => {
    res.render('contact'); 
};

exports.getProduct = (req, res) => {
    res.render('product'); 
};
// faqController.js
exports.getFAQ = (req, res) => {
    res.render('faq');
};

// galleryController.js
exports.getGallery = (req, res) => {
    res.render('gallery');
};

// helpController.js
exports.getHelp = (req, res) => {
    res.render('help');
};

// userProfileController.js
exports.getUserProfile = (req, res) => {
    res.render('userProfile');
};

exports.updateUserProfile = (req, res) => {
    res.redirect('/userProfile');
};

// serviceController.js
exports.getService = (req, res) => {
    res.render('service');
};

exports.getManageProduct = (req, res) => {
    res.render('manageProduct');
};
