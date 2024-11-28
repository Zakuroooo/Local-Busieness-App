const express = require("express");
const {
  createBusiness,
  getBusinesses,
  getFilteredAndSortedBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getAdminBusinesses,
} = require("../controllers/businessController");
const {
  authenticateUser,
  requireAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin routes - must come before generic routes to avoid conflicts
router.get(
  "/admin/my-businesses",
  authenticateUser,
  requireAdmin,
  getAdminBusinesses
);

// Protected routes - only authenticated admins can access
router.post("/", authenticateUser, requireAdmin, createBusiness);
router.put("/:id", authenticateUser, requireAdmin, updateBusiness);
router.delete("/:id", authenticateUser, requireAdmin, deleteBusiness);

// Public routes - anyone can view businesses
router.get("/", getFilteredAndSortedBusinesses);
router.get("/:id", getBusinessById);

module.exports = router;
