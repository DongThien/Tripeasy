import bcrypt from "bcryptjs";
import {
    fetchUserByEmailRow,
    insertUserRow,
    fetchUserProfileRow,
    fetchAllUsersRows,
    fetchUserOverallStatsRow,
    fetchUserReturnRateRow,
    updateUserRow,
    toggleUserLockRow
} from "../models/userModel.js";

const mapUser = (row) => ({
    id: row.user_id,
    name: row.username,
    email: row.email,
    phone: row.phone_number || "—",
    registeredAt: new Date(row.created_at).toLocaleDateString("vi-VN"),
    totalSpent: Math.floor(parseFloat(row.total_spent_raw || 0)).toLocaleString("en-US") + "đ",
    tier: row.tier,
    status: row.is_active ? "active" : "locked",
    avatar: ""
});

export const registerData = async (payload) => {
    const { username, email, password, phone_number, address, ip_address } = payload;
    const existingUser = await fetchUserByEmailRow(email);
    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return insertUserRow({
        username,
        email,
        passwordHash,
        phone_number,
        address,
        ip_address
    });
};

export const loginData = async (payload) => {
    const { email, password } = payload;
    const user = await fetchUserByEmailRow(email);
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return { user_id: user.user_id, username: user.username, email: user.email };
};

export const getProfileData = async (userId) => {
    const row = await fetchUserProfileRow(userId);
    if (!row) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

export const getAllUsersData = async ({ search, status }) => {
    const searchParam = search ? `%${search}%` : null;
    const statusParam = status === "active" || status === "locked" ? status : null;

    const rows = await fetchAllUsersRows(searchParam, statusParam);
    return rows.map(mapUser);
};

export const getUserStatsData = async () => {
    const [overallRow, returnRow] = await Promise.all([
        fetchUserOverallStatsRow(),
        fetchUserReturnRateRow()
    ]);

    return {
        total: parseInt(overallRow.total),
        new_this_month: parseInt(overallRow.new_this_month),
        return_rate: parseFloat(returnRow.return_rate || 0)
    };
};

export const updateUserData = async (userId, payload) => {
    const { username, phone_number, address } = payload;
    const row = await updateUserRow(userId, username, phone_number, address);
    if (!row) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

export const toggleUserLockData = async (userId) => {
    const row = await toggleUserLockRow(userId);
    if (!row) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return row;
};
