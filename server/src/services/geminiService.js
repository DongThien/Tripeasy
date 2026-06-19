import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let currentKeyIndex = 0;

/**
 * Đọc tất cả các API keys được cấu hình trong .env từ GEMINI_API_KEYS hoặc GEMINI_API_KEY
 * @returns {Array<string>} Danh sách API keys hợp lệ
 */
export const getApiKeys = () => {
    const keys = [];
    
    // Đọc từ GEMINI_API_KEYS trước
    if (process.env.GEMINI_API_KEYS) {
        const splitKeys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean);
        keys.push(...splitKeys);
    }
    
    // Đọc từ GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY) {
        const splitKeys = process.env.GEMINI_API_KEY.split(',').map(k => k.trim()).filter(Boolean);
        // Tránh trùng lặp
        splitKeys.forEach(k => {
            if (!keys.includes(k)) {
                keys.push(k);
            }
        });
    }
    
    return keys;
};

/**
 * Lấy API key hiện tại đang hoạt động
 * @returns {string|null} API key
 */
export const getActiveApiKey = () => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        return null;
    }
    if (currentKeyIndex >= keys.length) {
        currentKeyIndex = 0;
    }
    return keys[currentKeyIndex];
};

/**
 * Xoay vòng sang API key tiếp theo trong danh sách
 * @returns {boolean} True nếu xoay vòng thành công, False nếu không còn key nào khác
 */
export const rotateApiKey = () => {
    const keys = getApiKeys();
    if (keys.length <= 1) {
        return false;
    }
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    console.log(`[Gemini Rotation] Đã xoay vòng sang API key thứ ${currentKeyIndex + 1}/${keys.length} (Ký tự đầu: ${keys[currentKeyIndex].substring(0, 8)}...)`);
    return true;
};

/**
 * Tạo vector embedding cho đoạn văn bản sử dụng model text-embedding-004 của Gemini
 * @param {string} text Đoạn văn bản cần tạo embedding
 * @returns {Promise<Array<number>>} Mảng vector số thực 768 chiều
 */
export const generateEmbedding = async (text) => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        throw new Error('Không có GEMINI_API_KEY hoặc GEMINI_API_KEYS nào được cấu hình trong file .env');
    }

    let attempts = 0;
    const maxAttempts = keys.length;

    while (attempts < maxAttempts) {
        const apiKey = getActiveApiKey();
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
            
            const result = await model.embedContent(text);
            if (result && result.embedding && result.embedding.values) {
                return result.embedding.values;
            }
            throw new Error('Không thể trích xuất giá trị embedding từ phản hồi của Gemini');
        } catch (error) {
            attempts++;
            console.error(`[Gemini Error] Lỗi tạo embedding với key thứ ${currentKeyIndex + 1}/${keys.length}:`, error.message || error);
            
            if (attempts < maxAttempts) {
                console.warn(`[Gemini Rotation] Tự động xoay vòng API key do gặp lỗi...`);
                rotateApiKey();
            } else {
                throw new Error(`Tất cả các Gemini API keys đều thất bại khi tạo embedding. Lỗi cuối: ${error.message || error}`);
            }
        }
    }
};

/**
 * Tính toán độ tương đồng Cosine giữa hai vector
 * @param {Array<number>} vecA Vector A
 * @param {Array<number>} vecB Vector B
 * @returns {number} Độ tương đồng Cosine (từ -1 đến 1, thường từ 0 đến 1 cho embeddings)
 */
export const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        return 0;
    }
    
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) {
        return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Tổng hợp thông tin chi tiết của Tour thành đoạn text thống nhất để tạo vector search
 * @param {Object} tour Đối tượng tour từ database
 * @returns {string} Đoạn văn bản mô tả đầy đủ thông tin tour
 */
export const generateTourSearchText = (tour) => {
    if (!tour) return '';
    return [
        `Tên Tour: ${tour.title || ''}`,
        `Địa điểm / Điểm đến: ${tour.destination || ''}`,
        `Miền: ${tour.region || ''}`,
        `Thời gian đi: ${tour.duration || ''}`,
        `Giá vé người lớn: ${tour.price_adult ? Number(tour.price_adult).toLocaleString('vi-VN') + ' đ' : ''}`,
        `Giá vé trẻ em: ${tour.price_child ? Number(tour.price_child).toLocaleString('vi-VN') + ' đ' : ''}`,
        `Phương tiện di chuyển: ${tour.transport || ''}`,
        `Điểm khởi hành: ${tour.start_location || ''}`,
        `Hành trình chi tiết: ${tour.itinerary || ''}`,
        `Điểm nổi bật / Điểm nhấn: ${tour.highlights || ''}`,
        `Dịch vụ bao gồm: ${tour.included || ''}`,
        `Dịch vụ không bao gồm: ${tour.excluded || ''}`
    ].filter(line => line.split(': ')[1]).join('\n');
};

const geminiService = {
    generateEmbedding,
    cosineSimilarity,
    generateTourSearchText,
    getApiKeys,
    getActiveApiKey,
    rotateApiKey
};

export default geminiService;
