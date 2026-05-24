import { getSettings, updateSettings } from '../services/settingService.js';

/**
 * GET /api/settings
 * Lấy toàn bộ cấu hình vận hành hệ thống (Công khai vì không chứa khóa bí mật)
 */
export const getSettingsHandler = async (req, res) => {
    try {
        const settings = getSettings();
        return res.status(200).json({
            success: true,
            data: settings,
            message: "Lấy cấu hình hệ thống thành công"
        });
    } catch (error) {
        console.error("Lỗi getSettingsHandler:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi truy xuất cài đặt: " + error.message
        });
    }
};

/**
 * PUT /api/settings
 * Cập nhật cấu hình hệ thống (Yêu cầu xác thực Admin)
 */
export const updateSettingsHandler = async (req, res) => {
    try {
        const newSettings = req.body;
        if (!newSettings) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu cấu hình cập nhật"
            });
        }

        const updated = await updateSettings(newSettings);
        return res.status(200).json({
            success: true,
            data: updated,
            message: "Cập nhật cấu hình hệ thống thành công"
        });
    } catch (error) {
        console.error("Lỗi updateSettingsHandler:", error);
        return res.status(500).json({
            success: false,
            message: "Không thể cập nhật cấu hình: " + error.message
        });
    }
};
