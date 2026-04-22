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
        <div className="bg-white">
            {/* 1. HERO SECTION - CẢM HỨNG */}
            <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white text-xs font-bold mb-8 uppercase tracking-widest">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        Lựa chọn số 1 cho những chuyến đi
                    </div>
                    <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Khám Phá <span className="text-indigo-400 italic">Thế Giới</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Chúng tôi kiến tạo những hành trình không chỉ để đi, mà để thay đổi cách bạn nhìn nhận cuộc sống.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/destinations" className="btn-primary !px-10 !py-5 !text-lg !rounded-2xl shadow-2xl">
                            Bắt đầu ngay
                        </Link>
                        <button className="px-10 py-5 text-white font-bold text-lg hover:text-indigo-300 transition-colors">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. DESTINATIONS SECTION */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                                Điểm Đến <span className="text-indigo-600">Nổi Bật</span>
                            </h2>
                            <p className="text-slate-500 text-lg font-medium">
                                Khám phá bộ sưu tập những địa điểm du lịch hàng đầu được tuyển chọn kỹ lưỡng.
                            </p>
                        </div>
                        <Link to="/destinations" className="btn-secondary !rounded-2xl flex items-center group">
                            Xem tất cả <Compass className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <CountryList countries={countries.slice(0, 4)} />
                    )}
                </div>
            </section>

            {/* 3. VALUE SECTION */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-indigo-100 rounded-[4rem] -rotate-3 z-0"></div>
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
                            alt="Experience"
                            className="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[600px] w-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                            Tại sao bạn nên chọn <br />
                            <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">TravelGo?</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { t: 'Dịch vụ chuẩn 5 sao', d: 'Mọi hành trình đều được chuẩn bị kỹ lưỡng từ chỗ ở đến phương tiện di chuyển.' },
                                { t: 'Đội ngũ chuyên nghiệp', d: 'Hướng dẫn viên bản địa am hiểu sâu sắc về văn hóa và con người.' },
                                { t: 'Chi phí minh bạch', d: 'Cam kết không phát sinh thêm bất kỳ chi phí ẩn nào trong suốt chuyến đi.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="h-12 w-12 flex-shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        0{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-extrabold text-slate-900 mb-2">{item.t}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOOTER */}
            <footer className="bg-slate-950 text-white pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-8">
                            <span className="text-3xl font-extrabold tracking-tighter">TRAVEL<span className="text-indigo-500">GO</span></span>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Sứ mệnh của chúng tôi là biến mọi kỳ nghỉ trở thành những kỷ niệm vô giá.
                            </p>
                            <div className="flex gap-4">
                                {[Share2, Globe, Send, MessageCircle].map((Icon, i) => (
                                    <a key={i} href="#" className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all border border-white/10">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-white mb-8 uppercase tracking-widest text-xs">Khám phá</h4>
                            <ul className="space-y-4 text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Việt Nam</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Nhật Bản</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Châu Âu</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-white mb-8 uppercase tracking-widest text-xs">Về chúng tôi</h4>
                            <ul className="space-y-4 text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Câu chuyện</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Hỗ trợ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-white mb-8 uppercase tracking-widest text-xs">Liên hệ</h4>
                            <div className="space-y-4 text-slate-400 font-medium">
                                <p className="flex items-start gap-3"><MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" /> Gò Vấp, TP.HCM</p>
                                <p className="flex items-center gap-3"><Users className="w-5 h-5 text-indigo-500 flex-shrink-0" /> +84 123 456 789</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                            &copy; 2026 TravelGo. Đã đăng ký bản quyền.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

