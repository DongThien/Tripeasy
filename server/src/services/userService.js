import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import {
    fetchUserByEmailRow,
    fetchUserByEmailOrPhoneRow,
    insertUserRow,
    fetchUserProfileRow,
    fetchAllUsersRows,
    fetchUserOverallStatsRow,
    fetchUserReturnRateRow,
    updateUserRow,
    toggleUserLockRow,
    savePasswordResetTokenRow,
    fetchUserByResetTokenRow,
    updateUserPasswordRow,
    fetchUserPasswordRow,
    deleteUserRow
} from "../models/userModel.js";

// Cấu hình Mailer bảo mật thông qua biến môi trường (.env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const assertMailerConfig = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        const error = new Error("Thiếu cấu hình EMAIL_USER/EMAIL_PASS cho dịch vụ gửi email");
        error.statusCode = 500;
        throw error;
    }
};

const mapUser = (row) => ({
    id: row.user_id,
    name: row.username,
    email: row.email,
    phone: row.phone_number || "—",
    role: row.role,
    registeredAt: new Date(row.created_at).toLocaleDateString("vi-VN"),
    registeredAtRaw: row.created_at,
    totalSpent: Math.floor(parseFloat(row.total_spent_raw || 0)).toLocaleString("en-US") + "đ",
    totalSpentRaw: parseFloat(row.total_spent_raw || 0),
    tier: row.tier,
    status: row.is_active ? "active" : "locked",
    avatar: ""
});

export const registerData = async (payload) => {
    const {
        username,
        fullName,
        email,
        password,
        phone_number,
        phone,
        address,
        ip_address,
        agreeTerms
    } = payload;
    const normalizedUsername = username || fullName;
    const normalizedPhone = phone_number || phone;

    if (!normalizedUsername || !email || !password) {
        const error = new Error("Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu");
        error.statusCode = 400;
        throw error;
    }
    if (agreeTerms !== true) {
        const error = new Error("Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật");
        error.statusCode = 400;
        throw error;
    }
    const existingUser = await fetchUserByEmailRow(email);
    if (existingUser) {
        const error = new Error("Email này đã được đăng ký trong hệ thống Tripeasy");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return insertUserRow({
        username: normalizedUsername,
        email,
        passwordHash,
        phone_number: normalizedPhone,
        address,
        ip_address
    });
};

export const loginData = async (payload) => {
    const { email, phone, identifier, password } = payload;
    const normalizedIdentifier = (email || phone || identifier || "").trim();
    if (!normalizedIdentifier || !password) {
        const error = new Error("Vui lòng nhập email/số điện thoại và mật khẩu");
        error.statusCode = 400;
        throw error;
    }
    const user = await fetchUserByEmailOrPhoneRow(normalizedIdentifier);
    if (!user) {
        const error = new Error("Tài khoản hoặc mật khẩu không chính xác");
        error.statusCode = 401;
        throw error;
    }

    if (!user.is_active) {
        const error = new Error("Tài khoản của bạn hiện đang bị khóa");
        error.statusCode = 403;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Tài khoản hoặc mật khẩu không chính xác");
        error.statusCode = 401;
        throw error;
    }

    // Ký sinh mã định danh JWT Token gửi về client
    const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            phone: user.phone_number,
            role: user.role
        }
    };
};

export const getProfileData = async (userId) => {
    const row = await fetchUserProfileRow(userId);
    if (!row) {
        const error = new Error("Không tìm thấy người dùng");
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
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

export const toggleUserLockData = async (userId) => {
    const row = await toggleUserLockRow(userId);
    if (!row) {
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }
    return row;
};

// Xử lý gửi thư yêu cầu lấy lại mật khẩu
export const forgotPasswordData = async (email) => {
    const user = await fetchUserByEmailRow(email);
    if (!user) {
        const error = new Error("Email này không tồn tại trên hệ thống!");
        error.statusCode = 404;
        throw error;
    }

    assertMailerConfig();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date(Date.now() + 3600000); // Token sống 1 tiếng

    await savePasswordResetTokenRow(email, resetToken, expiryDate);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"Tripeasy Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔒 Khôi phục mật khẩu tài khoản Tripeasy của bạn",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #8B1A1A;">Xin chào ${user.username},</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Tripeasy gắn liền với email này.</p>
                <p>Vui lòng bấm vào liên kết bên dưới để tiến hành thiết lập mật khẩu mới (Liên kết có giá trị trong vòng 1 giờ):</p>
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${resetUrl}" style="background-color: #8B1A1A; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px;">Đặt lại mật khẩu</a>
                </div>
                <p style="color: #777; font-size: 12px;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email bảo mật này.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        const error = new Error("Gửi email thất bại. Vui lòng kiểm tra cấu hình SMTP/App Password");
        error.statusCode = 500;
        error.original = err;
        throw error;
    }
    return "Hệ thống đã gửi hướng dẫn khôi phục mật khẩu vào Email của bạn.";
};

// Thực hiện lưu mật khẩu mới
export const resetPasswordData = async (token, newPassword) => {
    const user = await fetchUserByResetTokenRow(token);
    if (!user) {
        const error = new Error("Mã khôi phục đã hết hạn hoặc không hợp lệ!");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordRow(user.user_id, passwordHash);
    return "Đặt lại mật khẩu mới thành công!";
};

export const changePasswordData = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        const error = new Error("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới");
        error.statusCode = 400;
        throw error;
    }
    const user = await fetchUserPasswordRow(userId);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const error = new Error("Mật khẩu hiện tại không chính xác");
        error.statusCode = 400;
        throw error;
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordRow(userId, passwordHash);
    return "Đổi mật khẩu thành công!";
};

export const deleteUserData = async (userId) => {
    const deletedUser = await deleteUserRow(userId);
    if (!deletedUser) {
        const error = new Error("Không tìm thấy tài khoản");
        error.statusCode = 404;
        throw error;
    }
    return "Xóa tài khoản thành công!";
};