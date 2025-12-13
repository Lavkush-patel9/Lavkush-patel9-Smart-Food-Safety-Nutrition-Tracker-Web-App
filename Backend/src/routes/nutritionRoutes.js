// Backend/src/routes/nutritionRoutes.js
const express = require("express");
const router = express.Router();
const {
  saveNutrition,
  getTodayNutrition,
} = require("../controllers/nutritionController");
const { verifyToken } = require("../middleware/authMiddleware");
router.post("/save", verifyToken, saveNutrition);
// Get today's nutrition (GET)
router.get("/today", verifyToken, getTodayNutrition);
module.exports = router;
