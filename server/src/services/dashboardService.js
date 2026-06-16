import {
    fetchRevenueChartRows,
    fetchTotalRevenueRow,
    fetchTotalToursRow,
    fetchTotalUsersRow,
    fetchNewBookingsRow,
    fetchTopToursRows,
    fetchRecentBookingsRows,
    fetchGlobalSearchResults,
    fetchNotificationsData
} from "../models/dashboardModel.js";

export const getRevenueChartData = async (startDate, endDate) => {
    // Hàm parse chuỗi YYYY-MM-DD thành Date local tránh lệch múi giờ
    const parseLocalDate = (dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
        return new Date(dateStr);
    };

    const formatDateKey = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Tính cả ngày kết thúc
    
    const rows = await fetchRevenueChartRows(startDate, endDate);

    // Map kết quả DB dạng YYYY-MM-DD -> total
    const dbMap = {};
    rows.forEach(r => {
        const key = formatDateKey(new Date(r.sort_date));
        dbMap[key] = Number(r.total);
    });

    // Tạo mảng tất cả các ngày đầy đủ trong khoảng lọc
    const dailyData = [];
    let curr = new Date(start);
    while (curr <= end) {
        const key = formatDateKey(curr);
        dailyData.push({
            dateObj: new Date(curr),
            total: dbMap[key] || 0
        });
        curr.setDate(curr.getDate() + 1);
    }

    if (diffDays <= 15) {
        // Khoảng ngắn <= 15 ngày: hiển thị từng ngày (DD/MM)
        return dailyData.map(d => {
            const day = String(d.dateObj.getDate()).padStart(2, '0');
            const month = String(d.dateObj.getMonth() + 1).padStart(2, '0');
            return {
                name: `${day}/${month}`,
                total: d.total
            };
        });
    } else if (diffDays <= 31) {
        // Khoảng 1 tháng: gom nhóm 3 ngày 1 lần
        const result = [];
        for (let i = 0; i < dailyData.length; i += 3) {
            const chunk = dailyData.slice(i, i + 3);
            const total = chunk.reduce((sum, item) => sum + item.total, 0);
            const firstDate = chunk[0].dateObj;
            const day = String(firstDate.getDate()).padStart(2, '0');
            const month = String(firstDate.getMonth() + 1).padStart(2, '0');
            result.push({
                name: `${day}/${month}`,
                total
            });
        }
        return result;
    } else if (diffDays <= 90) {
        // Khoảng 3 tháng: gom nhóm 7 ngày 1 lần (Weekly)
        const result = [];
        for (let i = 0; i < dailyData.length; i += 7) {
            const chunk = dailyData.slice(i, i + 7);
            const total = chunk.reduce((sum, item) => sum + item.total, 0);
            const firstDate = chunk[0].dateObj;
            const day = String(firstDate.getDate()).padStart(2, '0');
            const month = String(firstDate.getMonth() + 1).padStart(2, '0');
            result.push({
                name: `${day}/${month}`,
                total
            });
        }
        return result;
    } else if (diffDays <= 180) {
        // Khoảng 6 tháng: gom nhóm 15 ngày 1 lần
        const result = [];
        for (let i = 0; i < dailyData.length; i += 15) {
            const chunk = dailyData.slice(i, i + 15);
            const total = chunk.reduce((sum, item) => sum + item.total, 0);
            const firstDate = chunk[0].dateObj;
            const day = String(firstDate.getDate()).padStart(2, '0');
            const month = String(firstDate.getMonth() + 1).padStart(2, '0');
            result.push({
                name: `${day}/${month}`,
                total
            });
        }
        return result;
    } else {
        // Khoảng dài hơn 6 tháng: gom nhóm theo lịch tháng (Tháng MM/YYYY)
        const monthlyGroups = {};
        dailyData.forEach(d => {
            const m = d.dateObj.getMonth() + 1;
            const y = d.dateObj.getFullYear();
            const key = `Tháng ${m}/${y}`;
            if (!monthlyGroups[key]) {
                monthlyGroups[key] = {
                    total: 0,
                    sortKey: y * 100 + m
                };
            }
            monthlyGroups[key].total += d.total;
        });

        return Object.keys(monthlyGroups)
            .map(key => ({
                name: key,
                total: monthlyGroups[key].total,
                sortKey: monthlyGroups[key].sortKey
            }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(item => ({
                name: item.name,
                total: item.total
            }));
    }
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

export const getGlobalSearchData = async (q) => {
    return fetchGlobalSearchResults(q);
};

export const getNotificationsData = async () => {
    return fetchNotificationsData();
};
