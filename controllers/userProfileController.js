const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Cart = require('../models/Cart');
const path = require('path');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

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

const barangays = {
    calapan: ["Balingayan", "Balite", "Baruyan", "Batino", "Bayanan I", "Bayanan II", "Biga", "Bondoc", "Bucayao",
        "Buhuan", "Bulusan", "Calero", "Camansihan", "Camilmil", "Canubing I", "Canubing II", "Comunal",
        "Guinobatan", "Gulod", "Gutad", "Ibaba East", "Ibaba West", "Ilaya", "Lalud", "Lazareto", "Libis",
        "Lumangbayan", "Mahal Na Pangalan", "Maidlang", "Malad", "Malamig", "Managpi", "Masipit", "Nag-Iba I",
        "Nag-Iba II", "Navotas", "Pachoca", "Palhi", "Panggalaan", "Parang", "Patas", "Personas", "Puting Tubig",
        "San Antonio", "San Rafael (formerly Salong)", "San Vicente Central", "San Vicente East", "San Vicente North",
        "San Vicente South", "San Vicente West", "Sapul", "Silonay", "Santa Cruz", "Santa Isabel", "Santa Maria Village",
        "Santa Rita", "Santo Niño", "Suqui", "Tawagan", "Tawiran", "Tibag", "Wawa"],
    baco: ["Alag", "Bangkatan", "Baras (Mangyan Minority)", "Bayanan", "Burbuli", "Dulangan I", "Dulangan II", 
        "Katuwiran I", "Katuwiran II", "Lantuyang (Mangyan Minority)", "Lumangbayan", "Malapad", "Mangangan I", 
        "Mangangan II", "Mayabig", "Pambisan", "Poblacion", "Pulantubig", "PuticanCabulo", "San Andres", 
        "San Ignacio", "Santa Cruz", "Santa Rosa I", "Santa Rosa II", "TabonTabon", "Tagumpay", "Water"],
    bansud: ["Antipolo", "Aras-asan", "Bagumbayan", "Balay", "Bayan ng Bansud", "Cabangahan", "Dampulan", 
        "Kalingatan", "Mababang Bato", "Magsaysay", "Managpi", "Napangan", "Pabilaan", "Poblacion", "Tagumpay"],
    bongabong: ["Alag", "Bagumbayan", "Balay", "Bayanan", "Bignay", "Bongabong Proper", "Lalud", 
        "Masaguitsit", "Marayag", "Mabanglas", "Mangyan", "Malunod", "Palhuan", "Poblacion", "San Isidro", "San Jose"],
    bulalacao: ["Balcasan", "Bamboo", "Buli", "Bulalacao", "Dawis", "Dela Paz", "Gintong Silangan", 
        "Hindang", "Ibayug", "Kalapagan", "Katribo", "Lamon", "Libas", "Lunhaw", "Mapagkumbaba", "Nag-iba", "Poblacion"],
    mansalay: ["Bagumbayan", "Bansud", "Bongabong", "Bubog", "Caguya", "Canas", "Canubing", "Dumantay", 
        "Gulod", "Mansalay", "Mapagkumbaba", "Poblacion", "San Antonio", "San Isidro"],
    naujan: ["Bagumbayan", "Bangas", "Barangan", "Buhay", "Dugay", "Isabang", "Ibabang I", "Ibabang II", 
        "Lagan", "Lapidan", "Maguin", "Marayag", "Mauway", "Muntinlupa", "Poblacion", "Punduhan"],
    pinamalayan: ["Bagong Silang", "Bagumbayan", "Bansud", "Bongabong", "Calapan", "Calavite", "Dumantay", 
        "Liitan", "Manganga", "Poblacion", "Pula", "San Vicente", "Silan", "Tabing Ilog"],
    pola: ["Bagumbayan", "Baras", "Bato", "Boton", "Bugtong na Bato", "Dulongbayan", "Ilog", "Kapatagan", 
        "Masaguitsit", "Mina", "Mundang", "Pagsanjan", "Palahang", "Poblacion", "Tabing Ilog", "Tagumpay"],
    puertogalera: ["Bagumbayan", "Banilad", "Bayanan", "Bongabong", "Buli", "Calapan", "Dulangan", "Katuwiran", 
        "Lagnas", "Mabuhay", "Manatad", "Manuel I", "Panganiban", "Poblacion", "San Antonio", "San Isidro"],
    roxas: ["Antipolo", "Bailan", "Bunga", "Manga", "Manggahan", "Mapagkumbaba", "Poblacion", "San Juan", "Tabon"],
    santeodoro: ["Antipolo", "Bagumbayan", "Bingag", "Buli", "Concepcion", "Dapdap", "Del Pilar", "Katuwiran", 
        "Mahayag", "Magsaysay", "Malinao", "Marakitan", "Poblacion", "San Juan", "Santo Niño"],
    socorro: ["Antipolo", "Batsanga", "Bagumbayan", "Buhay", "Concepcion", "Dolores", "Ibaba", "Kapatagan", 
        "Maguin", "Malalim", "Manatad", "Poblacion", "Pulang Lupa"],
    victoria: ["Bagumbayan", "Baras", "Buli", "Calero", "Cugman", "Del Pilar", "Dulangan", "Ibaba", 
        "Manuel L. Quezon", "Marina", "Nag-Iba", "Nampicuan", "Poblacion"]
};

exports.getUserProfileById = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/sign-in');
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
            barangays, 
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

exports.updateUserProfile = async (req, res) => {
    const userId = req.session.userId;
    const { name, phone, street_name, barangay, city, zip_code } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const [result] = await pool.promise().query(
            `UPDATE user_profile SET name = ?, phone = ?, street_name = ?, barangay = ?, city = ?, zip_code = ? WHERE user_id = ?`,
            [name, phone, street_name, barangay, city, zip_code, userId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Profile update failed' });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
