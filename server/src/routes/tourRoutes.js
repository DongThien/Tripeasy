import express from "express";
import multer from "multer";
import * as tourController from "../controllers/tourController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const excelUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});
router.get("/", tourController.getAllTours);
router.post("/import", excelUpload.single("file"), tourController.importToursFromExcel);
router.get("/:id/images", tourController.getTourImages);
router.get("/:id", tourController.getTourById);
router.post("/", upload.array('images', 10), tourController.createTour);
router.post("/:id/images", upload.array('images', 10), tourController.uploadTourImages);
router.delete("/:id/images", tourController.deleteTourImage);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);
router.get("/:id/reviews", tourController.getTourReviews);
router.get("/:id/pdf", tourController.exportTourItineraryPDF);

export default router;