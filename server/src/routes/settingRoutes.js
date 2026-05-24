import express from 'express';
import { getSettingsHandler, updateSettingsHandler } from '../controllers/settingController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/settings - Lấy cấu hình hệ thống (Công khai)
router.get('/', getSettingsHandler);

// PUT /api/settings - Cập nhật cấu hình hệ thống (Yêu cầu xác thực Admin)
router.put('/', verifyToken, verifyAdmin, updateSettingsHandler);

export default router;
