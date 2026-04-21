import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CountryList from '../components/Country/CountryList';
import {
    Compass, Users, Globe, Heart,
    Share2, Send, MessageCircle, MapPin, Star
} from 'lucide-react';

const HomePage = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCountries();
    }, []);

    return (
        <div className="page-home-container bg-white">
            {/* 1. HERO SECTION - CẢM HỨNG */}
            <div className="hero-section relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="hero-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop"
                        alt="Mount Fuji Landscape"
                        className="hero-image scale-105"
                    />
                </div>
                <div className="absolute inset-0 bg-black/30"></div> {/* Lớp phủ tối nhẹ */}

                <div className="hero-content relative z-10 text-center max-w-4xl px-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-sm font-bold mb-6 animate-bounce">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        Lựa chọn số 1 cho những chuyến đi
                    </div>
                    <h1 className="hero-title text-6xl md:text-8xl font-black mb-6 leading-tight">
                        Khám Phá <span className="text-indigo-400 italic">Vô Tận</span>
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl mb-10 opacity-90 font-medium">
                        Chúng tôi không chỉ bán những chuyến đi, chúng tôi kiến tạo những hành trình thay đổi cuộc đời bạn.
                    </p>
                    <Link to="/destinations" className="btn-hero-action inline-block bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-full text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                        Bắt Đầu Hành Trình Ngay
                    </Link>
                </div>
            </div>


            {/* 4. DESTINATIONS SECTION - DANH SÁCH THỰC TẾ */}
            <section className="bg-slate-50 py-24 px-6">
                <div className="max-w-7xl mx-auto text-black">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="text-left">
                            <h2 className="text-4xl font-black text-gray-900 mb-4 inline-block relative">
                                Điểm Đến <span className="text-indigo-600">Nổi Bật</span>
                                <div className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-indigo-600 rounded-full"></div>
                            </h2>
                            <p className="text-gray-500 text-lg">Top những không gian được lựa chọn bởi cộng đồng.</p>
                        </div>
                        <Link to="/destinations" className="btn-nav-primary flex items-center group">
                            Xem tất cả <Compass className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white rounded-3xl animate-shimmer"></div>)}
                        </div>
                    ) : (
                        <CountryList countries={countries.slice(0, 3)} />
                    )}
                </div>
            </section>

            {/* 5. WHY CHOOSE US - GIÁ TRỊ CỐT LÕI */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
                            alt="Discovery"
                            className="rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
                        />
                        <div className="absolute -bottom-8 -right-8 glass-card p-6 rounded-3xl hidden md:block">
                            <div className="flex items-center gap-4">

                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">Tại sao hơn <span className="text-indigo-600">10 vạn khách hàng</span> lựa chọn chúng tôi?</h2>
                        <div className="space-y-6">
                            {[
                                { t: 'Dịch vụ chuẩn 5 sao', d: 'Mọi hành trình đều được chuẩn bị kỹ lưỡng từ chỗ ở đến phương tiện di chuyển.' },
                                { t: 'Đội ngũ chuyên nghiệp', d: 'Hướng dẫn viên bản địa am hiểu sâu sắc về văn hóa và con người.' },
                                { t: 'Chi phí minh bạch', d: 'Cam kết không phát sinh thêm bất kỳ chi phí ẩn nào trong suốt chuyến đi.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-6 rounded-3xl hover:bg-indigo-50 transition-colors group cursor-pointer">
                                    <div className="h-10 w-10 flex-shrink-0 bg-white shadow-md rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all font-black">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">{item.t}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* 7. PREMIUM FOOTER */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-10 text-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div>
                            <span className="text-3xl font-black text-gray-800 tracking-tight mb-6 block">TRAVEL<span className="text-indigo-600">GO</span></span>
                            <p className="text-gray-500 mb-6 leading-relaxed">Sứ mệnh của chúng tôi là biến mọi kỳ nghỉ của bạn trở thành những kỷ niệm vô giá xuyên suốt cuộc đời.</p>
                            <div className="flex gap-4">
                                {[Share2, Globe, Send, MessageCircle].map((Icon, i) => (
                                    <a key={i} href="#" className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-all">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-sm">Điểm Đến</h4>
                            <ul className="space-y-4 text-gray-500 font-medium">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Việt Nam</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Nhật Bản</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Châu Âu</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Châu Mỹ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-sm">Công Ty</h4>
                            <ul className="space-y-4 text-gray-500 font-medium">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Về chúng tôi</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog Travel</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Hỗ trợ khách hàng</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-sm">Liên Hệ</h4>
                            <ul className="space-y-4 text-gray-400 font-medium italic">
                                <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-indigo-500" /> 123 Đường Du Lịch, Quận 1, TPHCM</li>
                                <li className="flex items-center gap-3"><Users className="w-5 h-5 text-indigo-500" /> +84 123 456 789</li>
                                <li className="flex items-center gap-3 italic underline text-indigo-600 outline-none hover:text-indigo-800">Support@travelgo.com</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">&copy; 2026 TravelGo Experience. Đã đăng ký bản quyền.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

