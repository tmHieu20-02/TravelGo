import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import api from '../services/api';
import { ArrowLeft, Map, Calendar, Sun, Users, Info, Star, Minus, Plus, Clock, Globe2 } from 'lucide-react';

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
                countryId: country?.id,
                tourDate: tourDate,
                guests: guests,
                phone: phone
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

    const bannerUrl = country?.thumbnail
        ? (country.thumbnail.startsWith('/uploads') ? `http://localhost:5000${country.thumbnail}` : country.thumbnail)
        : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1920&auto=format&fit=crop';

    const price = country.price || 499; // Giá mặc định nếu DB chưa có

    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
                <img src={bannerUrl} alt={country.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
                    <div className="max-w-7xl mx-auto w-full">
                        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-all bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-sm font-bold">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại khám phá
                        </Link>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                            <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Điểm đến hàng đầu</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight">{country.name}</h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-white">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-2" />
                                <span className="font-extrabold">4.9</span>
                                <span className="text-white/60 ml-2 text-xs font-medium">(2,400 reviews)</span>
                            </div>
                            <div className="flex items-center text-white/80 font-bold">
                                <Map className="w-5 h-5 mr-2 text-indigo-400" />
                                <span className="text-sm">Châu Á (Demo)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Cột Trái: Thông tin chi tiết */}
                    <div className="lg:col-span-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-10">
                                Tổng Quan Về <span className="text-indigo-600">{country.name}</span>
                            </h2>
                            <p className="text-xl leading-relaxed text-slate-600 font-medium whitespace-pre-line">
                                {country.description || "Chào bạn, trang thông tin cho điểm đến này đang được chúng tôi biên soạn nội dung một cách chỉn chu nhất. Vui lòng quay lại sớm để xem đầy đủ các thông tin hấp dẫn về ẩm thực, văn hóa và lịch trình gợi ý nhé!"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                <h4 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-indigo-500" /> Lưu ý du lịch
                                </h4>
                                <ul className="space-y-3 text-slate-500 font-medium text-sm">
                                    <li className="flex items-center gap-2">• Mang theo bản đồ hoặc sim 4G</li>
                                    <li className="flex items-center gap-2">• Tìm hiểu văn hóa bản địa</li>
                                    <li className="flex items-center gap-2">• Đặt vé tham quan trước 1 tuần</li>
                                </ul>
                            </div>
                            <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                                <h4 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-600" /> Văn hóa
                                </h4>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed italic">
                                    "Người dân ở {country.name} cực kỳ thân thiện và hiếu khách. Đừng quên thử các món ăn đường phố nổi tiếng!"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: BOOKING FORM */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="card-professional p-8 !rounded-[2.5rem] !shadow-2xl">
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Lên Kế Hoạch</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4">
                                            <Sun className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thời tiết</p>
                                            <p className="text-slate-900 font-extrabold">25°C - 32°C</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4">
                                            <Calendar className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mùa đẹp nhất</p>
                                            <p className="text-slate-900 font-extrabold">Tháng 4 - Tháng 9</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-slate-100 space-y-6">
                                    {bookingMessage && (
                                        <div className={`p-4 rounded-2xl text-sm font-bold text-center ${bookingMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {bookingMessage.text}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label !mb-2 uppercase text-[10px] tracking-widest opacity-50">Ngày khởi hành</label>
                                        <input type="date" className="form-input" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label !mb-2 uppercase text-[10px] tracking-widest opacity-50">Số điện thoại</label>
                                        <input type="tel" className="form-input" placeholder="0123 456 789" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label !mb-2 uppercase text-[10px] tracking-widest opacity-50">Số lượng khách</label>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                            <button onClick={() => setGuests(prev => Math.max(1, prev - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-xl font-extrabold text-slate-900">{guests}</span>
                                            <button onClick={() => setGuests(prev => Math.min(20, prev + 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-slate-100">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tổng chi phí</p>
                                            <p className="text-4xl font-extrabold text-slate-900">{(price * guests * 25000).toLocaleString('vi-VN')} ₫</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">Cọc 30%</p>
                                            <p className="text-xl font-extrabold text-amber-700">{(price * guests * 25000 * 0.3).toLocaleString('vi-VN')} ₫</p>
                                        </div>
                                    </div>

                                    {bookedData ? (
                                        <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-4">
                                            <div className="text-center">
                                                <h4 className="font-extrabold text-lg">Đặt tour thành công!</h4>
                                                <p className="text-indigo-100 text-[10px] mt-1 font-bold uppercase tracking-widest">Mã: {bookedData.bookingCode}</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-2xl">
                                                <img 
                                                    src={`https://img.vietqr.io/image/MB-123456789-compact.png?amount=${(bookedData.totalPrice * 0.3 * 25000)}&addInfo=${bookedData.bookingCode}&accountName=TravelGo`}
                                                    alt="Payment QR" 
                                                    className="w-full h-auto rounded-xl"
                                                />
                                            </div>
                                            <p className="text-[10px] text-center text-indigo-100 font-medium">Quét mã QR để chuyển khoản cọc giữ chỗ ngay.</p>
                                        </div>
                                    ) : (
                                        <button onClick={handleBooking} disabled={isBooking} className="btn-primary w-full !py-5 !text-lg !rounded-2xl shadow-xl shadow-indigo-100">
                                            {isBooking ? 'Đang xác nhận...' : '🎫 Xác Nhận Đặt Chỗ'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <footer className="bg-slate-50 py-12 text-center border-t border-slate-100">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">&copy; 2026 TravelGo Experience</p>
            </footer>
        </div>
    );
};

export default CountryDetail;