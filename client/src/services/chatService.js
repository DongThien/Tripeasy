import axiosClient from './axiosClient';

/**
 * Gửi tin nhắn mới cùng sessionId lên server
 * @param {string} message Tin nhắn mới của user
 * @param {string} sessionId ID của phiên chat (UUID)
 */
export const sendChatMessage = (message, sessionId) => {
    return axiosClient.post('/chat', { message, sessionId }).then((r) => r.data);
};

/**
 * Lấy lịch sử tin nhắn của phiên chat từ database
 * @param {string} sessionId ID của phiên chat (UUID)
 */
export const getChatHistory = (sessionId) => {
    return axiosClient.get('/chat/history', { params: { sessionId } }).then((r) => r.data);
};

/**
 * Xóa lịch sử tin nhắn của phiên chat trong database
 * @param {string} sessionId ID của phiên chat (UUID)
 */
export const clearChatHistory = (sessionId) => {
    return axiosClient.post('/chat/clear', { sessionId }).then((r) => r.data);
};

const chatService = {
    sendChatMessage,
    getChatHistory,
    clearChatHistory
};

export default chatService;
