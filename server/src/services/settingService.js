import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tới file settings.json nằm trong src/config/
const SETTINGS_FILE_PATH = path.join(__dirname, '..', 'config', 'settings.json');

// Khởi tạo các giá trị cài đặt mặc định
const DEFAULT_SETTINGS = {
    general: {
        siteName: "Tripeasy",
        hotline: "1900 1234",
        email: "support@tripeasy.com",
        address: "123 Đường Láng, Đống Đa, Hà Nội",
        facebook: "https://facebook.com/tripeasy",
        instagram: "https://instagram.com/tripeasy"
    },
    payment: {
        bankCode: "MB",
        accountNumber: "0869688128",
        accountName: "NGUYEN DONG THIEN",
        qrTemplate: "TRIPEASY BK {booking_id}"
    },
    policy: {
        depositRatio: 100,
        freeCancellationDays: 5,
        defaultVat: 10
    },
    chatbot: {
        quickQuestions: [
            "Tư vấn tour đi nghỉ dưỡng biển yên bình",
            "Tìm tour Sapa khởi hành từ Hà Nội",
            "Tôi muốn đặt tour Phú Quốc",
            "Xem lịch sử đơn đặt tour của tôi"
        ]
    }
};

let settingsCache = null;

/**
 * Đọc cấu hình từ tệp tin settings.json và lưu vào bộ nhớ cache.
 * Nếu tệp không tồn tại, tự động ghi đè cài đặt mặc định để tạo tệp.
 */
export const loadSettings = () => {
    try {
        if (!fs.existsSync(SETTINGS_FILE_PATH)) {
            console.log('⚠️ settings.json không tồn tại. Đang tạo mới với các cấu hình mặc định...');
            // Đảm bảo thư mục cha tồn tại
            fs.mkdirSync(path.dirname(SETTINGS_FILE_PATH), { recursive: true });
            fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
            settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        } else {
            const dataStr = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
            settingsCache = JSON.parse(dataStr);
        }
        console.log('✅ Nạp cấu hình hệ thống động thành công!');
        return settingsCache;
    } catch (err) {
        console.error('❌ Lỗi khi tải tệp cấu hình settings.json:', err);
        // Fallback sang DEFAULT_SETTINGS nếu gặp lỗi nghiêm trọng
        settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        return settingsCache;
    }
};

/**
 * Trả về toàn bộ cài đặt hiện tại từ cache.
 */
export const getSettings = () => {
    if (!settingsCache) {
        return loadSettings();
    }
    return settingsCache;
};

/**
 * Trả về một giá trị cài đặt cụ thể thông qua đường dẫn chuỗi (ví dụ: 'payment.bankCode').
 * @param {string} dotPath Đường dẫn thuộc tính cách nhau bằng dấu chấm.
 * @returns {any} Giá trị thuộc tính cấu hình.
 */
export const getSetting = (dotPath) => {
    const settings = getSettings();
    const parts = dotPath.split('.');
    let current = settings;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
    }
    return current;
};

/**
 * Cập nhật cấu hình mới vào tệp và cache.
 * @param {Object} newSettings Đối tượng cấu hình mới
 */
export const updateSettings = async (newSettings) => {
    try {
        // Hợp nhất (Merge) cấu hình mới vào cache hiện tại
        const updated = {
            general: { ...getSettings().general, ...(newSettings.general || {}) },
            payment: { ...getSettings().payment, ...(newSettings.payment || {}) },
            policy: { ...getSettings().policy, ...(newSettings.policy || {}) },
            chatbot: { ...getSettings().chatbot, ...(newSettings.chatbot || {}) }
        };

        // Ghi xuống file đĩa
        fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
        settingsCache = updated;
        console.log('✅ Lưu và làm mới cấu hình hệ thống thành công!');
        return settingsCache;
    } catch (err) {
        console.error('❌ Lỗi khi lưu cấu hình settings.json:', err);
        throw new Error('Không thể lưu tệp cấu hình: ' + err.message);
    }
};

const settingService = { loadSettings, getSettings, getSetting, updateSettings };
export default settingService;
