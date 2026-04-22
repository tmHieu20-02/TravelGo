import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UploadCloud, Plus, Save, X, Pencil } from 'lucide-react';

const CountryForm = ({ onCountryAdded, editingCountry, setEditingCountry }) => {
    // 1. Khai báo các biến trạng thái (State) cho Form
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    // Lưu ý: với File upload ta dùng state lưu biến file dạng Object thay vì string 
    const [thumbnailFile, setThumbnailFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setThumbnailFile(null);
        setErrorMsg('');
        const fileInput = document.getElementById('thumbnail-upload');
        if (fileInput) fileInput.value = '';
    };

    // Theo dõi sự thay đổi của editingCountry để điền form
    useEffect(() => {
        if (editingCountry) {
            setName(editingCountry.name);
            setSlug(editingCountry.slug);
            setDescription(editingCountry.description || '');
            setThumbnailFile(null); // Đặt lại null file vì đang dùng ảnh cũ, trừ khi họ chọn mới
        } else {
            // Reset form khi thoát chế độ edit
            resetForm();
        }
    }, [editingCountry]);


    // Hàm nhận diện khi người dùng chọn File
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    // Hàm xử lý khi bấm nút "Thêm"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn việc trang HTML tự động F5
        setIsLoading(true);
        setErrorMsg('');

        try {
            // 2. Vì có File Ảnh, ta BẮT BUỘC dùng đối tượng FormData thay cho chuỗi JSON thông thường
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            
            if (thumbnailFile) {
                // Key 'thumbnail' này CHÍNH XÁC là tên biến ta set trong BE: upload.single('thumbnail')
                formData.append('thumbnail', thumbnailFile); 
            }

            let response;
            if (editingCountry) {
                // ĐANG Ở CHẾ ĐỘ SỬA
                response = await api.put('/countries/' + editingCountry.id, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // CHẾ ĐỘ THÊM MỚI
                response = await api.post('/countries', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data) {
                onCountryAdded(); 
                if (editingCountry) {
                    setEditingCountry(null); // Thoát khỏi chế độ Edit
                } else {
                    resetForm();
                }
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra khi gọi API!');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {errorMsg && <div className="p-4 mb-6 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="form-group">
                        <label className="form-label">Tên Quốc Gia <span className="text-red-500">*</span></label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Ví dụ: Việt Nam" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Slug <span className="text-red-500">*</span></label>
                        <input type="text" required value={slug} onChange={e => setSlug(e.target.value)} className="form-input" placeholder="viet-nam" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} className="form-input" placeholder="Nhập một vài dòng giới thiệu chuyên nghiệp..." />
                </div>

                {/* Phần Upload Hình ảnh */}
                <div className="form-group">
                    <label className="form-label">Hình ảnh đại diện</label>
                    <div className="relative group">
                        <label htmlFor="thumbnail-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all overflow-hidden relative">
                            {editingCountry && editingCountry.thumbnail && !thumbnailFile && (
                                <img 
                                    src={editingCountry.thumbnail.startsWith('/uploads') ? `http://localhost:5000${editingCountry.thumbnail}` : editingCountry.thumbnail}
                                    className="absolute inset-0 w-full h-full object-cover opacity-20" 
                                    alt="Current thumbnail"
                                />
                            )}
                            <div className="flex flex-col items-center justify-center py-6 relative z-10">
                                <UploadCloud className="w-10 h-10 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <p className="text-sm font-bold text-slate-600">
                                    {thumbnailFile ? thumbnailFile.name : (editingCountry && editingCountry.thumbnail ? 'Thay đổi ảnh' : 'Tải ảnh lên')}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Khuyên dùng: 1200x800px</p>
                            </div>
                            <input id="thumbnail-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={isLoading} className="btn-primary w-full">
                        {isLoading ? 'Đang xử lý...' : (editingCountry ? 'Lưu thay đổi' : 'Tạo mới điểm đến')}
                    </button>
                    {editingCountry && (
                        <button type="button" onClick={() => setEditingCountry(null)} disabled={isLoading} className="btn-secondary w-full">
                            Hủy chỉnh sửa
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CountryForm;
