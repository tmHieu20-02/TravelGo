import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/users/register', formData);
            // Đăng ký xong thì chuyển qua trang đăng nhập
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-auth-container bg-[url('/auth-bg.jpg')]">
            <div className="auth-bg-overlay"></div>

            <div className="auth-header-wrapper">
                <h2 className="auth-header-title">
                    Gia nhập cộng đồng!
                </h2>
            </div>

            <div className="auth-header-wrapper mt-8">
                <div className="auth-form-card">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="auth-error-box">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Họ và Tên</label>
                            <div className="auth-input-group">
                                <input
                                    type="text" required
                                    className="auth-input-field"
                                    placeholder="Nguyễn Văn A"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Email</label>
                            <div className="auth-input-group">
                                <input
                                    type="email" required
                                    className="auth-input-field"
                                    placeholder="admin@gmail.com"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                            <div className="auth-input-group">
                                <input
                                    type="password" required
                                    className="auth-input-field"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-auth-submit">
                            {loading ? 'Đang đăng ký...' : 'Đăng Ký Tài Khoản'}
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="auth-footer-link">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;