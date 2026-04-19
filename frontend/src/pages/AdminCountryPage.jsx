import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CountryList from '../components/Country/CountryList';
import CountryForm from '../components/Country/CountryForm';
import { Globe2 } from 'lucide-react';

const AdminCountryPage = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCountry, setEditingCountry] = useState(null); // Lưu trữ quốc gia đang chỉnh sửa

    // Hàm gọi API lấy danh sách mới nhất
    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/countries');
            setCountries(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quốc gia", error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect với [] sẽ chỉ chạy hàm fetchCountries 1 lần duy nhất khi lúc trang mới load xong
    useEffect(() => {
        fetchCountries();
    }, []);

    // Hàm xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa quốc gia này? Hành động này không thể hoàn tác.")) {
            try {
                await api.delete('/countries/' + id);
                fetchCountries(); // Load lại danh sách sau khi xóa
                // Xóa luôn trạng thái đang sửa (nếu có)
                if (editingCountry && editingCountry.id === id) {
                    setEditingCountry(null);
                }
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa!");
            }
        }
    };

    return (
        <div className="page-admin-container">
            <div className="max-w-7xl mx-auto">
                <header className="admin-header">
                    <h1 className="admin-title">
                        <Globe2 className="w-6 h-6 mr-3 text-red-500" />
                        Admin Dashboard - Quản lý Dữ liệu Tour
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Giao diện ẩn này dành cho quản trị viên đăng bài.</p>
                </header>

                <div className="admin-grid-layout">
                    {/* Cột trái (Giao diện Form thêm mới) chiếm 1 khoảng */}
                    <div className="lg:col-span-1">
                        {/* Khi Form báo đã thêm xong, Page tự động chạy lại hàm gọi API để update màn hình */}
                        <CountryForm 
                            onCountryAdded={fetchCountries} 
                            editingCountry={editingCountry} 
                            setEditingCountry={setEditingCountry} 
                        />
                    </div>

                    {/* Cột phải (Giao diện Danh sách hiện có) chiếm 2 khoảng */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="flex justify-center h-48 items-center text-gray-500">Đang tải dữ liệu...</div>
                        ) : (
                            <CountryList 
                                countries={countries} 
                                onEdit={(country) => setEditingCountry(country)}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCountryPage;
