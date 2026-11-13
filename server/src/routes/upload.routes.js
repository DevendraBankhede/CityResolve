import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow single image, file, or multiple files using upload.any()
router.post(
  "/image",
  protect,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (req.files && req.files.length === 1 && !req.file) {
        req.file = req.files[0];
      }
      next();
    });
  },
  uploadImage
);

export default router;