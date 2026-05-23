import express from "express";
import * as contactController from "../controllers/contactController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route công khai để khách hàng gửi phản hồi
router.post("/", contactController.submitContact);

// Các route quản trị yêu cầu quyền Admin
router.get("/", verifyAdmin, contactController.getAllContacts);
router.put("/:id/status", verifyAdmin, contactController.updateContactStatus);
router.post("/:id/reply", verifyAdmin, contactController.replyToContact);
router.delete("/:id", verifyAdmin, contactController.deleteContact);

export default router;
