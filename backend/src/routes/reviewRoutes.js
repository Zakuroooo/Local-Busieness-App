const express = require("express");
const {
  createReview,
  getFilteredAndSortedReviews,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to get all reviews
router.get("/all", getAllReviews);

// Route to get reviews for a specific business with filtering and sorting
router.get("/:businessId", getFilteredAndSortedReviews);

// Route to create a new review
router.post("/:businessId", authenticateUser, createReview);

// Route to update a review
router.put("/:id", authenticateUser, updateReview);

// Route to delete a review
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
