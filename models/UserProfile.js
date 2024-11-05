// models/UserProfile.js
const db = require('./db');

const UserProfile = {
    upsert: (userId, profileData) => {
        const sql = `
            INSERT INTO user_profile (user_id, name, phone, gender, birthday, age, profile_picture, street_name, city, barangay, zip_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                phone = VALUES(phone), 
                gender = VALUES(gender), 
                birthday = VALUES(birthday),
                age = VALUES(AGE),
                profile_picture = VALUES(profile_picture),
                street_name = VALUES(street_name),
                city = VALUES(city),
                barangay = VALUES(barangay),
                zip_code = VALUES(zip_code);
        `;
        const { name, phone, gender, birthday, age, profile_picture, street_name, city, barangay, zip_code } = profileData;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId, name, phone, gender, birthday, age, profile_picture, street_name, city, barangay, zip_code], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    findProfileByUserId: (userId) => {
        const sql = `
            SELECT name, phone, gender, birthday, age, profile_picture, street_name, city, barangay, zip_code
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
