const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const logRoutes = require("./routes/logRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const userRoutes = require("./routes/ProfileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const adminprofileRoutes = require("./routes/adminprofileRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/logs", logRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/adminpro", adminprofileRoutes);
app.use("/api/contact", contactRoutes);

// ✅ स्टैटिक इमेज पाथ फिक्स
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
<<<<<<< HEAD
  console.log(`🚀 Server running on port ${PORT}`);
=======
  console.log(`Server running on port ${PORT}`);
>>>>>>> 9fa8a7f (fix build error)
});
