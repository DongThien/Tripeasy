import {
    fetchRevenueChartRows,
    fetchTotalRevenueRow,
    fetchTotalToursRow,
    fetchTotalUsersRow,
    fetchNewBookingsRow,
    fetchTopToursRows,
    fetchRecentBookingsRows
} from "../models/dashboardModel.js";

export const getRevenueChartData = async () => {
    const rows = await fetchRevenueChartRows();
    return rows.map(r => ({
        name: `Tháng ${parseInt(r.month_num)}`,
        total: Number(r.total)
    }));
};

export const getDashboardStatsData = async () => {
    const [revenueRow, toursRow, usersRow, newBookingsRow] = await Promise.all([
        fetchTotalRevenueRow(),
        fetchTotalToursRow(),
        fetchTotalUsersRow(),
        fetchNewBookingsRow()
    ]);

    return {
        totalRevenue: Number(revenueRow.total_revenue),
        totalTours: Number(toursRow.total_tours),
        totalUsers: Number(usersRow.total_users),
        newBookings: Number(newBookingsRow.new_bookings)
    };
};

export const getTopToursData = async () => {
    return fetchTopToursRows();
};

export const getRecentBookingsData = async () => {
    const rows = await fetchRecentBookingsRows();
    return rows.map(b => ({
        id: b.id,
        amount: b.amount,
        status: b.payment_status,
        date: b.date,
        customer: {
            name: b.customer_name,
            avatar: "https://randomuser.me/api/portraits/men/41.jpg"
        },
        tour: b.tour_name
    }));
};
