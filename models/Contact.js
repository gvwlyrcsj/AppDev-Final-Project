const db = require('./db'); 

const Contact = {
  getAll: function (callback) {
    const query = 'SELECT id, name, email, subject, message, created_at FROM contacts';
    db.query(query, callback);
  }
};

module.exports = Contact;
