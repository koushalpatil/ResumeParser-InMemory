import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  ai: {
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL,
  },
  upload: {
    destination: "uploads/",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["application/pdf"],
  },
};

export default config;
