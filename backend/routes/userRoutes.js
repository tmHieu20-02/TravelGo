const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { verifyToken } = require('../middleware/authMiddleware');
// Khai báo route POST
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile);
module.exports = router;