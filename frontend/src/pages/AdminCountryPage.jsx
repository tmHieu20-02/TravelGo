import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import CountryList from '../components/Country/CountryList';
import CountryForm from '../components/Country/CountryForm';
import { Globe2, Search, AlertTriangle, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminCountryPage = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCountry, setEditingCountry] = useState(null);

    // State mới cho Search và Modal Xác nhận xóa
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState(null);

    // Hàm gọi API lấy danh sách
    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/countries');
            setCountries(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quốc gia", error);
            toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    // 1. Trigger mở Modal thay vì dùng window.confirm
    const handleDeleteClick = (country) => {
        setCountryToDelete(country);
        setIsDeleteModalOpen(true);
    };

    // 2. Logic thực thi xóa sau khi xác nhận
    const executeDelete = async () => {
        if (!countryToDelete) return;

        try {
            await api.delete('/countries/' + countryToDelete.id); // Thay .id thành ._id nếu DB là MongoDB
            toast.success('Đã xóa điểm đến thành công!');
            fetchCountries();

            if (editingCountry && editingCountry.id === countryToDelete.id) {
                setEditingCountry(null);
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra, không thể xóa!');
        } finally {
            setIsDeleteModalOpen(false);
            setCountryToDelete(null);
        }
    };

    // 3. Logic tìm kiếm (Client-side Search) kết hợp useMemo để tối ưu hiệu suất
    const filteredCountries = useMemo(() => {
        return countries.filter(country =>
            country.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [countries, searchTerm]);

    return (
        <div className="page-container">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-7xl mx-auto">
                <header className="admin-header-box">
                    <div>
                        <h1 className="admin-title-h1">Quản lý Điểm đến</h1>
                        <p className="admin-subtitle">Hệ thống quản lý dữ liệu tour du lịch TravelGo chuyên nghiệp.</p>
                    </div>

                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm nhanh điểm đến..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Cột trái: Form */}
                    <div className="lg:col-span-4">
                        <div className="card-professional p-8 sticky top-28">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Globe2 className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-800">
                                    {editingCountry ? 'Sửa thông tin' : 'Thêm mới'}
                                </h2>
                            </div>
                            
                            <CountryForm
                                onCountryAdded={() => {
                                    fetchCountries();
                                    toast.success(editingCountry ? 'Đã cập nhật thông tin!' : 'Đã thêm điểm đến mới!');
                                }}
                                editingCountry={editingCountry}
                                setEditingCountry={setEditingCountry}
                            />
                        </div>
                    </div>

                    {/* Cột phải: Danh sách */}
                    <div className="lg:col-span-8">
                        <div className="card-professional p-1 overflow-hidden min-h-[600px]">
                            {isLoading ? (
                                <div className="state-container py-40">
                                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                                    <p className="font-bold text-slate-500 animate-pulse-subtle">Đang đồng bộ dữ liệu hệ thống...</p>
                                </div>
                            ) : filteredCountries.length === 0 ? (
                                <div className="state-container py-32">
                                    <div className="state-icon-bg">
                                        <Search className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-800">Không tìm thấy kết quả</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto">
                                        {searchTerm ? `Chúng tôi không tìm thấy điểm đến nào khớp với "${searchTerm}".` : 'Hệ thống hiện chưa có dữ liệu điểm đến.'}
                                    </p>
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="text-indigo-600 font-bold hover:underline mt-2"
                                        >
                                            Xóa tìm kiếm
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4">
                                    <CountryList
                                        countries={filteredCountries}
                                        onEdit={(country) => {
                                            setEditingCountry(country);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        onDelete={handleDeleteClick}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xác nhận Xóa chuyên nghiệp */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Xác nhận xóa</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Bạn có chắc chắn muốn gỡ bỏ <strong className="text-slate-900 font-extrabold">"{countryToDelete?.name}"</strong> khỏi hệ thống? 
                                <br/><span className="text-sm text-red-500 font-medium">Hành động này không thể khôi phục.</span>
                            </p>
                            <div className="flex w-full gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="btn-danger flex-1"
                                >
                                    Xác nhận xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCountryPage;