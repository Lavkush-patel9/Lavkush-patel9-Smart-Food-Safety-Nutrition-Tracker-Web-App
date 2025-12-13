const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const pool = require("../config/db");

router.get("/logs", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_logs WHERE user_id = ? ORDER BY date DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
