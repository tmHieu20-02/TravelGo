const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


// Register

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        //check user da ton tai hay chua 

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "user da ton tai" })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "lỗi server" })
    }
}