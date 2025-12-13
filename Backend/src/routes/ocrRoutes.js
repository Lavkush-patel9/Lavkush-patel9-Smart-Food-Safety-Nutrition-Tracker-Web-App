// ✅ Backend/src/routes/ocrRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/ocrController"); // ✅ main controller function import

// Memory storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route: handle image or barcode upload
router.post("/upload", verifyToken, upload.single("image"), uploadImage);

module.exports = router;
