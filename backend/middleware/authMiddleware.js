const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "từ chối truy cập, không có token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "token không hợp lệ" })
    }
};

// check role amin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "bạn không có quyền truy cập" });
    }
    next();
};


module.exports = { verifyToken, isAdmin };