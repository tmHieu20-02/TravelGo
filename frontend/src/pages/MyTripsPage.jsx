import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    Calendar, 
    MapPin, 
    CreditCard, 
    Clock, 
    CheckCircle, 
    XCircle, 
    ChevronRight, 
    Plane, 
    Ticket,
    AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MyTripsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng", error);
            toast.error("Không thể tải danh sách chuyến đi");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy chuyến đi này không?")) return;
        
        try {
            await api.patch(`/bookings/${id}/cancel`);
            toast.success("Đã hủy chuyến đi thành công");
            fetchBookings(); // Tải lại danh sách
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi hủy chuyến đi");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" /> Đã xác nhận
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <XCircle className="w-3.5 h-3.5" /> Đã hủy
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" /> Chờ duyệt
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-10">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Plane className="text-indigo-600 w-8 h-8" /> Chuyến đi của tôi
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Quản lý các hành trình và đơn đặt chỗ của bạn tại đây.</p>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-black text-indigo-600">{bookings.length}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng đơn</div>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-green-600">
                                {bookings.filter(b => b.status === 'confirmed').length}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đã duyệt</div>
                        </div>
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-white rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="flex flex-col md:flex-row">
                                    {/* Thumbnail */}
                                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                                        <img 
                                            src={booking.country?.thumbnail || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop'} 
                                            alt={booking.country?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow p-8">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                            <div>
                                                <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Ticket className="w-3 h-3" /> Mã đơn: #{booking.id.toString().padStart(5, '0')}
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{booking.country?.name}</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-gray-900 tracking-tight">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                                                </div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng thanh toán</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày khởi hành</div>
                                                    <div className="text-sm font-bold">{new Date(booking.tourDate).toLocaleDateString('vi-VN')}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Điểm đến</div>
                                                    <div className="text-sm font-bold">{booking.country?.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng</div>
                                                    <div className="text-sm font-bold">{booking.guests} người lớn</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-50">
                                            {booking.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="flex-1 sm:flex-none px-8 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" /> Hủy chuyến
                                                </button>
                                            )}
                                            <button className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                                                Xem chi tiết <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa có chuyến đi nào</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Hãy bắt đầu khám phá những điểm đến tuyệt vời và đặt chuyến đi đầu tiên của bạn ngay hôm nay!</p>
                        <Link to="/destinations" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100">
                            Khám phá ngay <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTripsPage;
