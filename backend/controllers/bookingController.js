const db = require('../models');
const Booking = db.Booking;
const Country = db.Country;

// Tao don dat tour
exports.createBooking = async (req, res) => {
    try {
        const { countryId, tourDate, guests, notes } = req.body;
        const userId = req.user.id;

        //kiem tra xem quoc gia co ton tai ko 

        const country = await Country.findByPk(countryId);
        if (!country) {
            return res.status(404).json({ message: "khong tim thay dia diem" });
        };

        //tinh tien 
        const totalPrice = country.price * guests;


        //luu hoa don

        const newBooking = await Booking.create({
            userId,
            countryId,
            tourDate,
            guests,
            totalPrice, // Lưu số tiền đã tính toán an toàn ở Bước B
            notes
        });

        res.status(201).json({
            message: "Đặt tour thành công!",
            booking: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "loi server" })
    }
};

// Lấy danh sách booking của User đang đăng nhập
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Country,
                    as: 'country',
                    attributes: ['name', 'thumbnail']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "loi khi lay lich su dat tour" });
    }
};