import express from "express";
import * as tourController from "../controllers/tourController.js";

const router = express.Router();
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.post("/", tourController.createTour);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export default router;