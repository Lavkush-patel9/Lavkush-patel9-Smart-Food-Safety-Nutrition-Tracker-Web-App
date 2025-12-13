const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProducts = async (req, res) => {
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

  try {
    await pool.query(
      `INSERT INTO products 
      (name, barcode, calories, carbs, sugar, protein, brand, image_url, ingredients_text) 
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

    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }
    const userId = req.user.id;
    const userRole = req.user.role;

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Product not found" });

    const product = rows[0];
    if (userRole === "admin") {
      await pool.query(
        "INSERT INTO user_logs (user_id, product_name, calories, sugar, protein, date) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userId,
          product.name || null,
          product.calories || 0,
          product.sugar || 0,
          product.protein || 0,
          new Date(),
        ]
      );
      console.log(`✅ Log saved for user ${userId} - ${product.name}`);
    } else {
      console.log(`👑 Admin accessed product: ${product.name}`);
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Error in getProductById:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Delete Incomplete (Null or Unknown) Products
exports.deleteIncompleteProducts = async (req, res) => {
  try {
    console.log("🧹 Delete incomplete route hit by:", req.user);

    const [result] = await pool.query(`
      DELETE FROM products
      WHERE 
        name IS NULL 
        OR brand IS NULL 
        OR calories IS NULL 
        OR sugar IS NULL
        OR LOWER(name) = 'unknown'
        OR LOWER(brand) = 'unknown'
        OR LOWER(calories) = 'unknown'
        OR LOWER(sugar) = 'unknown'
    `);

    console.log("🗑️ Deleted rows:", result.affectedRows);
    res.json({
      message: `🧹 ${result.affectedRows} incomplete products deleted successfully.`,
    });
  } catch (err) {
    console.error("❌ Error cleaning products:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Delete Single Product (Admin only)
exports.deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query missing" });

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${q}%`]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { high_sugar, high_calories } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (high_sugar === "true") {
      query += " AND sugar > ?";
      params.push(22); // sugar threshold in grams
    }

    if (high_calories === "true") {
      query += " AND calories > ?";
      params.push(300); // calories threshold
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
