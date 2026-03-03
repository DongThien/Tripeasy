import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api", // Sửa lại nếu backend chạy port khác
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosClient;
