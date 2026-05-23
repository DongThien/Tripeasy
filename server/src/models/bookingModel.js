import { pgPool } from "../config/db.js";

export const fetchTourPriceRow = async (tourId) => {
    const { rows } = await pgPool.query(
        "SELECT price_adult, price_child FROM tours WHERE tour_id = $1",
        [tourId]
    );
    return rows[0];
};

export const fetchDepartureByIdRow = async (departureId) => {
    const { rows } = await pgPool.query(
        "SELECT * FROM tour_departures WHERE departure_id = $1",
        [departureId]
    );
    return rows[0];
};

export const updateDepartureStockRow = async (tourId, startDate, quantity) => {
    const { rows } = await pgPool.query(
        "UPDATE tour_departures SET stock = stock + $1 WHERE tour_id = $2 AND start_date = $3 RETURNING *",
        [quantity, tourId, startDate]
    );
    return rows[0];
};

export const insertBookingRow = async ({
    tourId,
    userId,
    promotionId,
    numAdults,
    numChildren,
    totalPrice,
    specialRequests,
    startDate,
    paymentMethod
}) => {
    const insertQuery = `
        INSERT INTO bookings (tour_id, user_id, promotion_id, num_adults, num_children, total_price, payment_status, booking_status, special_requests, start_date, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', 'PENDING', $7, $8, $9)
        RETURNING *
    `;
    const { rows } = await pgPool.query(insertQuery, [
        tourId,
        userId,
        promotionId,
        numAdults,
        numChildren,
        totalPrice,
        specialRequests,
        startDate,
        paymentMethod
    ]);
    return rows[0];
};

export const fetchUserBookingsRows = async (userId) => {
    const query = `
        SELECT b.*, t.title, t.destination, t.price_adult, t.price_child, i.image_url AS image
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        LEFT JOIN (
            SELECT DISTINCT ON (tour_id) tour_id, image_url 
            FROM images
        ) i ON t.tour_id = i.tour_id
        WHERE b.user_id = $1
        ORDER BY b.booking_date DESC
    `;
    const { rows } = await pgPool.query(query, [userId]);
    return rows;
};

export const fetchAllBookingsRows = async ({ search, bookingStatus, paymentStatus }) => {
    const params = [];
    let query = `
        SELECT b.*, t.title, u.username AS user_name, u.phone_number, u.email
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users u ON b.user_id = u.user_id
        WHERE 1=1
    `;

    if (search) {
        params.push(`%${search}%`);
        const pn = params.length;
        query += ` AND (u.username ILIKE $${pn} OR t.title ILIKE $${pn} OR u.phone_number ILIKE $${pn})`;
    }
    if (bookingStatus) {
        params.push(bookingStatus);
        query += ` AND b.booking_status = $${params.length}`;
    }
    if (paymentStatus) {
        params.push(paymentStatus);
        query += ` AND b.payment_status = $${params.length}`;
    }
    query += " ORDER BY b.booking_date DESC";

    const { rows } = await pgPool.query(query, params);
    return rows;
};

export const fetchBookingStatsRow = async () => {
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
        FROM bookings
    `);
    return rows[0];
};

export const fetchBookingByIdRow = async (bookingId) => {
    const { rows } = await pgPool.query(
        `
        SELECT b.*, t.title, t.destination, u.username AS user_name, u.phone_number, u.email
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users u ON b.user_id = u.user_id
        WHERE b.booking_id = $1
        `,
        [bookingId]
    );
    return rows[0];
};

export const updateBookingStatusRow = async (bookingId, paymentStatus, bookingStatus) => {
    const updateQuery = `
        UPDATE bookings
        SET payment_status = $1, booking_status = $2
        WHERE booking_id = $3
        RETURNING *
    `;
    const { rows } = await pgPool.query(updateQuery, [paymentStatus, bookingStatus, bookingId]);
    return rows[0];
};
