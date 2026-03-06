import { pgPool } from "../config/db.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { username, email, password, phone_number, address, ip_address } = req.body;
        const userCheck = await pgPool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userCheck.rows.length > 0)
            return res.status(400).json({ success: false, data: null, message: "Email already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `INSERT INTO users (username, email, password, phone_number, address, ip_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, username, email, phone_number, address, ip_address`;
        const { rows } = await pgPool.query(insertQuery, [username, email, hashedPassword, phone_number, address, ip_address]);
        res.status(201).json({ success: true, data: rows[0], message: "Register successful" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRes = await pgPool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userRes.rows.length === 0)
            return res.status(401).json({ success: false, data: null, message: "Invalid email or password" });
        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, data: null, message: "Invalid email or password" });
        // Có thể trả về JWT ở đây nếu muốn
        res.json({ success: true, data: { user_id: user.user_id, username: user.username, email: user.email }, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userRes = await pgPool.query("SELECT user_id, username, email, phone_number, address, ip_address, is_active, status, created_at FROM users WHERE user_id = $1", [id]);
        if (userRes.rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "User not found" });
        res.json({ success: true, data: userRes.rows[0], message: "Fetched user profile" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// ── Tier calculation helper ─────────────────────────────────────────────────
const TIER_CASE_SQL = `
    CASE
        WHEN COALESCE(SUM(b.total_price), 0) >= 50000000 THEN 'Kim Cương'
        WHEN COALESCE(SUM(b.total_price), 0) >= 20000000 THEN 'Vàng'
        WHEN COALESCE(SUM(b.total_price), 0) >= 5000000  THEN 'Bạc'
        ELSE 'Đồng'
    END`;

const mapUser = (row) => ({
    id: row.user_id,
    name: row.username,
    email: row.email,
    phone: row.phone_number || '—',
    registeredAt: new Date(row.created_at).toLocaleDateString('vi-VN'),
    totalSpent: Math.floor(parseFloat(row.total_spent_raw || 0)).toLocaleString('en-US') + 'đ',
    tier: row.tier,
    status: row.is_active ? 'active' : 'locked',
    avatar: '',
});

// GET /api/users  —  admin list
export const getAllUsers = async (req, res) => {
    try {
        const { search, status } = req.query;
        const params = [];
        const where = ['1=1'];

        if (search) {
            params.push(`%${search}%`);
            const pn = params.length;
            where.push(`(u.username ILIKE $${pn} OR u.email ILIKE $${pn} OR u.phone_number ILIKE $${pn})`);
        }
        if (status === 'active') {
            where.push('u.is_active = TRUE');
        } else if (status === 'locked') {
            where.push('u.is_active = FALSE');
        }

        const query = `
            SELECT
                u.user_id, u.username, u.email, u.phone_number,
                u.is_active, u.status, u.created_at,
                COALESCE(SUM(b.total_price), 0) AS total_spent_raw,
                ${TIER_CASE_SQL} AS tier
            FROM users u
            LEFT JOIN bookings b ON u.user_id = b.user_id
            WHERE ${where.join(' AND ')}
            GROUP BY u.user_id
            ORDER BY u.created_at DESC`;

        const { rows } = await pgPool.query(query, params);
        res.json({ success: true, data: rows.map(mapUser), message: "Fetched all users" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// GET /api/users/stats  —  admin stats cards
export const getUserStats = async (req, res) => {
    try {
        const [overallRes, returnRes] = await Promise.all([
            pgPool.query(`
                SELECT
                    COUNT(*) AS total,
                    COUNT(*) FILTER (
                        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
                    ) AS new_this_month
                FROM users`),
            pgPool.query(`
                SELECT ROUND(
                    100.0 * COUNT(*) FILTER (WHERE booking_count > 1)
                    / NULLIF(COUNT(*), 0), 1
                ) AS return_rate
                FROM (
                    SELECT user_id, COUNT(*) AS booking_count
                    FROM bookings
                    GROUP BY user_id
                ) sub`),
        ]);
        res.json({
            success: true,
            data: {
                total: parseInt(overallRes.rows[0].total),
                new_this_month: parseInt(overallRes.rows[0].new_this_month),
                return_rate: parseFloat(returnRes.rows[0].return_rate || 0),
            },
            message: "Fetched user stats",
        });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/users/:id  —  update basic info
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone_number, address } = req.body;
        const { rows } = await pgPool.query(
            `UPDATE users SET username = $1, phone_number = $2, address = $3
             WHERE user_id = $4
             RETURNING user_id, username, email, phone_number, address, is_active, status`,
            [username, phone_number, address, id]
        );
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "User not found" });
        res.json({ success: true, data: rows[0], message: "User updated" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};

// PUT /api/users/:id/toggle-lock
export const toggleUserLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pgPool.query(
            `UPDATE users
             SET is_active = NOT is_active,
                 status = CASE WHEN is_active THEN 'LOCKED' ELSE 'ACTIVE' END
             WHERE user_id = $1
             RETURNING user_id, username, email, is_active, status`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ success: false, data: null, message: "User not found" });
        res.json({ success: true, data: rows[0], message: "User lock status toggled" });
    } catch (err) {
        res.status(500).json({ success: false, data: null, message: err.message });
    }
};
