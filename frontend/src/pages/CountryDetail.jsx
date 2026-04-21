import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import api from '../services/api';
import { ArrowLeft, Map, Calendar, Sun, Users, Info, Star, Minus, Plus, Clock } from 'lucide-react';

const CountryDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate(); // Khởi tạo hook chuyển trang

    // 1. STATE DỮ LIỆU BẢN ĐỒ
    const [country, setCountry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. STATE ĐẶT TOUR (Thêm mới)
    const [guests, setGuests] = useState(1);
    const [tourDate, setTourDate] = useState('');
    const [phone, setPhone] = useState(''); // Thêm state số điện thoại
    const [isBooking, setIsBooking] = useState(false);
    const [bookingMessage, setBookingMessage] = useState(null);
    const [bookedData, setBookedData] = useState(null); // Lưu thông tin sau khi đặt thành công

    // FETCH DATA
    useEffect(() => {
        const fetchCountry = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/countries/${slug}`);
                setCountry(response.data);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết:", err);
                setError("Rất tiếc, chúng tôi không tìm thấy điểm đến này.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCountry();
    }, [slug]);

    // 3. HÀM XỬ LÝ ĐẶT TOUR (Thêm mới)
    const handleBooking = async () => {
        if (!tourDate || !phone) {
            alert("Vui lòng nhập đầy đủ Ngày khởi hành và Số điện thoại!");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Bạn cần đăng nhập để đặt tour. Chuyển hướng đến trang Đăng nhập...");
            navigate('/login');
            return;
        }

        setIsBooking(true);
        setBookingMessage(null);

        try {
            // Dùng api instance của bạn để gọi backend
            const response = await api.post('/bookings', {
                countryId: country.id,
                tourDate: tourDate,
                guests: guests,
                phone: phone // Gửi số điện thoại lên Backend
            });

            setBookedData(response.data.booking);
            setBookingMessage({ type: 'success', text: response.data.message || "🎉 Đặt tour thành công!" });
        } catch (error) {
            setBookingMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi hệ thống khi đặt tour!' });
        } finally {
            setIsBooking(false);
        }
    };

    // UI: ĐANG TẢI (Giữ nguyên của bạn)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="h-[60vh] md:h-[75vh] w-full animate-shimmer"></div>
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="h-10 w-48 animate-shimmer rounded mb-8"></div>
                    <div className="h-64 w-full animate-shimmer rounded-3xl"></div>
                </div>
            </div>
        );
    }

    // UI: LỖI (Giữ nguyên của bạn)
    if (error || !country) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="text-red-500 mb-6 bg-red-50 p-6 rounded-full">
                    <Info className="w-16 h-16" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Ối! Lạc đường rồi.</h1>
                <p className="text-gray-500 mb-8 text-center max-w-sm">{error}</p>
                <Link to="/" className="btn-nav-primary flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại trang chủ
                </Link>
            </div>
        );
    }

    const bannerUrl = country.thumbnail
        ? (country.thumbnail.startsWith('/uploads') ? `http://localhost:5000${country.thumbnail}` : country.thumbnail)
        : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1920&auto=format&fit=crop';

    const price = country.price || 499; // Giá mặc định nếu DB chưa có

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION - GIỮ NGUYÊN CỦA BẠN */}
            <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
                <img src={bannerUrl} alt={country.name} className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
                    <div className="max-w-7xl mx-auto w-full">
                        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-all bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại khám phá
                        </Link>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Điểm đến hàng đầu</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">{country.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-2" />
                                <span className="font-bold">4.9</span>
                                <span className="text-white/60 ml-1 text-sm">(2,400 đánh giá)</span>
                            </div>
                            <div className="flex items-center text-gray-200">
                                <Map className="w-5 h-5 mr-2 text-indigo-400" />
                                <span className="font-medium">Châu Á (Demo)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Cột Trái: Thông tin chi tiết - GIỮ NGUYÊN */}
                    <div className="lg:col-span-8">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 inline-block relative">
                                Tổng Quan Về {country.name}
                                <span className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-indigo-600 rounded-full"></span>
                            </h2>
                            <p className="text-xl leading-relaxed text-gray-600/90 whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
                                {country.description || "Chào bạn, trang thông tin cho điểm đến này đang được chúng tôi biên soạn nội dung một cách chỉn chu nhất. Vui lòng quay lại sớm để xem đầy đủ các thông tin hấp dẫn về ẩm thực, văn hóa và lịch trình gợi ý nhé!"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-slate-50 p-8 rounded-3xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-indigo-500" /> Lưu ý du lịch
                                </h4>
                                <ul className="space-y-3 text-gray-600 text-sm">
                                    <li>• Mang theo bản đồ hoặc sim 4G.</li>
                                    <li>• Tìm hiểu văn hóa bản địa trước khi đi.</li>
                                    <li>• Đặt vé tham quan trước 1 tuần.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-green-500" /> Văn hóa bản địa
                                </h4>
                                <p className="text-gray-600 text-sm italic">
                                    "Người dân ở {country.name} cực kỳ thân thiện và hiếu khách. Đừng quên thử các món ăn đường phố nổi tiếng tại đây!"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: KẾ HOẠCH ĐI & BOOKING FORM (Đã Nâng Cấp) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-gray-100 transform transition-transform hover:scale-[1.02]">
                                <h3 className="text-2xl font-black text-gray-900 mb-8">Kế Hoạch Đi</h3>

                                {/* Widget Thông tin phụ */}
                                <div className="space-y-6">
                                    <div className="flex items-center p-4 bg-orange-50 rounded-2xl">
                                        <Sun className="w-10 h-10 text-orange-500 mr-4 p-2 bg-white rounded-xl shadow-sm" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Thời tiết</p>
                                            <p className="text-gray-900 font-bold">25°C - 32°C (Mát mẻ)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-green-50 rounded-2xl">
                                        <Calendar className="w-10 h-10 text-green-600 mr-4 p-2 bg-white rounded-xl shadow-sm" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mùa đẹp nhất</p>
                                            <p className="text-gray-900 font-bold">Tháng 4 - Tháng 9</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Nhập Ngày và Số Người (Phần Mới - Cao Cấp) */}
                                <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
                                    {bookingMessage && (
                                        <div className={`p-4 rounded-2xl text-sm font-bold text-center animate-bounce ${bookingMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {bookingMessage.type === 'success' ? '✨ ' : '❌ '} {bookingMessage.text}
                                        </div>
                                    )}

                                    {/* Ngày khởi hành */}
                                    <div className="space-y-3">
                                        <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                            <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Ngày khởi hành
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all duration-300 font-bold text-gray-700 group-hover:bg-gray-100/50"
                                                value={tourDate}
                                                onChange={(e) => setTourDate(e.target.value)}
                                            />
                                            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/0 group-focus-within:border-indigo-500/100 pointer-events-none transition-all duration-500"></div>
                                        </div>
                                    </div>

                                    {/* Số điện thoại */}
                                    <div className="space-y-3">
                                        <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                            <Users className="w-4 h-4 mr-2 text-indigo-500" /> Số điện thoại liên lạc
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Nhập số điện thoại của bạn"
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all duration-300 font-bold text-gray-700 hover:bg-gray-100/50"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>

                                    {/* Số hành khách */}
                                    <div className="space-y-3">
                                        <label className="flex items-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                            <Users className="w-4 h-4 mr-2 text-indigo-500" /> Số lượng khách
                                        </label>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border-2 border-transparent hover:bg-gray-100/50 transition-colors group focus-within:border-indigo-500">
                                            <button
                                                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>

                                            <div className="text-center">
                                                <span className="block text-2xl font-black text-gray-800">{guests}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Khách</span>
                                            </div>

                                            <button
                                                onClick={() => setGuests(prev => Math.min(20, prev + 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Thông tin thời lượng (Thêm mới) */}
                                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-indigo-500 mr-3" />
                                            <span className="text-sm font-bold text-indigo-900">Thời lượng dự kiến</span>
                                        </div>
                                        <span className="text-sm font-black text-indigo-600">4 Ngày 3 Đêm</span>
                                    </div>
                                </div>

                                {/* Tổng Tiền và Nút Chốt Đơn */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider">Giá mỗi khách</span>
                                            <span className="font-bold text-gray-700">${price}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-dashed border-gray-100 pb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Tổng cộng</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                                        ${price * guests}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Phần tính tiền cọc 30% */}
                                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Tiền cọc giữ chỗ (30%)</p>
                                                <p className="text-xl font-black text-amber-700">${(price * guests * 0.3).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-amber-500 bg-white px-2 py-1 rounded-md shadow-sm">Thanh toán ngay</span>
                                            </div>
                                        </div>
                                    </div>

                                    {bookedData ? (
                                        <div className="bg-indigo-600 rounded-2xl p-6 text-white space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Star className="w-6 h-6 text-white" />
                                                </div>
                                                <h4 className="font-black text-xl">Đặt tour thành công!</h4>
                                                <p className="text-indigo-100 text-xs mt-1">Vui lòng hoàn tất đặt cọc 30%</p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-4">
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-60">Mã đơn hàng:</span>
                                                    <span className="font-mono font-bold tracking-widest">{bookedData.bookingCode}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="opacity-60">Số tiền cọc:</span>
                                                    <span className="font-bold text-amber-300 font-mono">${(bookedData.totalPrice * 0.3).toFixed(2)}</span>
                                                </div>
                                                {/* NHÚNG QR CODE VIETQR */}
                                                <div className="bg-white p-2 rounded-xl shadow-inner">
                                                    <img 
                                                        src={`https://img.vietqr.io/image/MB-123456789-compact.png?amount=${(bookedData.totalPrice * 0.3 * 25000)}&addInfo=${bookedData.bookingCode}&accountName=TravelGo%20Booking`}
                                                        alt="Payment QR Code" 
                                                        className="w-full h-auto rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[10px] leading-relaxed opacity-80 bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                                                📌 Quét mã QR trên để chuyển khoản cọc (quy đổi tỷ giá 25k/$). 
                                                <br/>Nội dung: <strong>{bookedData.bookingCode}</strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleBooking}
                                            disabled={isBooking}
                                            className={`group relative w-full py-5 rounded-2xl font-black text-lg transition-all overflow-hidden ${isBooking
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-slate-900 text-white hover:bg-black shadow-2xl shadow-indigo-200 active:scale-[0.98]'
                                                }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {isBooking ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                        Đang xác nhận...
                                                    </>
                                                ) : (
                                                    <>
                                                        🎫 Xác Nhận Đặt Chỗ
                                                        <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                            {!isBooking && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            )}
                                        </button>
                                    )}
                                    <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
                                        🔒 Thanh toán an toàn qua cổng quốc tế
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 py-12 text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">&copy; 2026 TravelGo Experience - Make your life better</p>
            </div>
        </div>
    );
};

export default CountryDetail;