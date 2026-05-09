import express from "express";
import * as tourController from "../controllers/tourController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.post("/", upload.array('images', 10), tourController.createTour);
router.post("/:id/images", upload.array('images', 10), tourController.uploadTourImages);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);
router.get("/:id/reviews", tourController.getTourReviews);

export default router;