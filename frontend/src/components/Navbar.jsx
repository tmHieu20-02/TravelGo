import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Kiểm tra trạng thái đăng nhập mỗi khi component render
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="nav-container">
            <div className="nav-inner">

                {/* Logo */}
                <Link to="/" className="nav-logo-wrapper">
                    <div className="nav-logo-icon">
                        ✈️
                    </div>
                    <span className="nav-logo-text">TRAVEL<span className="text-indigo-600">GO</span></span>
                </Link>

                {/* Menu Links */}
                <div className="nav-links-menu">
                    <Link to="/" className="nav-link">Trang Chủ</Link>
                    <Link to="/destinations" className="nav-link">Điểm Đến</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin/countries" className="nav-link-admin"> Admin</Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="nav-auth-group">
                    {user ? (
                        <div className="nav-auth-group">
                            <div className="nav-user-greeting">
                                <p className="text-xs text-gray-400 font-bold uppercase">Xin chào,</p>
                                <p className="text-sm font-black text-gray-800">{user.name}</p>
                            </div>
                            <button onClick={handleLogout} className="btn-nav-outline">
                                Đăng Xuất
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-nav-text">
                                Đăng Nhập
                            </Link>
                            <Link to="/register" className="btn-nav-primary">
                                Tham Gia Ngay
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;