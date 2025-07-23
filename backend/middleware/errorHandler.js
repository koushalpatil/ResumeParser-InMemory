import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum size allowed is 5MB.",
        code: "FILE_TOO_LARGE",
      });
    }
    return res.status(400).json({
      error: "File upload error: " + err.message,
      code: "UPLOAD_ERROR",
    });
  }

  if (err.message.includes("Only PDF files are allowed")) {
    return res.status(400).json({
      error: "Only PDF files are allowed.",
      code: "INVALID_FILE_TYPE",
    });
  }

  res.status(500).json({
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
    code: "INTERNAL_ERROR",
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    code: "NOT_FOUND",
  });
};
