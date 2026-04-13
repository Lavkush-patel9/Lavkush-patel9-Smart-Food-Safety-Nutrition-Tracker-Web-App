const pool = require("../config/db");

// USER SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN GET ALL MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contact_messages ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN REPLY
exports.replyMessage = async (req, res) => {
  try {
    const { id, reply } = req.body;

    await pool.query(
      "UPDATE contact_messages SET reply=?, status='replied' WHERE id=?",
      [reply, id]
    );

    res.json({ message: "Reply sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};