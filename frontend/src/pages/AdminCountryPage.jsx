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
        <div className="page-admin-container bg-gray-50 min-h-screen p-4 md:p-8">
            {/* Khởi tạo Toaster ở root của trang */}
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-7xl mx-auto">
                <header className="admin-header mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Globe2 className="w-7 h-7 mr-3 text-blue-600" />
                            Quản lý Dữ liệu Tour
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">Thêm, sửa, xóa và quản lý các điểm đến trong hệ thống.</p>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            placeholder="Tìm kiếm điểm đến..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="admin-grid-layout grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Form (dùng sticky để cuộn không bị mất form) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5 border-b pb-3">
                                {editingCountry ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
                            </h2>
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
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                            {isLoading ? (
                                // Loading State
                                <div className="flex flex-col justify-center h-full items-center text-gray-500 space-y-4 py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    <p className="font-medium">Đang tải dữ liệu...</p>
                                </div>
                            ) : filteredCountries.length === 0 ? (
                                // Empty State
                                <div className="flex flex-col justify-center h-full items-center text-gray-400 py-20">
                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                        <Globe2 className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-600">Không tìm thấy dữ liệu</p>
                                    <p className="text-sm mt-1 text-gray-400">
                                        {searchTerm ? 'Thử tìm với từ khóa khác xem sao.' : 'Hệ thống hiện chưa có điểm đến nào.'}
                                    </p>
                                </div>
                            ) : (
                                // Data State
                                <CountryList
                                    countries={filteredCountries}
                                    onEdit={(country) => {
                                        setEditingCountry(country);
                                        // Tự động scroll mượt lên đầu trang để admin thấy form edit
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    onDelete={handleDeleteClick} // Truyền hàm mở Modal
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xác nhận Xóa (Custom UI) */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa dữ liệu</h3>
                            <p className="text-base text-gray-500 mb-6">
                                Bạn có chắc chắn muốn xóa <strong className="text-gray-800">{countryToDelete?.name}</strong>?
                                Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    Xóa ngay
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