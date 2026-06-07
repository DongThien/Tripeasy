import {
    registerData,
    loginData,
    getProfileData,
    getAllUsersData,
    getUserStatsData,
    updateUserData,
    toggleUserLockData,
    forgotPasswordData,
    resetPasswordData,
    changePasswordData,
    deleteUserData
} from "../services/userService.js";

export const register = async (req, res) => {
    try {
        const data = await registerData(req.body);
        res.status(201).json({ success: true, data, message: "Register successful" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const data = await loginData(req.body);
        res.json({ success: true, data, message: "Login successful" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getProfileData(id);
        res.json({ success: true, data, message: "Fetched user profile" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        // req.user.id được gắn vào bởi middleware verifyToken
        const data = await getProfileData(req.user.id);
        res.json({ success: true, data, message: "Fetched current logged-in profile" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const data = await getAllUsersData(req.query);
        res.json({ success: true, data, message: "Fetched all users" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const data = await getUserStatsData();
        res.json({ success: true, data, message: "Fetched user stats" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id !== Number(id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này" });
        }
        const data = await updateUserData(id, req.body);
        res.json({ success: true, data, message: "User updated" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const toggleUserLock = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await toggleUserLockData(id);
        res.json({ success: true, data, message: "User lock status toggled" });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const message = await forgotPasswordData(req.body.email);
        res.json({ success: true, data: null, message });
    } catch (err) {
        console.error("Forgot password error:", err.original || err);
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const message = await resetPasswordData(token, newPassword);
        res.json({ success: true, data: null, message });
    } catch (err) {
        console.error("Reset password error:", err.original || err);
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        if (req.user.id !== Number(id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này" });
        }
        const message = await changePasswordData(id, currentPassword, newPassword);
        res.json({ success: true, message });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id !== Number(id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này" });
        }
        const message = await deleteUserData(id);
        res.json({ success: true, message });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};