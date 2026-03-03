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
