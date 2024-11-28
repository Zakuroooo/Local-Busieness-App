const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new business listing
const createBusiness = async (req, res) => {
  try {
    const { name, description, address, location, category } = req.body;

    // Debug log to check user data
    console.log("User from request:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the category by name
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        address,
        location,
        categoryId: categoryRecord.id,
        ownerId: req.user.userId,
      },
      include: {
        category: true,
        owner: true,
      },
    });

    res.status(201).json(business);
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({
      message: "Error creating business",
      error: error.message,
    });
  }
};

// Get businesses with optional filters and sorting
const getFilteredAndSortedBusinesses = async (req, res) => {
  const {
    categoryId,
    location,
    sortBy = "createdAt",
    order = "asc",
  } = req.query;

  try {
    const filters = {};
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (location) filters.location = { contains: location };

    const sortOptions = { [sortBy]: order === "desc" ? "desc" : "asc" };

    const businesses = await prisma.business.findMany({
      where: filters,
      orderBy: sortOptions,
      include: { category: true, reviews: true },
    });
    console.log(businesses);
    res.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
};

// Get a single business by ID
const getBusinessById = async (req, res) => {
  const { id } = req.params;

  try {
    const business = await prisma.business.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, reviews: true },
    });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({ error: "Failed to fetch business" });
  }
};

// Update a business listing (ownership validation)
const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, location, category } = req.body;

    // Debug log
    console.log("Updating business:", { id, updateData: req.body });

    // First, find the category by name
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Verify business exists and user owns it
    const existingBusiness = await prisma.business.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (existingBusiness.ownerId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this business" });
    }

    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
        address,
        location,
        categoryId: categoryRecord.id,
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json(updatedBusiness);
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({
      message: "Failed to update business",
      error: error.message,
    });
  }
};

// Delete a business listing (ownership validation)
const deleteBusiness = async (req, res) => {
  const { id } = req.params;

  try {
    const business = await prisma.business.findUnique({
      where: { id: parseInt(id) },
    });

    if (!business || business.ownerId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this business." });
    }

    await prisma.business.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ error: "Failed to delete business" });
  }
};

// Get businesses for logged-in admin
const getAdminBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: req.user.userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(businesses);
  } catch (error) {
    console.error("Error fetching admin businesses:", error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
};

module.exports = {
  createBusiness,
  getFilteredAndSortedBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getAdminBusinesses,
};
