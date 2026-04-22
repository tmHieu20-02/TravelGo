const db = require('../models');
const Booking = db.Booking;
const Country = db.Country;
const User = db.User;
const Notification = db.Notification;

// Tao don dat tour
exports.createBooking = async (req, res) => {
    try {
        const { countryId, tourDate, guests, notes, phone } = req.body;
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
            phone,           // Thêm số điện thoại vào đây
            totalPrice, 
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

// Lấy TẤT CẢ booking (Chỉ dành cho Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name', 'email'] },
                { model: Country, as: 'country', attributes: ['name', 'thumbnail'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy toàn bộ đơn hàng" });
    }
};

// Admin cập nhật trạng thái đơn hàng (Xác nhận/Hủy)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed' hoặc 'cancelled'

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        booking.status = status;
        await booking.save();

        // TẠO THÔNG BÁO CHO USER
        let notifyMessage = "";
        if (status === 'confirmed') {
            notifyMessage = `🎉 Tin vui! Đơn hàng ${booking.bookingCode} của bạn đã được xác nhận. Chuẩn bị hành lý thôi!`;
        } else if (status === 'cancelled') {
            notifyMessage = `❌ Rất tiếc, đơn hàng ${booking.bookingCode} của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ.`;
        }

        if (notifyMessage) {
            await Notification.create({
                userId: booking.userId,
                message: notifyMessage
            });
        }

        res.status(200).json({ message: "Cập nhật thành công!", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng" });
    }
};

// Người dùng tự hủy đơn hàng
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findOne({ where: { id, userId } });
        
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng của bạn" });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ duyệt" });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ message: "Đã hủy đơn hàng thành công", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi hủy đơn hàng" });
    }
};