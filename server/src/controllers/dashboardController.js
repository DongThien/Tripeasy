import {
    getRevenueChartData,
    getDashboardStatsData,
    getTopToursData,
    getRecentBookingsData
} from "../services/dashboardService.js";

// Revenue Chart - Tổng doanh thu theo khoảng ngày
export const getRevenueChart = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let start = startDate;
        let end = endDate;
        if (!end) {
            end = new Date().toISOString().split('T')[0];
        }
        if (!start) {
            const startDateObj = new Date();
            startDateObj.setDate(startDateObj.getDate() - 30);
            start = startDateObj.toISOString().split('T')[0];
        }
        const data = await getRevenueChartData(start, end);
        res.json({ success: true, data, message: "Fetched revenue chart data" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const data = await getDashboardStatsData();
        res.json({
            success: true,
            data,
            message: "Fetched dashboard stats"
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// Top Selling Tours
export const getTopTours = async (req, res) => {
    try {
        const data = await getTopToursData();
        res.json({ success: true, data, message: "Fetched top selling tours" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

// Recent Bookings
export const getRecentBookings = async (req, res) => {
    try {
        const data = await getRecentBookingsData();
        res.json({ success: true, data, message: "Fetched recent bookings" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};
