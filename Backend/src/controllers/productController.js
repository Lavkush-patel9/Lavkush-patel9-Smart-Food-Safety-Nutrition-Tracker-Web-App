const pool = require("../config/db");

// 1. 🔍 Health-Focused Search (low sugar + calories priority)
exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.trim() : "";

    if (!query) {
      return res.json([]);
    }

    const [rows] = await pool.query(
      `SELECT id, name, image_url, sugar, calories, protein 
       FROM products 
       WHERE name LIKE ? 
       ORDER BY sugar ASC, calories ASC 
       LIMIT 10`,
      [`%${query}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Search API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 2. 📦 Get All Products (Admin)
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. 🆔 Get Product By ID + User Log
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];

    // User log insert
    if (req.user && req.user.id) {
      await pool.query(
        `INSERT INTO user_logs 
        (user_id, product_name, calories, sugar, protein, date, barcode) 
        VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
        [
          req.user.id,
          product.name,
          product.calories || 0,
          product.sugar || 0,
          product.protein || 0,
          product.barcode || null,
        ]
      );
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Error in getProductById:", err);
    res.status(500).json({ error: err.message });
  }
};

// 4. 📥 Add Product (ADMIN)
exports.addProducts = async (req, res) => {
  const {
    name,
    barcode,
    calories,
    carbs,
    sugar,
    protein,
    fat,
    sodium,
    image_url,
    ingredients_text,
  } = req.body;

  if (!name || !barcode) {
    return res.status(400).json({ message: "Name and barcode are required" });
  }

  try {
    await pool.query(
      `INSERT INTO products 
      (name, barcode, calories, carbs, sugar, protein, fat, sodium, image_url, ingredients_text) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        barcode,
        calories || 0,
        carbs || 0,
        sugar || 0,
        protein || 0,
        fat || 0,
        sodium || 0,
        image_url,
        ingredients_text,
      ]
    );

    res.status(201).json({ message: "✅ Product added successfully" });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
};

// 5. 🗑️ Delete Product
exports.deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. 🧹 Delete Incomplete Products (FIXED - no brand dependency)
exports.deleteIncompleteProducts = async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM products
      WHERE name IS NULL
      OR calories IS NULL
      OR sugar IS NULL
      OR name = ''
      OR LOWER(name) = 'unknown'
    `);

    res.json({
      message: `🧹 ${result.affectedRows} incomplete products removed.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. 🧪 Filter Products
exports.filterProducts = async (req, res) => {
  try {
    const { high_sugar, high_calories } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (high_sugar === "true") {
      sql += " AND sugar > ?";
      params.push(20);
    }

    if (high_calories === "true") {
      sql += " AND calories > ?";
      params.push(300);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};