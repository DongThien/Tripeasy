// src/utils/formatHelper.js

/**
 * Định dạng số tiền về chuẩn tiền tệ Việt Nam (VD: 6.300.000 đ)
 * @param {string|number} value - Giá trị số tiền từ backend (có thể là string hoặc number)
 * @returns {string} - Chuỗi số tiền đã format, VD: "6.300.000 đ"
 */
export function formatVND(value) {
    if (!value || isNaN(Number(value))) return '0 đ';
    return Number(value).toLocaleString('vi-VN') + ' đ';
}
