import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    // Lấy thông tin user từ Local Storage
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;

    if (userString) {
        try {
            user = JSON.parse(userString);
        } catch(e) {}
    }

    // 1. Chưa đăng nhập -> Trả về trang đăng nhập
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Yêu cầu quyền Admin nhưng chỉ là user thường -> Trả về trang chủ
    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // 3. Hợp lệ -> Cho phép truy cập component (trang) con
    return children;
};

export default ProtectedRoute;
