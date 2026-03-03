import axiosClient from "./axiosClient";

export const getOverviewStats = async () => {
    const res = await axiosClient.get("/dashboard/stats");
    return res.data.data;
};

export const getTopTours = async () => {
    const res = await axiosClient.get("/dashboard/top-tours");
    return res.data.data;
};

export const getRecentBookings = async () => {
    const res = await axiosClient.get("/dashboard/recent-bookings");
    return res.data.data;
};

const dashboardService = {
    getOverviewStats,
    getTopTours,
    getRecentBookings,
};

export default dashboardService;
