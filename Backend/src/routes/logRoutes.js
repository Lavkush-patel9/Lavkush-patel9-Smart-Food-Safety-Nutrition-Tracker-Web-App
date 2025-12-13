// Backend/src/routes/logRoutes.js
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { verifyToken } = require("../middleware/authMiddleware"); // for protect logs
// const { addProductFromBarcode } = require("../controllers/logController");

router.post("/add", verifyToken, logController.addLog); // only loged-in user
router.get("/all", verifyToken, logController.getLogs); // only own logs
router.delete("/:id", verifyToken, logController.deleteLog); // only own logs
// POST route to add product using barcode
// router.post("/add-from-barcode", addProductFromBarcode);

module.exports = router;
