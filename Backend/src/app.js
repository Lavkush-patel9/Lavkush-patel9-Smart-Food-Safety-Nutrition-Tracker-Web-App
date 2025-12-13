// Backend/src/app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("./config/db"); // database connection
const app = express();

app.use(cors());
app.use(express.json());

// simple test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const logRoutes = require("./routes/logRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const userRoutes = require("./routes/ProfileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userLogs = require("./routes/userLogs");
const nutritionRoutes = require("./routes/nutritionRoutes");
const addProduct = require("./routes/productRoutes");
const uploads = express.static("uploads");

// use routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/products", productRoutes); // Product routes
app.use("/api/logs", logRoutes); // Logs routes
app.use("/api/ocr", ocrRoutes); // OCR routes
app.use("/api/user", userRoutes); // Profile routes
app.use("/api/admin", adminRoutes); // Admin routes
app.use("/user", userLogs); // User Logs routes
app.use("/api/nutrition", nutritionRoutes); // Nutrition routes
app.use("/api/products", addProduct); // admin add product route
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from uploads folder

const PORT = process.env.PORT || 5000;

// Bind explicitly to 127.0.0.1
app.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
