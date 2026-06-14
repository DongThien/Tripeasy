// src/utils/dateHelper.js

/**
 * Lấy ngày hôm nay dưới định dạng YYYY-MM-DD theo giờ địa phương
 * @returns {string}
 */
export const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Tự động tính toán ngày về dựa theo ngày đi và thời lượng tour
 * Ví dụ: Ngày đi 2026-06-12, Thời lượng "3N2Đ" (3 ngày) -> Ngày về 2026-06-14
 * 
 * @param {string} startDateStr - Ngày khởi hành dạng YYYY-MM-DD
 * @param {string} durationStr - Thời lượng tour (VD: 3N2Đ, 4 ngày 3 đêm, 1 ngày...)
 * @returns {string} - Ngày về dạng YYYY-MM-DD
 */
export const calculateEndDate = (startDateStr, durationStr) => {
    if (!startDateStr) return '';
    if (!durationStr) return '';
    
    // Tìm con số ngày đầu tiên trong chuỗi thời lượng (VD: "3" trong "3N2Đ" hoặc "4" trong "4 ngày 3 đêm")
    const match = durationStr.match(/(\d+)\s*(?:N|n|ngày|ngày|ngay|Ngay)/i);
    let days = 0;
    if (!match) {
        // Fallback: tìm bất kỳ số nào bắt đầu
        const startDigitMatch = durationStr.match(/^(\d+)/);
        if (!startDigitMatch) return '';
        days = parseInt(startDigitMatch[1], 10);
    } else {
        days = parseInt(match[1], 10);
    }
    
    if (isNaN(days) || days <= 0) return '';
    
    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) return '';
    
    // Ngày về = Ngày đi + (số ngày - 1)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (days - 1));
    
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
