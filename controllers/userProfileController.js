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

exports.getUserProfileById = async (req, res) => {
    const token = req.params.token; // Get token from URL
    const userId = decodeToken(token); // Decode token to get user ID
    
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
            userId: req.session.userId,
            username: req.session.username
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal server error');
    }
};

// Upsert profile data and handle file upload
exports.upsertProfile = async (req, res) => {
    const userId = req.session.userId;
    const { username, email, name, phone, address, gender, birthday } = req.body;
    let profilePicturePath;

    if (req.files && req.files.profile_picture) {
        const profilePicture = req.files.profile_picture;
        const uploadPath = path.join(__dirname, '../uploads', profilePicture.name);
        await profilePicture.mv(uploadPath);
        profilePicturePath = `/uploads/${profilePicture.name}`;
    } else {
        const existingProfile = await UserProfile.findProfileByUserId(userId);
        profilePicturePath = existingProfile.profile_picture || '/path/to/default-picture.jpg';
    }

    try {
        await User.updateBasicInfo(userId, username, email);
        await UserProfile.upsert(userId, { name, phone, address, gender, birthday, profile_picture: profilePicturePath });
        
        // Generate token and redirect
        const token = createToken(userId);
        res.redirect(`/userProfile/${token}`);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal server error');
    }
};
