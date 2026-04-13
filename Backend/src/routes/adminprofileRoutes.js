const express = require("express");
const router = express.Router();

const adminprofileController = require("../controllers/adminprofileController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");// 👈 add this

router.get("/profile", verifyToken, isAdmin, adminprofileController.getProfile);

module.exports = router;