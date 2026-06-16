import { pgPool } from "../config/db.js";

export const fetchRevenueChartRows = async (startDate, endDate) => {
    const query = `
        SELECT 
            TO_CHAR(booking_date, 'DD/MM') AS name,
            booking_date::date AS sort_date,
            SUM(total_price) AS total
        FROM bookings
        WHERE payment_status IN ('PAID', 'COMPLETED')
            AND booking_date::date >= $1::date
            AND booking_date::date <= $2::date
        GROUP BY name, sort_date
        ORDER BY sort_date ASC
    `;
    const { rows } = await pgPool.query(query, [startDate, endDate]);
    return rows;
};

export const fetchTotalRevenueRow = async () => {
    const { rows } = await pgPool.query(
        "SELECT COALESCE(SUM(total_price),0) AS total_revenue FROM bookings WHERE payment_status IN ('PAID', 'COMPLETED')"
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
        LEFT JOIN bookings b ON t.tour_id = b.tour_id AND b.payment_status IN ('PAID', 'COMPLETED')
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

export const fetchGlobalSearchResults = async (q) => {
    const term = `%${q}%`;
    
    // Search Tours
    const toursQuery = `
        SELECT tour_id AS id, title AS name, destination AS detail 
        FROM tours 
        WHERE title ILIKE $1 OR destination ILIKE $1 
        LIMIT 5
    `;
    const toursRes = await pgPool.query(toursQuery, [term]);

    // Search Bookings (by booking_id or username or tour title)
    const bookingsQuery = `
        SELECT b.booking_id AS id, t.title AS name, u.username AS detail 
        FROM bookings b 
        JOIN tours t ON b.tour_id = t.tour_id 
        JOIN users u ON b.user_id = u.user_id 
        WHERE b.booking_id::text ILIKE $1 OR u.username ILIKE $1 OR t.title ILIKE $1
        ORDER BY b.booking_date DESC
        LIMIT 5
    `;
    const bookingsRes = await pgPool.query(bookingsQuery, [term]);

    // Search Customers (role = 'customer')
    const customersQuery = `
        SELECT user_id AS id, username AS name, email AS detail 
        FROM users 
        WHERE role = 'customer' AND (username ILIKE $1 OR email ILIKE $1 OR phone_number ILIKE $1) 
        LIMIT 5
    `;
    const customersRes = await pgPool.query(customersQuery, [term]);

    return {
        tours: toursRes.rows,
        bookings: bookingsRes.rows.map(b => ({
            id: b.id,
            name: `Đặt tour #${b.id}`,
            detail: `${b.detail} - ${b.name}`
        })),
        customers: customersRes.rows
    };
};

export const fetchNotificationsData = async () => {
    // Latest 5 Bookings
    const bookingsQuery = `
        SELECT b.booking_id AS id, t.title AS tour_name, u.username AS customer_name, b.total_price, b.booking_date AS time, b.booking_status
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users u ON b.user_id = u.user_id
        ORDER BY b.booking_date DESC
        LIMIT 5
    `;
    const bookingsRes = await pgPool.query(bookingsQuery);

    // Latest 5 Contacts
    const contactsQuery = `
        SELECT contact_id AS id, full_name, subject, created_at AS time, status
        FROM contacts
        ORDER BY created_at DESC
        LIMIT 5
    `;
    const contactsRes = await pgPool.query(contactsQuery);

    // Map bookings
    const bookingsNoti = bookingsRes.rows.map(b => ({
        type: 'booking',
        id: b.id,
        title: `Đơn đặt tour #${b.id}`,
        desc: `${b.customer_name} đặt tour "${b.tour_name}"`,
        time: b.time,
        status: b.booking_status
    }));

    // Map contacts
    const contactsNoti = contactsRes.rows.map(c => ({
        type: 'contact',
        id: c.id,
        title: `Liên hệ mới từ ${c.full_name}`,
        desc: c.subject || 'Liên hệ mới cần phản hồi',
        time: c.time,
        status: c.status
    }));

    // Merge and sort
    const allNoti = [...bookingsNoti, ...contactsNoti];
    allNoti.sort((a, b) => new Date(b.time) - new Date(a.time));

    return allNoti.slice(0, 8); // return top 8 latest notifications
};
