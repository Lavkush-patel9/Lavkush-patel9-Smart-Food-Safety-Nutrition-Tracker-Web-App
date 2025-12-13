const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const ADMIN_SECRET = process.env.ADMIN_SECRET || "myAdmin@123"; // keep consistent

// 🟢 Signup Controller
exports.signup = async (req, res) => {
  const { username, email, password, role, secretKey } = req.body;

  try {
    let finalRole = "user";

    if (role === "admin") {
      if (secretKey === ADMIN_SECRET) {
        finalRole = "admin";
      } else {
        return res.status(400).json({ message: "Invalid Admin Secret Key" });
      }
    }

    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🧩 Signup: Hashed Password =", hashedPassword);

    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, finalRole]
    );

    console.log(`✅ ${finalRole.toUpperCase()} registered: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("\n----------------------");
    console.log("🔐 Login attempt for:", email);
    console.log("🔹 Password received:", password);

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    console.log("✅ User found:", user.email);
    console.log("🔹 Stored hash (first 50 chars):", user.password.slice(0, 50));
    console.log("🔹 Hash length:", user.password.length);

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 bcrypt.compare() result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      console.log("----------------------\n");
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ Login successful for:", user.email);
    console.log("✅ Role:", user.role);
    console.log("----------------------\n");

    // ✅ Send response with role
    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("💥 Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
