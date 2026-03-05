import axios from "axios";

const axiosClient = axios.create({
    baseURL: "/api", // Use relative URL to go through Vite proxy
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosClient;
