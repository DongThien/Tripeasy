import { pgPool } from "../config/db.js";

export const fetchRevenueChartRows = async () => {
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
    return rows;
};

export const fetchTotalRevenueRow = async () => {
    const { rows } = await pgPool.query(
        "SELECT COALESCE(SUM(total_price),0) AS total_revenue FROM bookings WHERE payment_status = 'COMPLETED'"
    );
    return rows[0];
};

export const fetchTotalToursRow = async () => {
    const { rows } = await pgPool.query("SELECT COUNT(*) AS total_tours FROM tours");
    return rows[0];
};

export const fetchTotalUsersRow = async () => {
    const { rows } = await pgPool.query("SELECT COUNT(*) AS total_users FROM users");
    return rows[0];
};

export const fetchNewBookingsRow = async () => {
    const { rows } = await pgPool.query(
        "SELECT COUNT(*) AS new_bookings FROM bookings WHERE booking_date >= NOW() - INTERVAL '7 days'"
    );
    return rows[0];
};

export const fetchTopToursRows = async () => {
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
    return rows;
};

export const fetchRecentBookingsRows = async () => {
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
    return rows;
};
