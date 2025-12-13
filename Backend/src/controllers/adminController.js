const pool = require("../config/db");

// 🧮 Dashboard Stats (Already working)
exports.getAdminStats = async (req, res) => {
  try {
    const [[productCount]] = await pool.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );
    const [[userCount]] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );
    const [[logCount]] = await pool.query(
      "SELECT COUNT(*) AS totalLogs FROM user_logs"
    );

    res.json({
      totalProducts: productCount.totalProducts,
      totalUsers: userCount.totalUsers,
      totalLogs: logCount.totalLogs,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};

// 👥 Get All Users for Admin Dashboard
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role, created_at FROM users"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 Get All Products for Admin Dashboard
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};

// 📋 Get All Logs for Admin Dashboard
exports.getAllLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_logs ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to load logs" });
  }
};

// 📥 Add New Product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      calories,
      carbs,
      sugar,
      protein,
      brand,
      image_url,
      ingredients_text,
    } = req.body;

    if (!name || !barcode) {
      return res.status(400).json({ message: "Name and barcode are required" });
    }

    await pool.query(
      `INSERT INTO products (name, barcode, calories, carbs, sugar, protein, brand, image_url, ingredients_text)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        barcode,
        calories,
        carbs,
        sugar,
        protein,
        brand,
        image_url,
        ingredients_text,
      ]
    );

    res.status(201).json({ message: "✅ Product added successfully!" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};
