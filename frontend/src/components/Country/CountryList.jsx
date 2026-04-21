import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react'; // Thêm icon Sửa và Xóa

const CountryList = ({ countries, onEdit, onDelete }) => {
    return (
        <div className="country-grid-layout">
            {countries.map((country) => (
                <div key={country.id} className="country-card">
                    {/* Bọc Link cho phần hình ảnh và thông tin để người dùng click xem chi tiết */}
                    <Link to={`/destination/${country.slug}`} className="flex-grow">
                        {/* Hiển thị Hình ảnh quốc gia */}
                        <div className="country-card-image-wrapper">
                            {country.thumbnail ? (
                                <img 
                                    src={country.thumbnail.startsWith('/uploads') 
                                        ? `http://localhost:5000${country.thumbnail}` 
                                        : country.thumbnail} 
                                    alt={country.name} 
                                    className="country-card-image"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400">
                                    Không có ảnh
                                </div>
                            )}
                        </div>
                        
                        {/* Thông tin Quốc gia */}
                        <div className="country-card-body">
                            <h3 className="country-card-title">
                                <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                                {country.name}
                            </h3>
                            <p className="country-card-slug">/{country.slug}</p>
                            <p className="country-card-desc">
                                {country.description || "Chưa có mô tả."}
                            </p>
                        </div>
                    </Link>

                    {/* Vùng các nút Action cho Admin */}
                    {onEdit && onDelete && (
                        <div className="country-card-footer">
                            <button 
                                onClick={() => onEdit(country)}
                                className="btn-card-edit"
                            >
                                <Pencil className="w-4 h-4 mr-1" /> Sửa
                            </button>
                            <button 
                                onClick={() => onDelete(country)}
                                className="btn-card-delete"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Xóa
                            </button>
                        </div>
                    )}
                </div>
            ))}
            
            {countries.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    Chưa có dữ liệu quốc gia nào. Hãy tạo mới ngay!
                </div>
            )}
        </div>
    );
};

export default CountryList;
