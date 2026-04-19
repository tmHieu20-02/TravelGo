import axios from 'axios';

// Khởi tạo một đối tượng axios có tên là `api` với cấu hình cơ bản.
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Trỏ về Backend 
});

// Thêm Interceptor để tự động gắn Token vào mọi request gửi đi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Export api ra để các file Component có thể sử dụng
export default api;
