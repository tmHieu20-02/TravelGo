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
        allowNull: true // Tạm thời allow null nếu FE chưa gửi đúng chuẩn
    },
    guests: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, confirmed, cancelled
    }
});

module.exports = Booking;
