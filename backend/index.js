// index.js
const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const businessRoutes = require("./src/routes/businessRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const cors = require("cors");
require("dotenv").config();
const {
  createDefaultCategories,
} = require("./src/controllers/categoryController");
const errorHandler = require("./src/middlewares/errorMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

// Connect routes
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await createDefaultCategories();
});

// Error handling middleware should be last
app.use(errorHandler);

module.exports = app;
