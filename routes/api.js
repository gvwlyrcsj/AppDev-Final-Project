// routes/api.js
const express = require('express');
const router = express.Router();

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

router.get('/barangay', (req, res) => {
    const { city } = req.query;
    const barangays = barangays[city] || [];
    res.json(barangays);
});

module.exports = router;