import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api", // NÊN ĐỂ ĐƯỜNG DẪN ĐẦY ĐỦ ĐỂ TRÁNH LỖI CORS, trừ khi bạn đã cấu hình proxy ở Vite
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// === THÊM ĐOẠN NÀY ĐỂ TỰ ĐỘNG GẮN TOKEN ===
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
// ==========================================

export default axiosClient;