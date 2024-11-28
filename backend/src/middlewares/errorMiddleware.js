const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      message: "Invalid data provided",
      error: err.message,
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      message: "Database operation failed",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
};

module.exports = errorHandler;
