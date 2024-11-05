const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const path = require('path');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

// Define barangay list based on city for dropdown selection
const barangays = {
    calapan: ["Balingayan", "Balite", /* ... additional barangays */],
    baco: ["Alag", "Bangkatan", /* ... additional barangays */],
    // Add other cities and barangays
};

exports.getUserProfileById = async (req, res) => {
    const token = req.params.token;
    const userId = decodeToken(token);

    if (!userId) {
        return res.status(403).send('Invalid or expired token');
    }

    try {
        const user = await User.findById(userId);
        const profile = await UserProfile.findProfileByUserId(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('userProfile', {
            user,
            profile,
            barangays, // Pass barangays for dropdowns
            userId: req.session.userId,
            username: req.session.username
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal server error');
    }
};

exports.upsertProfile = async (req, res) => {
    const userId = req.session.userId;
    const {
        username,
        email,
        name,
        phone,
        street_name,
        city,
        barangay,
        zip_code,
        gender,
        birthday
    } = req.body;

    let profilePicturePath;

    if (req.files && req.files.profile_picture) {
        const profilePicture = req.files.profile_picture;
        const uploadPath = path.join(__dirname, '../uploads', profilePicture.name);
        await profilePicture.mv(uploadPath);
        profilePicturePath = `/uploads/${profilePicture.name}`;
    } else {
        const existingProfile = await UserProfile.findProfileByUserId(userId);
        profilePicturePath = existingProfile ? existingProfile.profile_picture : '/path/to/default-picture.jpg';
    }

    // Calculate age based on the provided birthday
    let age;
    if (birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }

    try {
        await User.updateBasicInfo(userId, username, email);
        await UserProfile.upsert(userId, {
            name,
            phone,
            street_name,
            city,
            barangay,
            zip_code,
            gender,
            birthday,
            age,
            profile_picture: profilePicturePath
        });

        // Generate a new token and redirect
        const token = createToken(userId);
        res.redirect(`/userProfile/${token}`);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal server error');
    }
};
