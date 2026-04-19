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
        <div className="admin-form-card">
            <h2 className={`text-xl font-bold mb-4 flex items-center ${editingCountry ? 'text-amber-600' : 'text-gray-800'}`}>
                {editingCountry ? (
                    <><Pencil className="w-5 h-5 mr-2" /> Cập Nhật Quốc Gia</>
                ) : (
                    <><Plus className="w-5 h-5 mr-2 text-indigo-500" /> Thêm Quốc Gia Mới</>
                )}
            </h2>
            
            {errorMsg && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Tên Quốc Gia <span className="text-red-500">*</span></label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input-field" placeholder="Ví dụ: Việt Nam" />
                    </div>
                    <div>
                        <label className="form-label">Slug <span className="text-red-500">*</span></label>
                        <input type="text" required value={slug} onChange={e => setSlug(e.target.value)} className="form-input-field" placeholder="viet-nam" />
                    </div>
                </div>

                <div>
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} className="form-input-field" placeholder="Nhập một vài dòng giới thiệu..." />
                </div>

                {/* Phần Upload Hình ảnh */}
                <div>
                    <label className="form-label">Hình thu nhỏ (Upload Ảnh)</label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="thumbnail-upload" className="upload-image-dropzone">
                            {/* Hiển thị ảnh cũ nếu đang edit mà chưa chọn file mới */}
                            {editingCountry && editingCountry.thumbnail && !thumbnailFile && (
                                <img 
                                    src={editingCountry.thumbnail.startsWith('/uploads') ? `http://localhost:5000${editingCountry.thumbnail}` : editingCountry.thumbnail}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30" 
                                />
                            )}
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500 text-center"><span className="font-semibold">{thumbnailFile ? thumbnailFile.name : (editingCountry && editingCountry.thumbnail ? 'Chọn ảnh mới để thay thế' : 'Bấm để tải ảnh lên')}</span></p>
                                <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                            </div>
                            <input id="thumbnail-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-2 gap-3">
                    {editingCountry && (
                        <button type="button" onClick={() => setEditingCountry(null)} disabled={isLoading} className="btn-modal-cancel">
                            Hủy Cập Nhật
                        </button>
                    )}
                    <button type="submit" disabled={isLoading} className={`${editingCountry ? 'btn-submit-warning' : 'btn-submit-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Đang lưu...' : (editingCountry ? 'Lưu Cập Nhật' : 'Lưu Quốc Gia')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CountryForm;
