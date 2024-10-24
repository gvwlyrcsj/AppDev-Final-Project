const Contact = require('../models/Contact');

// Renders the contact form page
exports.getContactForm = (req, res) => {
    res.render('contact', { success: req.query.success });
};

// Handles the submission of the contact form
exports.postContact = (req, res) => {
    const { name, email, subject, message } = req.body;

    const sql = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    req.db.query(sql, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error('Error inserting contact data:', err);
            return res.status(500).send('An error occurred while saving the contact information.');
        }
        // Redirect to the contact form with success message
        res.redirect('/contact?success=true');
    });
};
