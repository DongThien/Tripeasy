import { pgPool } from "../config/db.js";

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
        const query = `
            SELECT b.*, t.title, u.username AS user_name
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN users u ON b.user_id = u.user_id
            ORDER BY b.booking_date DESC`;
        const { rows } = await pgPool.query(query);
        res.json({ success: true, data: rows, message: "Fetched all bookings" });
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