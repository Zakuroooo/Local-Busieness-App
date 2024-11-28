// src/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to log in an existing user
router.post("/login", loginUser);

// Protected route to get user profile (requires authentication)
router.get("/profile", authenticateUser, getUserProfile);

module.exports = router;
