// models/UserProfile.js
const db = require('./db');

const UserProfile = {
    upsert: (userId, profileData) => {
        const sql = `
            INSERT INTO user_profile (user_id, name, phone, address, gender, birthday, profile_picture)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                phone = VALUES(phone), 
                address = VALUES(address), 
                gender = VALUES(gender), 
                birthday = VALUES(birthday),
                profile_picture = VALUES(profile_picture);
        `;
        const { name, phone, address, gender, birthday, profile_picture } = profileData;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId, name, phone, address, gender, birthday, profile_picture], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    findProfileByUserId: (userId) => {
        const sql = `
            SELECT name, phone, address, gender, birthday, profile_picture 
            FROM user_profile 
            WHERE user_id = ?;
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0] || {});
            });
        });
    }
};

module.exports = UserProfile;
