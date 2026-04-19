const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

exports.register = async (req, res) => {
    try {
        // 1. Lấy dữ liệu người dùng gửi lên
        const { name, email, password } = req.body;

        // 2. Kiểm tra xem email đã được đăng ký chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }

        // 3. Mã hóa mật khẩu (Hashing)
        const salt = await bcrypt.genSalt(10); // Tạo chuỗi ngẫu nhiên để trộn vào pass
        const hashedPassword = await bcrypt.hash(password, salt); // Băm mật khẩu

        // 4. Lưu User mới vào Database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin' // Tạm thời để admin để bạn dễ test chức năng
        });

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra email có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng!" });
        }

        // 3. Tạo token (Sử dụng jsonwebtoken)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'travel_secret_key', 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Nhờ "Ông Bảo Vệ" ở Bước 1, chúng ta đã có req.user.id
        // Giờ chỉ việc vào kho (Database) lôi đúng thông tin thằng đó ra
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Mẹo bảo mật: Lấy hết thông tin NHƯNG trừ cột password ra
        });

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ!" });
        }

        // Trả hồ sơ cho khách xem
        res.status(200).json({ profile: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};