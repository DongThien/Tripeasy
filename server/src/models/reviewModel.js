import { pgPool } from "../config/db.js";

export const fetchReviewsByTourIdRow = async (tourId) => {
    const query = `
        SELECT r.*, u.username 
        FROM reviews r 
        JOIN users u ON r.user_id = u.user_id 
        WHERE r.tour_id = $1 
        ORDER BY r.timestamp DESC
    `;
    const { rows } = await pgPool.query(query, [tourId]);
    return rows;
};