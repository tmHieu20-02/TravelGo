const db = require('../models');
const Notification = db.Notification;

// Lấy danh sách thông báo của User
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông báo" });
    }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);
        if (notification && notification.userId === req.user.id) {
            notification.isRead = true;
            await notification.save();
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái thông báo" });
    }
};
