const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  replyMessage
} = require("../controllers/contactController");

const { verifyToken } = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");

// USER
router.post("/send", sendMessage);

// ADMIN
router.get("/all", verifyToken, verifyAdmin, getMessages);
router.post("/reply", verifyToken, verifyAdmin, replyMessage);

module.exports = router;