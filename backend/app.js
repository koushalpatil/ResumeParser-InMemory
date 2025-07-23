import express from "express";
import corsMiddleware from "./middleware/corsMiddleware.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import config from "./config/config.js";

const app = express();

app.use(requestLogger);
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", resumeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.app.port;
const server = app.listen(PORT, () => {
  console.log("Server started at port - ", PORT);
});

export default app;
