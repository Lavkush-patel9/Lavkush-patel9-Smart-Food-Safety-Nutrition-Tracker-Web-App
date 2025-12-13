// Backend/src/routes/ProfileRoutes.js

const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/ProfileController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/profile", verifyToken, getProfile);
router.put(
  "/update",
  verifyToken,
  upload.single("profileImage"),
  updateProfile
);
router.delete("/delete", verifyToken, deleteProfile);

module.exports = router;
