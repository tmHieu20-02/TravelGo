import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CountryList from '../components/Country/CountryList';
import { Search, MapPin, Compass } from 'lucide-react';

/**
 * COMPONENT: DestinationsPage
 * Trang liệt kê tất cả các quốc gia và cho phép tìm kiếm nhanh.
 */
const DestinationsPage = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 1. State lưu từ khóa tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');

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

    // 2. LOGIC TÌM KIẾM (FILTER):
    // Lọc danh sách countries dựa trên searchQuery. 
    // Chúng ta chuyển cả hai về chữ thường (toLowerCase) để tìm kiếm không phân biệt hoa thường.
    const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (country.description && country.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-10 px-4 md:px-10 pb-20">
            <div className="max-w-7xl mx-auto">
                
                {/* Header trang */}
                <header className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Compass className="w-8 h-8 animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Khám Phá Các Điểm Đến
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Tìm kiếm và lựa chọn quốc gia bạn yêu thích để bắt đầu hành trình trải nghiệm những vùng đất mới.
                    </p>
                </header>

                {/* SEARCH BAR SECTION */}
                <div className="max-w-2xl mx-auto mb-16 relative">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-4 py-5 bg-white border-none rounded-3xl shadow-xl shadow-indigo-100/50 focus:ring-2 focus:ring-indigo-500 text-lg transition-all placeholder:text-gray-400"
                            placeholder="Nhập tên quốc gia hoặc thành phố..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {/* Hiển thị số lượng kết quả */}
                    <div className="mt-4 flex justify-between items-center px-2">
                        <p className="text-sm font-medium text-gray-400">
                            {searchQuery ? `Tìm thấy ${filteredCountries.length} kết quả` : `Tổng cộng ${countries.length} điểm đến`}
                        </p>
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                </div>

                {/* DANH SÁCH KẾT QUẢ */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-white rounded-3xl animate-shimmer"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredCountries.length > 0 ? (
                            <CountryList countries={filteredCountries} />
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-200">
                                <div className="text-gray-300 mb-4 flex justify-center">
                                    <MapPin className="w-16 h-16" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác xem sao bạn nhé!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DestinationsPage;
