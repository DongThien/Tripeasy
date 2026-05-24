import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Tạo vector embedding cho đoạn văn bản sử dụng model text-embedding-004 của Gemini
 * @param {string} text Đoạn văn bản cần tạo embedding
 * @returns {Promise<Array<number>>} Mảng vector số thực 768 chiều
 */
export const generateEmbedding = async (text) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
        
        const result = await model.embedContent(text);
        if (result && result.embedding && result.embedding.values) {
            return result.embedding.values;
        }
        throw new Error('Failed to extract embedding values from Gemini response');
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
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
    generateTourSearchText
};

export default geminiService;
