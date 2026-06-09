import { OAuth2Client } from "google-auth-library";
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
    deleteUserData,
    loginWithSocialData
} from "../services/userService.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const loginWithGoogle = async (req, res) => {
    try {
        const { accessToken, isMock, mockEmail, mockName } = req.body;
        
        let email = "";
        let name = "";

        const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
        if (isMock || !hasGoogleClientId || (accessToken && accessToken.startsWith("mock_"))) {
            email = mockEmail || (accessToken && accessToken.replace("mock_", "")) || "google-mock@gmail.com";
            name = mockName || "Google User Test";
        } else {
            if (!accessToken) {
                return res.status(400).json({ success: false, message: "Thiếu Google Access Token" });
            }
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
            if (!response.ok) {
                throw new Error("Xác thực Google Access Token thất bại");
            }
            const payload = await response.json();
            email = payload.email;
            name = payload.name;
        }

        const data = await loginWithSocialData(email, name);
        res.json({ success: true, data, message: "Đăng nhập bằng Google thành công" });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};

export const loginWithFacebook = async (req, res) => {
    try {
        const { accessToken, isMock, mockEmail, mockName } = req.body;

        let email = "";
        let name = "";

        const hasFacebookAppId = !!process.env.FACEBOOK_APP_ID;
        if (isMock || !hasFacebookAppId || (accessToken && accessToken.startsWith("mock_"))) {
            email = mockEmail || (accessToken && accessToken.replace("mock_", "")) || "facebook-mock@gmail.com";
            name = mockName || "Facebook User Test";
        } else {
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
            if (!response.ok) {
                throw new Error("Xác thực Facebook Access Token thất bại");
            }
            const payload = await response.json();
            email = payload.email;
            name = payload.name;

            if (!email) {
                email = `${payload.id}@facebook.com`;
            }
        }

        const data = await loginWithSocialData(email, name);
        res.json({ success: true, data, message: "Đăng nhập bằng Facebook thành công" });
    } catch (err) {
        console.error("Facebook login error:", err);
        res.status(err.statusCode || 500).json({ success: false, data: null, message: err.message });
    }
};