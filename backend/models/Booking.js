const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    countryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tourDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    guests: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false // Bắt buộc phải có số điện thoại để liên hệ
    },
    bookingCode: {
        type: DataTypes.STRING,
        unique: true // Mã định danh duy nhất cho từng đơn hàng (VD: TG-12345)
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, confirmed, cancelled
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid' // unpaid, deposited, paid
    }
}, {
    hooks: {
        beforeCreate: (booking) => {
            // Tự động tạo mã booking ngẫu nhiên khi tạo đơn mới
            const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
            booking.bookingCode = `TG-${randomStr}`;
        }
    }
});

module.exports = Booking;
