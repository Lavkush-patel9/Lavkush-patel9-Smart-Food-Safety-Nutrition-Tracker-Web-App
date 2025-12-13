const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db"); // adjust path if needed
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllLogs,
  addProduct,
} = require("../controllers/adminController");

// 🧩 Admin registration route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, secretKey } = req.body;

    // Check if secret key matches
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid admin key" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, "admin"]
    );

    res.status(201).json({ message: "✅ Admin registered successfully" });
  } catch (err) {
    console.error("❌ Error registering admin:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📊 Admin Dashboard Stats (Total users, products, logs)
router.get("/stats", verifyToken, isAdmin, getAdminStats);
// 👥 All Users Data (for admin table view)
router.get("/users", verifyToken, isAdmin, getAllUsers);
// 📦 All Products Data (for admin table view)
router.get("/products", verifyToken, isAdmin, getAllProducts);
// 📋 All Logs Data (for admin table view)
router.get("/logs", verifyToken, isAdmin, getAllLogs);

// Additional admin routes (e.g., delete product, add product) can be added here
router.addProduct = require("./productRoutes", verifyToken, isAdmin, addProduct);

module.exports = router;
