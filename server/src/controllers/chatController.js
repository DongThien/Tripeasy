import * as chatService from '../services/chatService.js';

/**
 * GET /api/chat/history - Get session message history
 */
export const getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.query;
        const userId = req.user?.id;

        const data = await chatService.getChatHistory(sessionId, userId);

        return res.status(200).json({
            success: true,
            ...data
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể tải lịch sử trò chuyện: ' + error.message
        });
    }
};

/**
 * POST /api/chat/clear - Clear message history for a session
 */
export const clearChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is required' });
        }

        await chatService.clearChatHistory(sessionId);

        return res.status(200).json({
            success: true,
            message: 'Đã xóa sạch lịch sử trò chuyện trên hệ thống.'
        });
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể xóa lịch sử trò chuyện: ' + error.message
        });
    }
};

/**
 * POST /api/chat - Main chatbot handler with Hybrid RAG & Tool Calling
 */
export const handleChat = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user?.id;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const data = await chatService.processChat(message, sessionId, userId);

        return res.status(200).json({
            success: true,
            ...data
        });
    } catch (error) {
        console.error('Error in handleChat:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi kết nối tới trợ lý ảo Gemini: ' + error.message
        });
    }
};
