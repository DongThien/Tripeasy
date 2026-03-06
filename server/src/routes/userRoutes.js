import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/stats", userController.getUserStats);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getProfile);
router.put("/:id/toggle-lock", userController.toggleUserLock);
router.put("/:id", userController.updateUser);

export default router;
