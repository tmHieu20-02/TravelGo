import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Clock, Search, Package, Phone, Mail, MapPin, Users, Calendar, DollarSign, Filter, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminBookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách booking:", error);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        const action = status === 'confirmed' ? 'duyệt' : 'từ chối';
        if (!window.confirm(`Bạn có chắc muốn ${action} đơn hàng này?`)) return;

        try {
            await api.patch(`/bookings/${id}/status`, { status });
            toast.success(status === 'confirmed' ? "✅ Đã duyệt đơn hàng!" : "❌ Đã từ chối đơn hàng!");
            fetchBookings();
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    // Filters
    const filteredBookings = bookings
        .filter(b => statusFilter === 'all' || b.status === statusFilter)
        .filter(b =>
            b.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.country?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.phone?.includes(searchTerm)
        );

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0),
    };

    const statusConfig = {
        pending:   { label: 'Chờ duyệt',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200', dot: 'bg-amber-500' },
        confirmed: { label: 'Đã duyệt',   bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        cancelled: { label: 'Đã từ chối', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200', dot: 'bg-red-500' },
    };

    const filterTabs = [
        { key: 'all',       label: 'Tất cả',     count: stats.total },
        { key: 'pending',   label: 'Chờ duyệt',  count: stats.pending },
        { key: 'confirmed', label: 'Đã duyệt',   count: stats.confirmed },
        { key: 'cancelled', label: 'Đã từ chối', count: stats.cancelled },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: '1rem', fontWeight: 700 } }} />

            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* ===== HEADER ===== */}
                <header className="admin-header-box">
                    <div>
                        <h1 className="admin-title-h1 flex items-center gap-4">
                            <div className="logo-icon !w-12 !h-12">
                                <Package className="w-6 h-6" />
                            </div>
                            Quản Lý Đơn Hàng
                        </h1>
                        <p className="admin-subtitle">Theo dõi, phê duyệt và quản lý toàn bộ đơn đặt tour.</p>
                    </div>
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm theo mã đơn, tên khách, địa điểm, SĐT..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* ===== STATS CARDS ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="card-professional p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50">
                            <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tổng đơn hàng</p>
                            <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                    <div className="card-professional p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Chờ duyệt</p>
                            <p className="text-2xl font-extrabold text-slate-900">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="card-professional p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Đã xác nhận</p>
                            <p className="text-2xl font-extrabold text-slate-900">{stats.confirmed}</p>
                        </div>
                    </div>
                    <div className="card-professional p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Doanh thu (VNĐ)</p>
                            <p className="text-2xl font-extrabold text-slate-900">{(stats.revenue * 25000).toLocaleString('vi-VN')} ₫</p>
                        </div>
                    </div>
                </div>

                {/* ===== FILTER TABS ===== */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                statusFilter === tab.key
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                            }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ===== BOOKING LIST ===== */}
                {isLoading ? (
                    <div className="state-container">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold text-sm">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="state-container">
                        <div className="state-icon-bg">
                            <Package className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold">Không tìm thấy đơn hàng nào</p>
                        <p className="text-slate-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => {
                            const sc = statusConfig[booking.status] || statusConfig.pending;
                            const thumbUrl = booking.country?.thumbnail?.startsWith('/uploads')
                                ? `http://localhost:5000${booking.country.thumbnail}`
                                : booking.country?.thumbnail;

                            return (
                                <div key={booking.id} className="card-professional overflow-hidden">
                                    <div className="flex flex-col lg:flex-row">

                                        {/* Thumbnail + Badge */}
                                        <div className="lg:w-56 h-48 lg:h-auto relative flex-shrink-0 overflow-hidden">
                                            {thumbUrl ? (
                                                <img src={thumbUrl} className="w-full h-full object-cover" alt={booking.country?.name} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-4xl">✈️</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent lg:bg-gradient-to-r"></div>
                                            <div className="absolute bottom-4 left-4 lg:bottom-4 lg:left-4">
                                                <p className="text-white font-extrabold text-lg">{booking.country?.name || '—'}</p>
                                                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">{booking.bookingCode}</p>
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-grow p-8">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                {/* Customer Info */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-slate-900 text-lg">{booking.user?.name || 'N/A'}</p>
                                                            <p className="text-slate-400 text-xs font-medium">{booking.user?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                                        <span className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-indigo-400" />
                                                            {booking.phone || 'Chưa có SĐT'}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-indigo-400" />
                                                            {new Date(booking.tourDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-indigo-400" />
                                                            {booking.guests} khách
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price + Status */}
                                                <div className="flex flex-col items-end gap-4 min-w-[160px]">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                                                        <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
                                                        {sc.label}
                                                    </span>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tổng tiền</p>
                                                        <p className="text-2xl font-extrabold text-slate-900">{(booking.totalPrice * 25000).toLocaleString('vi-VN')} ₫</p>
                                                        <p className="text-xs font-bold text-amber-600 mt-1">Cọc: {(booking.totalPrice * 25000 * 0.3).toLocaleString('vi-VN')} ₫</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-8 py-6 lg:px-6 lg:py-8 lg:border-l border-t lg:border-t-0 border-slate-100 flex lg:flex-col items-center justify-center gap-3 bg-slate-50/50 lg:w-48 flex-shrink-0">
                                            {booking.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        className="btn-primary !rounded-xl flex-1 lg:flex-none lg:w-full"
                                                    >
                                                        <CheckCircle className="w-5 h-5" /> Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                        className="btn-danger !rounded-xl flex-1 lg:flex-none lg:w-full"
                                                    >
                                                        <XCircle className="w-5 h-5" /> Từ chối
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-300">
                                                    <CheckCircle className="w-8 h-8" />
                                                    <p className="text-xs font-bold text-slate-400">Đã xử lý</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                {!isLoading && filteredBookings.length > 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Hiển thị {filteredBookings.length} / {bookings.length} đơn hàng
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookingPage;
