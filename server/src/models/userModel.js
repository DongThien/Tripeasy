import { pgPool } from "../config/db.js";

const TIER_CASE_SQL = `
    CASE
        WHEN COALESCE(SUM(b.total_price), 0) >= 50000000 THEN 'Kim Cương'
        WHEN COALESCE(SUM(b.total_price), 0) >= 20000000 THEN 'Vàng'
        WHEN COALESCE(SUM(b.total_price), 0) >= 5000000  THEN 'Bạc'
        ELSE 'Đồng'
    END`;

export const fetchUserByEmailRow = async (email) => {
    const { rows } = await pgPool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
};

export const insertUserRow = async ({
    username,
    email,
    passwordHash,
    phone_number,
    address,
    ip_address
}) => {
    const insertQuery = `
        INSERT INTO users (username, email, password, phone_number, address, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id, username, email, phone_number, address, ip_address
    `;
    const { rows } = await pgPool.query(insertQuery, [
        username,
        email,
        passwordHash,
        phone_number,
        address,
        ip_address
    ]);
    return rows[0];
};

export const fetchUserProfileRow = async (userId) => {
    const { rows } = await pgPool.query(
        "SELECT user_id, username, email, phone_number, address, ip_address, is_active, status, created_at FROM users WHERE user_id = $1",
        [userId]
    );
    return rows[0];
};

export const fetchAllUsersRows = async (searchParam, statusParam) => {
    const query = `
        SELECT
            u.user_id, u.username, u.email, u.phone_number,
            u.is_active, u.status, u.created_at,
            COALESCE(SUM(b.total_price), 0) AS total_spent_raw,
            ${TIER_CASE_SQL} AS tier
        FROM users u
        LEFT JOIN bookings b ON u.user_id = b.user_id
        WHERE (
            $1::text IS NULL
            OR (u.username ILIKE $1 OR u.email ILIKE $1 OR u.phone_number ILIKE $1)
        )
        AND (
            $2::text IS NULL
            OR ($2 = 'active' AND u.is_active = TRUE)
            OR ($2 = 'locked' AND u.is_active = FALSE)
        )
        GROUP BY u.user_id
        ORDER BY u.created_at DESC
    `;

    const { rows } = await pgPool.query(query, [searchParam, statusParam]);
    return rows;
};

export const fetchUserOverallStatsRow = async () => {
    const { rows } = await pgPool.query(`
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
            ) AS new_this_month
        FROM users
    `);
    return rows[0];
};

export const fetchUserReturnRateRow = async () => {
    const { rows } = await pgPool.query(`
        SELECT ROUND(
            100.0 * COUNT(*) FILTER (WHERE booking_count > 1)
            / NULLIF(COUNT(*), 0), 1
        ) AS return_rate
        FROM (
            SELECT user_id, COUNT(*) AS booking_count
            FROM bookings
            GROUP BY user_id
        ) sub
    `);
    return rows[0];
};

export const updateUserRow = async (userId, username, phone_number, address) => {
    const { rows } = await pgPool.query(
        `UPDATE users SET username = $1, phone_number = $2, address = $3
         WHERE user_id = $4
         RETURNING user_id, username, email, phone_number, address, is_active, status`,
        [username, phone_number, address, userId]
    );
    return rows[0];
};

export const toggleUserLockRow = async (userId) => {
    const { rows } = await pgPool.query(
        `UPDATE users
         SET is_active = NOT is_active,
             status = CASE WHEN is_active THEN 'LOCKED' ELSE 'ACTIVE' END
         WHERE user_id = $1
         RETURNING user_id, username, email, is_active, status`,
        [userId]
    );
    return rows[0];
};
