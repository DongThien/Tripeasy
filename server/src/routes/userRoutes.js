import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- LUỒNG AUTH CÔNG KHAI (Không cần đăng nhập) ---
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// --- LUỒNG ĐĂNG NHẬP THƯỜNG (Yêu cầu Token cá nhân) ---
router.get("/me", verifyToken, userController.getCurrentUser);
router.put("/:id", verifyToken, userController.updateUser);

// --- LUỒNG QUẢN TRỊ VIÊN (Yêu cầu Token & quyền Admin) ---
router.get("/stats", verifyAdmin, userController.getUserStats);
router.get("/", verifyAdmin, userController.getAllUsers);
router.get("/:id", verifyAdmin, userController.getProfile);
router.put("/:id/toggle-lock", verifyAdmin, userController.toggleUserLock);

export default router;