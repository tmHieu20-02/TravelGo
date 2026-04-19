const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Link dây kết nối vào

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false // Không được để trống tên
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Email không được trùng nhau
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'), // Quyền tài khoản
        defaultValue: 'user' // Mặc định ai tạo cũng là khách thường
    }
}, {
    tableName: 'users',
    timestamps: true // Tự tạo cột Ngày cấp / Ngày sửa đổi
});

module.exports = User;
