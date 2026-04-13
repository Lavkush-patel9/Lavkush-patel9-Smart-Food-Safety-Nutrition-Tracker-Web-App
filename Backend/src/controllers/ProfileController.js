// Backend/src/controllers/ProfileController.js
const db = require("../config/db");
const path = require("path");
const fs = require("fs");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware (decoded JWT)
    
    // ✅ age और health_condition को SELECT क्वेरी में जोड़ा गया
    const [rows] = await db.query(
      "SELECT id, username AS name, email, role, created_at, profile_Image, age, health_condition FROM users WHERE id = ? limit 1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ age और health_condition को req.body से निकाला गया
    const { username, email, age, health_condition } = req.body;
    let imagePath = null;

    // 🔹 If new image uploaded
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      const [oldImg] = await db.query(
        "SELECT profile_image FROM users WHERE id = ?",
        [userId]
      );
      if (oldImg.length && oldImg[0].profile_image) {
        const oldPath = path.join(__dirname, "..", oldImg[0].profile_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    // 🔹 Update DB (age और health_condition को शामिल करते हुए)
    if (imagePath) {
      await db.query(
        "UPDATE users SET username = ?, email = ?, profile_image = ?, age = ?, health_condition = ? WHERE id = ?",
        [username, email, imagePath, age, health_condition, userId]
      );
    } else {
      await db.query(
        "UPDATE users SET username = ?, email = ?, age = ?, health_condition = ? WHERE id = ?",
        [username, email, age, health_condition, userId]
      );
    }
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's logs first
    await db.query("DELETE FROM user_logs WHERE user_id = ?", [userId]);

    // Then delete user
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};
