import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ClipboardList, Globe, LogOut, User as UserIcon, Calendar, Star } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [bookingsCount, setBookingsCount] = useState(0);
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

    const fetchBookingsCount = async () => {
        try {
            const res = await api.get('/bookings/my-bookings');
            setBookingsCount(res.data.length);
        } catch (err) {
            console.error("Lỗi lấy số lượng đơn hàng", err);
        }
    };

    // Kiểm tra trạng thái đăng nhập mỗi khi component render
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            fetchNotifications();
            fetchBookingsCount();
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
        <nav className="navbar-main">
            <div className="navbar-inner">

                {/* Logo */}
                <Link to="/" className="logo-brand">
                    <div className="logo-icon">
                        ✈️
                    </div>
                    <span>TRAVEL<span className="text-indigo-600">GO</span></span>
                </Link>

                {/* Menu Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Trang Chủ</Link>
                    <Link to="/destinations" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Điểm Đến</Link>
                    {user && (
                        <Link to="/my-trips" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 relative">
                            Chuyến đi
                            {bookingsCount > 0 && (
                                <span className="absolute -top-2 -right-3 w-4 h-4 bg-indigo-600 text-white text-[9px] flex items-center justify-center rounded-full border border-white font-black">
                                    {bookingsCount}
                                </span>
                            )}
                        </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                        <div className="flex items-center gap-3 border-l border-slate-100 pl-6 ml-2">
                            <Link to="/admin/countries" className="btn-secondary !px-4 !py-2 !rounded-lg text-xs">
                                <Globe className="w-4 h-4" /> Quản lý Tour
                            </Link>
                            <Link to="/admin/bookings" className="btn-primary !px-4 !py-2 !rounded-lg text-xs">
                                <ClipboardList className="w-4 h-4" /> Đơn hàng
                            </Link>
                        </div>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Nút thông báo */}
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setShowNoti(!showNoti)}
                                    className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all relative"
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
                                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                            <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Thông báo của bạn</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => markRead(n.id)}
                                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                <Star className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{n.message}</p>
                                                                <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-slate-400 text-sm italic">Chưa có thông báo nào.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

                            <div className="hidden md:block">
                                <p className="text-[10px] text-slate-400 font-bold uppercase text-right">Xin chào,</p>
                                <p className="text-sm font-extrabold text-slate-800 text-right">{user.name}</p>
                            </div>

                            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-2">Đăng Nhập</Link>
                            <Link to="/register" className="btn-primary !py-2.5 !px-5">Tham Gia Ngay</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;