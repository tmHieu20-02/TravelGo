import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
// Lucide-react cung cấp các icon dạng SVG siêu nhẹ và đẹp
import { ArrowLeft, Map, Calendar, Sun, Users, Info, Star } from 'lucide-react';

/**
 * COMPONENT: CountryDetail
 * Luồng hoạt động chính:
 * 1. Lấy 'slug' từ thanh địa chỉ (URL) thông qua useParams.
 * 2. Dùng useEffect để tự động gọi API lấy dữ liệu mỗi khi 'slug' thay đổi.
 * 3. Lưu dữ liệu vào state 'country' để hiển thị ra giao diện.
 */
const CountryDetail = () => {
    // 1. Lấy THAM SỐ từ URL (Vd: /destination/da-nang -> slug = "da-nang")
    // Đây là tính năng của React Router để xử lý các trang có nội dung động.
    const { slug } = useParams();

    // 2. Định nghĩa các TRẠNG THÁI (State)
    const [country, setCountry] = useState(null); // Lưu thông tin quốc gia
    const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải
    const [error, setError] = useState(''); // Lưu thông tin lỗi nếu có

    // 3. HIỆU ỨNG (Side Effect): Chạy khi component được nạp hoặc khi 'slug' thay đổi
    useEffect(() => {
        const fetchCountry = async () => {
            setIsLoading(true); // Bật trạng thái tải
            try {
                // Gọi API backend với tham số slug
                const response = await api.get(`/countries/${slug}`);
                setCountry(response.data);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết:", err);
                setError("Rất tiếc, chúng tôi không tìm thấy điểm đến này.");
            } finally {
                setIsLoading(false); // Tắt trạng thái tải sau khi xong
            }
        };
        fetchCountry();
    }, [slug]); // Mảng phụ thuộc [slug] giúp React biết khi nào cần chạy lại hàm này

    // 4. Giao diện ĐANG TẢI (Loading Shimmer)
    // Giúp người dùng cảm thấy ứng dụng mượt mà hơn là để màn hình trắng.
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

    // 5. Giao diện LỖI (Error State)
    if (error || !country) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="text-red-500 mb-6 bg-red-50 p-6 rounded-full">
                    <Info className="w-16 h-16" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Ối! Lạc đường rồi.</h1>
                <p className="text-gray-500 mb-8 text-center max-w-sm">{error}</p>
                <Link to="/" className="btn-nav-primary flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại trang chủ
                </Link>
            </div>
        );
    }

    // 6. Xử lý logic HÌNH ẢNH (Giải quyết lỗi "Bể hình")
    // Ưu tiên ảnh từ Server, nếu không có sẽ lấy ảnh High-res (w=1920) để không bị vỡ.
    const bannerUrl = country.thumbnail 
        ? (country.thumbnail.startsWith('/uploads') ? `http://localhost:5000${country.thumbnail}` : country.thumbnail)
        : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1920&auto=format&fit=crop'; // Fuji high-res làm dự phòng

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION: Banner hình ảnh khổ lớn */}
            <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
                <img 
                    src={bannerUrl} 
                    alt={country.name} 
                    className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-[2000ms]" 
                />
                
                {/* Lớp Overlay Gradient: Tạo độ tương phản cho phần chữ bên dưới */}
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
                        
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
                            {country.name}
                        </h1>
                        
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

            {/* CONTENT SECTION: Nội dung chia 2 cột */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Cột Trái (8/12): Thông tin chi tiết */}
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

                        {/* Dummy Section: Thêm phần thông tin ảo để trang trông "xịn" hơn */}
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

                    {/* Cột Phải (4/12): Sidebar đặt chỗ & Thông số nhanh */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-gray-100 transform transition-transform hover:scale-[1.02]">
                                <h3 className="text-2xl font-black text-gray-900 mb-8">Kế Hoạch Đi</h3>
                                
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

                                <div className="mt-10 pt-8 border-t border-gray-100">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-gray-500 font-medium">Giá tour tham khảo</span>
                                        <span className="text-3xl font-black text-indigo-600">$499<span className="text-sm font-normal text-gray-400">/khách</span></span>
                                    </div>
                                    
                                    <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                                        Đặt Hành Trình Ngay
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4 font-medium">Bảo đảm giá tốt nhất - Hoàn tiền 100%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Footer đơn giản */}
            <div className="bg-gray-50 border-t border-gray-100 py-12 text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">&copy; 2026 TravelGo Experience - Make your life better</p>
            </div>
        </div>
    );
};

export default CountryDetail;

