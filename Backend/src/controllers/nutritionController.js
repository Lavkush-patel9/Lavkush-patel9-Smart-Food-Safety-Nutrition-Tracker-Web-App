// controllers/nutritionController.js
const pool = require("../config/db");

exports.saveNutrition = async (req, res) => {
  try {
    const userId = req.user.id;
    const { calories, sugar, protein, carbs, fat, sodium } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM user_daily_nutrition WHERE user_id=? AND date=CURDATE()",
      [userId]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE user_daily_nutrition 
         SET calories = calories + ?, sugar = sugar + ?, protein = protein + ?, carbs = carbs + ?, fat = fat + ?, sodium = sodium + ?
         WHERE user_id=? AND date=CURDATE()`,
        [calories, sugar, protein, carbs, fat, sodium, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO user_daily_nutrition (user_id, date, calories, sugar, protein, carbs, fat, sodium)
         VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?)`,
        [userId, calories, sugar, protein, carbs, fat, sodium]
      );
    }

    res.json({ message: "Nutrition data updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /today -> return today's nutrition summary for the logged-in user
exports.getTodayNutrition = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT calories, sugar, protein, carbs, fat, sodium, cholesterol, calcium, iron, vitamin_c
       FROM user_daily_nutrition
       WHERE user_id = ? AND date = CURDATE()`,
      [userId]
    );

    if (rows.length === 0) {
      // return zeros if nothing recorded today (keeps frontend simple)
      return res.json({
        calories: 0,
        sugar: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sodium: 0,
        cholesterol: 0,
        calcium: 0,
        iron: 0,
        vitamin_c: 0,
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getTodayNutrition error:", err);
    res.status(500).json({ error: err.message });
  }
};
