import express from 'express';
import { handleChat, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { optionalVerifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Định nghĩa các route cho Chatbot
router.get('/history', optionalVerifyToken, getChatHistory);
router.post('/clear', optionalVerifyToken, clearChatHistory);
router.post('/', optionalVerifyToken, handleChat);

export default router;
