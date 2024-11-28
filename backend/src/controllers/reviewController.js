const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createReview = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        businessId: parseInt(businessId),
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

const getReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await prisma.review.findMany({
      where: {
        businessId: parseInt(businessId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (existingReview.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this review" });
    }

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { rating, comment },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (existingReview.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        business: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const getFilteredAndSortedReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { rating, sortBy = "createdAt", order = "desc" } = req.query;

    const where = {
      businessId: parseInt(businessId),
    };

    // Add rating filter if provided
    if (rating) {
      where.rating = parseInt(rating);
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        business: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order.toLowerCase(),
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching filtered reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  getFilteredAndSortedReviews,
};
