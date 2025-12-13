// Backend/src/config/db.js
const mysql = require("mysql2/promise"); // promise-based
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// test the connection
(async () => {
  try {
    await pool.query("SELECT 1"); // simple test query
    console.log("Database connected");
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
})();

// log the database name
(async () => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    console.log("✅ Connected to Database:", rows[0].db);
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
})();

module.exports = pool; // use promise for async/await
