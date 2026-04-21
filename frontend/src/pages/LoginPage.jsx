import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Gọi API Đăng nhập
            const response = await axios.post('http://localhost:5000/api/users/login', formData);

            // Thành công -> Lưu Token và User vào LocalStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Quay về trang chủ và ép reload để Navbar cập nhật (cách đơn giản nhất)
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-auth-container bg-[url('/auth-bg.jpg')]">
            <div className="auth-bg-overlay"></div>

            <div className="auth-header-wrapper">
                <h2 className="auth-header-title">
                    Chào mừng trở lại!
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
                            {loading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
                        </button>
                    </form>

                    <div className="auth-footer-text">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="auth-footer-link">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;