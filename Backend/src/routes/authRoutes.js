const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

//public routes
router.post("/signup", signup);
router.post("/login", login);

// ✅ Protected route example
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

module.exports = router;
