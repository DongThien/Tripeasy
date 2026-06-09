import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api",
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
export default axiosClient;