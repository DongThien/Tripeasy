import { pgPool } from "../config/db.js";

// Fetch reviews for a specific tour
export const fetchReviewsByTourIdRow = async (tourId) => {
    const query = `
        SELECT r.*, u.username, 
               EXISTS(
                   SELECT 1 FROM bookings b 
                   WHERE b.user_id = r.user_id AND b.tour_id = r.tour_id AND b.booking_status = 'COMPLETED'
               ) AS is_verified
        FROM reviews r 
        JOIN users u ON r.user_id = u.user_id 
        WHERE r.tour_id = $1 
        ORDER BY r.timestamp DESC
    `;
    const { rows } = await pgPool.query(query, [tourId]);
    return rows;
};

// Check if user has a completed booking for the tour
export const checkUserCompletedBooking = async (userId, tourId) => {
    const query = `
        SELECT COUNT(*) AS count
        FROM bookings
        WHERE user_id = $1 AND tour_id = $2 AND booking_status = 'COMPLETED'
    `;
    const { rows } = await pgPool.query(query, [userId, tourId]);
    return Number(rows[0].count) > 0;
};

// Check if user has already reviewed the tour
export const checkUserHasReviewed = async (userId, tourId) => {
    const query = `
        SELECT COUNT(*) AS count
        FROM reviews
        WHERE user_id = $1 AND tour_id = $2
    `;
    const { rows } = await pgPool.query(query, [userId, tourId]);
    return Number(rows[0].count) > 0;
};

// Create a review
export const createReviewRow = async (tourId, userId, rating, comment) => {
    const query = `
        INSERT INTO reviews (tour_id, user_id, rating, comment, timestamp)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
    `;
    const { rows } = await pgPool.query(query, [tourId, userId, rating, comment]);
    return rows[0];
};

// Update tour statistics
export const updateTourRatingStats = async (tourId) => {
    const query = `
        UPDATE tours 
        SET rating_avg = COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE tour_id = $1), 0),
            review_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = $1)
        WHERE tour_id = $1
    `;
    await pgPool.query(query, [tourId]);
};

// Fetch paginated reviews for admin panel
export const fetchAllReviewsRows = async ({ page = 1, limit = 10, rating, search }) => {
    const offset = (page - 1) * limit;
    let whereClauses = [];
    let params = [];

    if (rating) {
        params.push(rating);
        whereClauses.push(`r.rating = $${params.length}`);
    }

    if (search) {
        params.push(`%${search}%`);
        whereClauses.push(`(u.username ILIKE $${params.length} OR t.title ILIKE $${params.length} OR r.comment ILIKE $${params.length})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    params.push(limit, offset);
    const query = `
        SELECT r.*, u.username, u.email as user_email, t.title as tour_title, t.destination as tour_destination
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN tours t ON r.tour_id = t.tour_id
        ${whereSql}
        ORDER BY r.timestamp DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const { rows } = await pgPool.query(query, params);
    return rows;
};

// Count reviews for pagination
export const countAllReviewsRows = async ({ rating, search }) => {
    let whereClauses = [];
    let params = [];

    if (rating) {
        params.push(rating);
        whereClauses.push(`r.rating = $${params.length}`);
    }

    if (search) {
        params.push(`%${search}%`);
        whereClauses.push(`(u.username ILIKE $${params.length} OR t.title ILIKE $${params.length} OR r.comment ILIKE $${params.length})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const query = `
        SELECT COUNT(*) AS count
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN tours t ON r.tour_id = t.tour_id
        ${whereSql}
    `;
    const { rows } = await pgPool.query(query, params);
    return Number(rows[0].count);
};

// Update admin reply
export const updateAdminReplyRow = async (reviewId, replyText) => {
    const query = `
        UPDATE reviews
        SET admin_reply = $1, replied_at = NOW()
        WHERE review_id = $2
        RETURNING *
    `;
    const { rows } = await pgPool.query(query, [replyText, reviewId]);
    return rows[0];
};

// Delete review
export const deleteReviewRow = async (reviewId) => {
    const query = `
        DELETE FROM reviews
        WHERE review_id = $1
        RETURNING tour_id
    `;
    const { rows } = await pgPool.query(query, [reviewId]);
    return rows[0];
};

// Fetch reviews for a specific user
export const fetchReviewsByUserIdRow = async (userId) => {
    const query = `
        SELECT r.*, t.title as tour_title,
               (SELECT image_url FROM images WHERE tour_id = r.tour_id ORDER BY upload_date ASC LIMIT 1) as tour_image
        FROM reviews r
        JOIN tours t ON r.tour_id = t.tour_id
        WHERE r.user_id = $1
        ORDER BY r.timestamp DESC
    `;
    const { rows } = await pgPool.query(query, [userId]);
    return rows;
};