export const getRevenueChartData = async (startDate, endDate) => {
    const res = await axiosClient.get("/dashboard/revenue-chart", {
        params: { startDate, endDate }
    });
    return res.data.data;
};
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

export const globalSearch = async (q) => {
    const res = await axiosClient.get("/dashboard/search", {
        params: { q }
    });
    return res.data.data;
};

export const getNotifications = async () => {
    const res = await axiosClient.get("/dashboard/notifications");
    return res.data.data;
};

const dashboardService = {
    getOverviewStats,
    getTopTours,
    getRecentBookings,
    getRevenueChartData,
    globalSearch,
    getNotifications
};

export default dashboardService;
