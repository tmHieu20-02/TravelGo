const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/my-bookings', verifyToken, bookingController.getMyBookings);

// API cho Admin quản lý
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);
router.patch('/:id/status', verifyToken, isAdmin, bookingController.updateBookingStatus);

module.exports = router;
