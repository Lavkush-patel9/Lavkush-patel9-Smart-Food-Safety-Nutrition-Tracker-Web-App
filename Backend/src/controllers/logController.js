// Backend/src/controllers/logController.js
const db = require("../config/db");

// // Add a new log entry
exports.addLog = async (req, res) => {
  try {
    const {
      product_name,
      calories,
      sugar,
      protein,
      fat,
      carbs,
      fiber,
      sodium,
      cholesterol,
      calcium,
      iron,
      vitamin_c,
      barcode,
    } = req.body;

    await pool.query(
      `INSERT INTO user_logs 
          (user_id, product_name, calories, sugar, protein, fat, carbs, fiber, sodium, cholesterol, calcium, iron, vitamin_c, barcode) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        product_name,
        calories || 0,
        sugar || 0,
        protein || 0,
        fat || 0,
        carbs || 0,
        fiber || 0,
        sodium || 0,
        cholesterol || 0,
        calcium || 0,
        iron || 0,
        vitamin_c || 0,
        barcode || null,
      ]
    );
    res
      .status(201)
      .json({ message: "Log added successfully", id: result.insertId });
    console.log("insserted log id:", result.insertId);
  } catch (err) {
    console.error("Error adding log:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await db.execute(
      "SELECT * FROM user_logs WHERE user_id = ? ORDER BY date DESC",
      [user_id]
    );
    console.log("decoded user:", req.user);
    console.log("fetched logs:", user_id);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [result] = await db.execute(
      "DELETE FROM user_logs WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Log not found or not authorized" });
    }

    res.status(200).json({ message: "Log deleted successfully" });
    console.log("deleted log id:", id);
  } catch (error) {
    console.error("Error deleting log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
