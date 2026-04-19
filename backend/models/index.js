const sequelize = require('../config/database');
const User = require('./User'); // Import model User bạn đã tạo
const Country = require('./Country');

// Tạo một object db để chứa mọi thứ liên quan đến database
const db = {};

db.sequelize = sequelize; // Lưu lại kết nối
db.User = User; // Đưa Model User vào object
db.Country = Country;

// (Sau này chúng ta sẽ viết code liên kết các bảng ở đây)

module.exports = db;