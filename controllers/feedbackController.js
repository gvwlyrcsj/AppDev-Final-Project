const Contact = require('../models/Contact');

// Renders the feedback page, which lists all the contact entries
exports.getFeedback = (req, res) => {
    Contact.getAll((err, contacts) => {
        if (err) {
            console.error('Error fetching contact data:', err);
            return res.status(500).send('An error occurred while fetching contacts.');
        }

        // Render the 'feedback' page with the fetched contacts
        res.render('feedback', { contacts });
    });
};
