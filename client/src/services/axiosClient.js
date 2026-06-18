import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://tripeasy-backend-u9xd.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// TỰ ĐỘNG GẮN TOKEN
axiosClient.interceptors.request.use((config) => {
    // Lấy token từ túi ra
    const token = localStorage.getItem('token');
    if (token) {
        // Gắn vào thẻ Authorization trước khi gửi đi
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// TỰ ĐỘNG XỬ LÝ LỖI 401 (HẾT HẠN PHIÊN ĐĂNG NHẬP)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Phát sự kiện để các component khác cập nhật giao diện (ví dụ ClientNavbar)
            window.dispatchEvent(new Event('storage'));

            // Chuyển hướng người dùng về trang đăng nhập kèm trang quay lại nếu không ở trang đăng nhập/đăng ký
            const pathname = window.location.pathname;
            if (pathname !== '/login' && pathname !== '/register') {
                window.location.href = `/login?redirect=${encodeURIComponent(pathname + window.location.search)}`;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;