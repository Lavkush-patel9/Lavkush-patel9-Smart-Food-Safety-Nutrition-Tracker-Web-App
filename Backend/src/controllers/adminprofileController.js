const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const adminId = req.user?.id; // JWT se aayega

    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM admin WHERE id = ?",
      [adminId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};