import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, Globe, LogOut, User as UserIcon, Calendar, Star } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNoti, setShowNoti] = useState(false);
    const dropdownRef = useRef(null); // Ref để theo dõi vùng menu thông báo

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error("Lỗi lấy thông báo", err);
        }
    };

    // Kiểm tra trạng thái đăng nhập mỗi khi component render
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            fetchNotifications();
        }
    }, [navigate]);

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {}
    };

    // Xử lý khi nhấn ra ngoài màn hình để đóng menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNoti(false);
            }
        };

        if (showNoti) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNoti]);

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
                <div className="nav-links-menu flex items-center gap-6">
                    <Link to="/" className="nav-link font-bold text-gray-600 hover:text-indigo-600">Trang Chủ</Link>
                    <Link to="/destinations" className="nav-link font-bold text-gray-600 hover:text-indigo-600">Điểm Đến</Link>
                    
                    {user?.role === 'admin' && (
                        <div className="flex items-center gap-4 border-l pl-4 ml-2 border-gray-200">
                            <Link to="/admin/countries" className="flex items-center gap-2 text-xs font-black uppercase text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-2 rounded-lg transition-all">
                                <Globe className="w-4 h-4" /> Quản lý Tour
                            </Link>
                            <Link to="/admin/bookings" className="flex items-center gap-2 text-xs font-black uppercase text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg transition-all">
                                <ClipboardList className="w-4 h-4" /> Đơn hàng
                            </Link>
                        </div>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="nav-auth-group flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Nút thông báo */}
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setShowNoti(!showNoti)}
                                    className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.filter(n => !n.isRead).length > 0 && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] flex items-center justify-center text-white font-black">
                                            {notifications.filter(n => !n.isRead).length}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown Thông báo */}
                                {showNoti && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                            <span className="font-black text-sm uppercase tracking-widest text-gray-400">Thông báo của bạn</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => markRead(n.id)}
                                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                <Star className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{n.message}</p>
                                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-400 text-sm">Chưa có thông báo nào.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>

                            <div className="nav-user-greeting hidden md:block">
                                <p className="text-xs text-gray-400 font-bold uppercase text-right">Xin chào,</p>
                                <p className="text-sm font-black text-gray-800 text-right">{user.name}</p>
                            </div>

                            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-nav-text">Đăng Nhập</Link>
                            <Link to="/register" className="btn-nav-primary">Tham Gia Ngay</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;