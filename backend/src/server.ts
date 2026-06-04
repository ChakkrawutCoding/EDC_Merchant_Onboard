import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthRoute from "./routes/health.route";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/health", healthRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});