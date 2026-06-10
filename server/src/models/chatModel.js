import { pgPool } from "../config/db.js";

export const fetchSessionByIdRow = async (sessionId) => {
    const { rows } = await pgPool.query(
        "SELECT session_id, user_id FROM chat_sessions WHERE session_id = $1",
        [sessionId]
    );
    return rows[0];
};

export const updateSessionUserIdRow = async (sessionId, userId) => {
    await pgPool.query(
        "UPDATE chat_sessions SET user_id = $1, updated_at = NOW() WHERE session_id = $2",
        [userId, sessionId]
    );
};


export const fetchLatestSessionByUserIdRow = async (userId) => {
    const { rows } = await pgPool.query(
        "SELECT session_id FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
        [userId]
    );
    return rows[0];
};


export const insertSessionRow = async (sessionId, userId) => {
    await pgPool.query(
        "INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
        [sessionId, userId]
    );
};

export const touchSessionRow = async (sessionId) => {
    await pgPool.query(
        "UPDATE chat_sessions SET updated_at = NOW() WHERE session_id = $1",
        [sessionId]
    );
};

export const fetchMessagesBySessionIdRows = async (sessionId) => {
    const { rows } = await pgPool.query(
        "SELECT sender, content, metadata, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC",
        [sessionId]
    );
    return rows;
};

export const insertMessageRow = async (sessionId, sender, content, metadata) => {
    await pgPool.query(
        "INSERT INTO chat_messages (session_id, sender, content, metadata, created_at) VALUES ($1, $2, $3, $4, NOW())",
        [sessionId, sender, content, metadata ? JSON.stringify(metadata) : null]
    );
};

export const deleteMessagesBySessionIdRow = async (sessionId) => {
    await pgPool.query(
        "DELETE FROM chat_messages WHERE session_id = $1",
        [sessionId]
    );
};

export const fetchToursByFiltersRows = async (queryStr, params) => {
    const { rows } = await pgPool.query(queryStr, params);
    return rows;
};

export const fetchAllToursForSemanticRow = async () => {
    const { rows } = await pgPool.query(
        "SELECT tour_id, title, destination, duration, price_adult, highlights, embedding FROM tours WHERE availability = true AND embedding IS NOT NULL"
    );
    return rows;
};

export const fetchUserByIdRow = async (userId) => {
    const { rows } = await pgPool.query(
        "SELECT username, email, phone_number FROM users WHERE user_id = $1",
        [userId]
    );
    return rows[0];
};

export const fetchUserBookingsForChatRows = async (userId) => {
    const { rows } = await pgPool.query(
        `SELECT b.booking_id, b.tour_id, t.title as tour_title, b.start_date, 
                (b.num_adults + b.num_children) as quantity, 
                b.total_price, b.booking_status as status, b.payment_method, b.payment_status
         FROM bookings b
         JOIN tours t ON b.tour_id = t.tour_id
         WHERE b.user_id = $1
         ORDER BY b.booking_date DESC`,
        [userId]
    );
    return rows;
};

export const fetchTourByIdForChatRow = async (tourId) => {
    const { rows } = await pgPool.query(
        "SELECT title, price_adult, price_child FROM tours WHERE tour_id = $1 AND availability = true",
        [tourId]
    );
    return rows[0];
};

export const fetchTourDepartureForChatRow = async (tourId, startDate) => {
    const { rows } = await pgPool.query(
        `SELECT departure_id, start_date, stock 
         FROM tour_departures 
         WHERE tour_id = $1 AND start_date = $2 AND status = 'AVAILABLE'`,
        [tourId, startDate]
    );
    return rows[0];
};

export const fetchOtherTourDeparturesForChatRows = async (tourId) => {
    const { rows } = await pgPool.query(
        `SELECT start_date, stock 
         FROM tour_departures 
         WHERE tour_id = $1 AND start_date >= NOW()::date AND status = 'AVAILABLE' 
         ORDER BY start_date ASC LIMIT 5`,
        [tourId]
    );
    return rows;
};

export const fetchBookingDetailForChatRow = async (bookingId) => {
    const { rows } = await pgPool.query(
        `SELECT b.booking_id, b.total_price, b.start_date, b.payment_method, b.payment_status,
                t.title as tour_title, u.username as user_fullname, u.email as user_email
         FROM bookings b
         JOIN tours t ON b.tour_id = t.tour_id
         JOIN users u ON b.user_id = u.user_id
         WHERE b.booking_id = $1`,
        [bookingId]
    );
    return rows[0];
};

export const fetchTourByIdSimpleRow = async (tourId) => {
    const { rows } = await pgPool.query(
        "SELECT tour_id, title FROM tours WHERE tour_id = $1 AND availability = true",
        [tourId]
    );
    return rows[0];
};

export const fetchMetadataToursRows = async (tourIds) => {
    const { rows } = await pgPool.query(
        `SELECT t.tour_id, t.title, t.destination, t.duration, t.price_adult, t.price_child, t.old_price,
                (SELECT i.image_url FROM images i WHERE i.tour_id = t.tour_id ORDER BY i.upload_date ASC LIMIT 1) AS image_url
         FROM tours t
         WHERE t.tour_id = ANY($1::int[]) AND t.availability = true`,
        [tourIds]
    );
    return rows;
};
