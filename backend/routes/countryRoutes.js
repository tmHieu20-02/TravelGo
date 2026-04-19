const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const upload = require('../middleware/uploadMiddleware'); // Import middleware upload
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Middleware bảo vệ API

// Định tuyến API cho Quốc gia
router.get('/', countryController.getAllCountries); // GET /api/countries (Public)
router.get('/:slug', countryController.getCountryBySlug); // GET /api/countries/:slug (Public)

// Các API bên dưới cần quyền Admin
router.post('/', verifyToken, isAdmin, upload.single('thumbnail'), countryController.createCountry);
router.put('/:id', verifyToken, isAdmin, upload.single('thumbnail'), countryController.updateCountry);
router.delete('/:id', verifyToken, isAdmin, countryController.deleteCountry);

module.exports = router;