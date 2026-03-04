// Revenue Chart - Tổng doanh thu 6 tháng gần nhất
export const getRevenueChart = async (req, res) => {
    try {
        // Lấy tổng doanh thu theo từng tháng trong 6 tháng gần nhất
        const query = `
            SELECT 
                TO_CHAR(DATE_TRUNC('month', booking_date), 'MM/YYYY') AS month,
                EXTRACT(MONTH FROM booking_date) AS month_num,
                EXTRACT(YEAR FROM booking_date) AS year_num,
                SUM(total_price) AS total
            FROM bookings
            WHERE payment_status = 'COMPLETED'
                AND booking_date >= (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months')
            GROUP BY month, month_num, year_num
            ORDER BY year_num ASC, month_num ASC
        `;
        const { rows } = await pgPool.query(query);
        // Map ra format [{ name: 'Tháng 1', total: ... }, ...]
        const data = rows.map(r => ({
            name: `Tháng ${parseInt(r.month_num)}`,
            total: Number(r.total)
        }));
        res.json({ success: true, data, message: "Fetched revenue chart data" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};
import { pgPool } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
    try {
        // Tổng doanh thu (chỉ tính booking đã thanh toán)
        const revenueRes = await pgPool.query("SELECT COALESCE(SUM(total_price),0) AS total_revenue FROM bookings WHERE payment_status = 'COMPLETED'");
        // Tổng số tour
        const tourRes = await pgPool.query("SELECT COUNT(*) AS total_tours FROM tours");
        // Tổng số user
        const userRes = await pgPool.query("SELECT COUNT(*) AS total_users FROM users");
        // Số booking mới (trong 7 ngày gần nhất)
        const newBookingsRes = await pgPool.query("SELECT COUNT(*) AS new_bookings FROM bookings WHERE booking_date >= NOW() - INTERVAL '7 days'");
        res.json({
            success: true,
            data: {
                totalRevenue: Number(revenueRes.rows[0].total_revenue),
                totalTours: Number(tourRes.rows[0].total_tours),
                totalUsers: Number(userRes.rows[0].total_users),
                newBookings: Number(newBookingsRes.rows[0].new_bookings)
            },
            message: "Fetched dashboard stats"
        });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// Top Selling Tours
export const getTopTours = async (req, res) => {
    try {
        const query = `
            SELECT t.tour_id AS id, t.title AS name, t.destination AS subtitle,
                   COALESCE(i.image_url, '') AS img,
                   COUNT(b.booking_id) AS sold
            FROM tours t
            LEFT JOIN bookings b ON t.tour_id = b.tour_id AND b.payment_status = 'COMPLETED'
            LEFT JOIN images i ON t.tour_id = i.tour_id
            GROUP BY t.tour_id, t.title, t.destination, i.image_url
            ORDER BY sold DESC
            LIMIT 5
        `;
        const { rows } = await pgPool.query(query);
        res.json({ success: true, data: rows, message: "Fetched top selling tours" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// Recent Bookings
export const getRecentBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.booking_id AS id, b.total_price AS amount, b.payment_status, b.booking_status, b.booking_date AS date,
                   u.username AS customer_name, u.email,
                   t.title AS tour_name, t.destination
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN tours t ON b.tour_id = t.tour_id
            ORDER BY b.booking_date DESC
            LIMIT 8
        `;
        const { rows } = await pgPool.query(query);
        // Định dạng lại dữ liệu cho frontend
        const bookings = rows.map(b => ({
            id: b.id,
            amount: b.amount,
            status: b.payment_status,
            date: b.date,
            customer: {
                name: b.customer_name,
                avatar: "https://randomuser.me/api/portraits/men/41.jpg" // Nếu có cột avatar thì lấy, còn không thì dùng mặc định
            },
            tour: b.tour_name
        }));
        res.json({ success: true, data: bookings, message: "Fetched recent bookings" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};
