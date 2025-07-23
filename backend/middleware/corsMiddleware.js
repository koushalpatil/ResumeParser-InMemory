import cors from "cors";
import config from "../config/config.js";

const corsOptions = {
  origin:
    config.app.env === "development"
      ? "*"
      : process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : [],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOptions);
