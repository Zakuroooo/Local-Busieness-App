const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Add some default categories if needed
const createDefaultCategories = async () => {
  const defaultCategories = [
    // Food & DiningZ
    "Restaurants & Cafes",
    "Fast Food",
    "Bakery",

    // Shopping
    "Retail Stores",
    "Grocery & Supermarket",
    "Fashion & Clothing",

    // Services
    "Professional Services",
    "Beauty & Spa",
    "Auto Services",

    // Healthcare
    "Healthcare & Medical",
    "Fitness & Wellness",
    "Pharmacy",

    // Entertainment
    "Entertainment & Recreation",
    "Arts & Culture",

    // Education
    "Education & Training",
    "Tutoring",

    // Technology
    "IT & Technology",

    // Others
    "Home Services",
    "Travel & Hotels",
  ];

  try {
    for (const name of defaultCategories) {
      await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log("Default categories created successfully");
  } catch (error) {
    console.error("Error creating default categories:", error);
  }
};

module.exports = {
  getCategories,
  createDefaultCategories,
};
