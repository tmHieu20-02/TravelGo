import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Clock, Search, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminBookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            toast.success(status === 'confirmed' ? "Đã duyệt đơn hàng!" : "Đã hủy đơn hàng!");
            fetchBookings();
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-indigo-600" />
                            Quản Lý Đơn Hàng
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">Theo dõi và phê duyệt các yêu cầu đặt tour.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Tìm mã đơn, tên khách, địa điểm..."
                            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Cột trái: Thông tin Tour */}
                                    <div className="lg:w-1/4 relative h-48 lg:h-auto">
                                        <img 
                                            src={booking.country?.thumbnail?.startsWith('/uploads') ? `http://localhost:5000${booking.country.thumbnail}` : booking.country?.thumbnail} 
                                            className="w-full h-full object-cover"
                                            alt={booking.country?.name}
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                                            {booking.bookingCode}
                                        </div>
                                    </div>

                                    {/* Cột giữa: Chi tiết khách hàng */}
                                    <div className="p-8 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 mb-4">{booking.user?.name}</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-500 font-medium">
                                                    <Mail className="w-4 h-4 mr-3 text-indigo-400" /> {booking.user?.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 font-medium">
                                                    <Phone className="w-4 h-4 mr-3 text-indigo-400" /> {booking.phone}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 font-medium">
                                                    <MapPin className="w-4 h-4 mr-3 text-indigo-400" /> {booking.country?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ngày khởi hành</p>
                                                    <p className="font-bold text-gray-800">{new Date(booking.tourDate).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trạng thái</p>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {booking.status === 'confirmed' ? 'Đã duyệt' : booking.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng tiền</p>
                                                    <p className="text-2xl font-black text-indigo-600">${booking.totalPrice}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Cọc 30%</p>
                                                    <p className="font-black text-amber-600">${(booking.totalPrice * 0.3).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột phải: Actions */}
                                    <div className="p-8 lg:border-l border-gray-100 flex lg:flex-col justify-center gap-3 bg-gray-50/50">
                                        {booking.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                                >
                                                    <CheckCircle className="w-5 h-5" /> Duyệt đơn
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                                                >
                                                    <XCircle className="w-5 h-5" /> Từ chối
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400 italic text-sm">
                                                <Clock className="w-8 h-8 opacity-20" />
                                                Đã xử lý xong
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookingPage;
