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

export const fetchUserByEmailOrPhoneRow = async (identifier) => {
    const { rows } = await pgPool.query(
        "SELECT * FROM users WHERE email = $1 OR phone_number = $1",
        [identifier]
    );
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
        RETURNING user_id, username, email, phone_number, address, ip_address, role
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
        "SELECT user_id, username, email, phone_number, address, ip_address, role, is_active, status, created_at FROM users WHERE user_id = $1",
        [userId]
    );
    return rows[0];
};

export const fetchAllUsersRows = async (searchParam, statusParam) => {
    const query = `
        SELECT
            u.user_id, u.username, u.email, u.phone_number,
            u.is_active, u.status, u.created_at, u.role,
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
         RETURNING user_id, username, email, phone_number, address, is_active, status, role`,
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
         RETURNING user_id, username, email, is_active, status, role`,
        [userId]
    );
    return rows[0];
};

// --- CÁC HÀM PHỤC VỤ QUÊN MẬT KHẨU ---
export const savePasswordResetTokenRow = async (email, token, expiryDate) => {
    const { rows } = await pgPool.query(
        `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING user_id, email, username`,
        [token, expiryDate, email]
    );
    return rows[0];
};

export const fetchUserByResetTokenRow = async (token) => {
    const { rows } = await pgPool.query(
        `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()`,
        [token]
    );
    return rows[0];
};

export const updateUserPasswordRow = async (userId, newPasswordHash) => {
    const { rows } = await pgPool.query(
        `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE user_id = $2 RETURNING user_id`,
        [newPasswordHash, userId]
    );
    return rows[0];
};

export const fetchUserPasswordRow = async (userId) => {
    const { rows } = await pgPool.query("SELECT password FROM users WHERE user_id = $1", [userId]);
    return rows[0];
};

export const deleteUserRow = async (userId) => {
    const client = await pgPool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM invoices WHERE booking_id IN (SELECT booking_id FROM bookings WHERE user_id = $1)", [userId]);
        await client.query("DELETE FROM checkouts WHERE booking_id IN (SELECT booking_id FROM bookings WHERE user_id = $1)", [userId]);
        await client.query("DELETE FROM bookings WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM reviews WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM history WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM chat_messages WHERE session_id IN (SELECT session_id FROM chat_sessions WHERE user_id = $1)", [userId]);
        await client.query("DELETE FROM chat_sessions WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM chats WHERE user_id = $1 OR support_id = $1", [userId]);
        const { rows } = await client.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id", [userId]);
        await client.query("COMMIT");
        return rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};