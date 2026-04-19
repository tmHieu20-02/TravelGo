const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Bắt buộc phải nhập tên
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Không được trùng lặp (vd: 'viet-nam', 'nhat-ban')
    },
    description: {
        type: DataTypes.TEXT, // Dùng TEXT vì mô tả thường rất dài
    },
    thumbnail: {
        type: DataTypes.STRING, // Lưu đường dẫn hình ảnh
    }
}, {
    timestamps: true // Tự động tạo cột createdAt, updatedAt
});

module.exports = Country;