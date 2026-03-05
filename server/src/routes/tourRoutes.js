import express from "express";
import * as tourController from "../controllers/tourController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.post("/", upload.array('images', 10), tourController.createTour);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export default router;