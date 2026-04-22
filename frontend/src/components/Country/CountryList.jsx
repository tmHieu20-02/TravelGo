import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Globe2, MapPin } from 'lucide-react';

const CountryList = ({ countries, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {countries.map((country) => (
                <div key={country.id} className="card-professional flex flex-col group overflow-hidden">
                    <Link to={`/destination/${country.slug}`} className="block relative h-64 overflow-hidden">
                        {country.thumbnail ? (
                            <img 
                                src={country.thumbnail.startsWith('/uploads') 
                                    ? `http://localhost:5000${country.thumbnail}` 
                                    : country.thumbnail} 
                                alt={country.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-slate-100 text-slate-300">
                                ✈️
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span className="text-white font-bold text-sm">Xem chi tiết hành trình →</span>
                        </div>
                    </Link>
                    
                    <div className="p-8 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {country.name}
                            </h3>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {country.slug}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6">
                            {country.description || "Điểm đến này hiện chưa có mô tả chi tiết từ quản trị viên."}
                        </p>
                        <div className="flex items-center text-slate-400 text-xs font-bold gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <span>Khám phá ngay địa điểm tuyệt vời này</span>
                        </div>
                    </div>

                    {(onEdit || onDelete) && (
                        <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
                            {onEdit && (
                                <button 
                                    onClick={() => onEdit(country)}
                                    className="p-2.5 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm bg-white"
                                    title="Chỉnh sửa"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                            )}
                            {onDelete && (
                                <button 
                                    onClick={() => onDelete(country)}
                                    className="p-2.5 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm bg-white"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CountryList;
