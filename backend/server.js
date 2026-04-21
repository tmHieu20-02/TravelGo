const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise'); // Thêm dòng này để kết nối thô
const db = require('./models/index');
const userRoutes = require('./routes/userRoutes');
const countryRoutes = require('./routes/countryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors()); // Cho phép Frontend (Vite) gọi API
app.use(express.json());
// Cấu hình Express phục vụ file tĩnh trong thư mục "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/bookings', bookingRoutes);
const PORT = process.env.PORT || 5000;

// 1. Hàm tự động kiểm tra và tạo Database trước
const initDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS || '',
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.end();
        console.log('✅ Đã chuẩn bị xong Database rỗng!');

        // 2. Sau khi có DB, mới cho Sequelize chạy để nạp Bảng (Table) vào
        await db.sequelize.sync({ alter: true });
        console.log('✅ Đã đồng bộ Database thành công (Đã ráp bảng User)!');

        // 3. Khởi động Server
        app.listen(PORT, () => {
            console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Lỗi khởi động:', err);
    }
};

// Gọi hàm chạy
initDB();
