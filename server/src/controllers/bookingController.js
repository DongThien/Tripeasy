import { pgPool } from "../config/db.js";

// ── Field-mapping helpers ───────────────────────────────────────────────────
const BOOKING_STATUS_VI = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    CANCELLED: 'Đã hủy',
};
const PAYMENT_STATUS_VI = {
    PENDING: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
};

const mapBooking = (row) => ({
    booking_id: row.booking_id,
    tour_name: row.title,
    customer_name: row.user_name,
    customer_phone: row.phone_number || '—',
    customer_email: row.email || '—',
    booked_at: row.booking_date,
    num_adults: row.num_adults,
    num_children: row.num_children,
    total_price: parseFloat(row.total_price),
    special_requests: row.special_requests || '',
    // Vietnamese labels for display
    status: BOOKING_STATUS_VI[row.booking_status] ?? row.booking_status,
    payment: PAYMENT_STATUS_VI[row.payment_status] ?? row.payment_status,
    // Raw values for API calls / client-side filtering
    booking_status: row.booking_status,
    payment_status: row.payment_status,
    tour_id: row.tour_id,
    user_id: row.user_id,
});

// POST /api/bookings
export const createBooking = async (req, res) => {
    try {
        const { tour_id, user_id, num_adults, num_children, promotion_id, special_requests } = req.body;
        // Lấy giá tour
        const tourRes = await pgPool.query("SELECT price_adult, price_child FROM tours WHERE tour_id = $1", [tour_id]);
        if (tourRes.rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Tour not found" });
        const price_adult = tourRes.rows[0].price_adult;
        const price_child = tourRes.rows[0].price_child;
        const total_price = price_adult * num_adults + price_child * num_children;

        const insertQuery = `
            INSERT INTO bookings (tour_id, user_id, promotion_id, num_adults, num_children, total_price, payment_status, booking_status, special_requests)
            VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', 'PENDING', $7) RETURNING *`;
        const { rows } = await pgPool.query(insertQuery, [tour_id, user_id, promotion_id, num_adults, num_children, total_price, special_requests]);
        res.status(201).json({ success: true, data: rows[0], message: "Booking created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/user/:user_id
export const getUserBookings = async (req, res) => {
    try {
        const { user_id } = req.params;
        const query = `
            SELECT b.*, t.title, t.destination, t.price_adult, t.price_child, i.image_url AS image
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            LEFT JOIN images i ON t.tour_id = i.tour_id
            WHERE b.user_id = $1
            ORDER BY b.booking_date DESC`;
        const { rows } = await pgPool.query(query, [user_id]);
        res.json({ success: true, data: rows, message: "Fetched user bookings" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings
export const getAllBookings = async (req, res) => {
    try {
        const { search, booking_status, payment_status } = req.query;
        const params = [];
        let query = `
            SELECT b.*, t.title, u.username AS user_name, u.phone_number, u.email
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN users u ON b.user_id = u.user_id
            WHERE 1=1`;

        if (search) {
            params.push(`%${search}%`);
            const pn = params.length;
            query += ` AND (u.username ILIKE $${pn} OR t.title ILIKE $${pn} OR u.phone_number ILIKE $${pn})`;
        }
        if (booking_status && booking_status !== 'all') {
            params.push(booking_status.toUpperCase());
            query += ` AND b.booking_status = $${params.length}`;
        }
        if (payment_status && payment_status !== 'all') {
            params.push(payment_status.toUpperCase());
            query += ` AND b.payment_status = $${params.length}`;
        }
        query += ` ORDER BY b.booking_date DESC`;

        const { rows } = await pgPool.query(query, params);
        res.json({ success: true, data: rows.map(mapBooking), message: "Fetched all bookings" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/stats
export const getBookingStats = async (req, res) => {
    try {
        const { rows } = await pgPool.query(`
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE booking_status = 'PENDING') AS pending,
                COALESCE(
                    SUM(total_price) FILTER (
                        WHERE payment_status = 'PAID'
                        AND DATE_TRUNC('month', booking_date) = DATE_TRUNC('month', NOW())
                    ), 0
                ) AS monthly_revenue
            FROM bookings`);
        const { total, pending, monthly_revenue } = rows[0];
        res.json({
            success: true,
            data: {
                total: parseInt(total),
                pending: parseInt(pending),
                monthly_revenue: parseFloat(monthly_revenue),
            },
            message: "Fetched booking stats",
        });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pgPool.query(`
            SELECT b.*, t.title, t.destination, u.username AS user_name, u.phone_number, u.email
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Booking not found" });
        res.json({ success: true, data: mapBooking(rows[0]), message: "Fetched booking" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, booking_status } = req.body;
        const updateQuery = `UPDATE bookings SET payment_status = $1, booking_status = $2 WHERE booking_id = $3 RETURNING *`;
        const { rows } = await pgPool.query(updateQuery, [payment_status, booking_status, id]);
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "Booking not found" });
        res.json({ success: true, data: rows[0], message: "Booking status updated" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};