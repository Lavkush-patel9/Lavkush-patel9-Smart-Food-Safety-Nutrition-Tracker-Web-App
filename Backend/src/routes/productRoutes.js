const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProducts,
  getProductById,
  deleteIncompleteProducts,
  deleteProductById,
  searchProducts,
  filterProducts,
} = require("../controllers/productController");

const { verifyToken } = require("../middleware/authMiddleware"); // JWT verification
const verifyAdmin = require("../middleware/adminMiddleware"); // admin verification

router.get("/", getProducts); // anyone can see products
router.post("/add", verifyToken, verifyAdmin, addProducts); // only admin add products
router.delete("/delete", verifyToken, verifyAdmin, deleteIncompleteProducts); // only admin delete all products
router.get("/search", searchProducts);
router.get("/filter", filterProducts);
router.get("/:id",  verifyToken, getProductById); //user + admin both
router.delete("/:id", verifyToken, verifyAdmin, deleteProductById);


module.exports = router;
