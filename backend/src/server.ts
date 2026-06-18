import "dotenv/config";
import { connectDatabase } from "./config/database";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route";
import healthRoute from "./routes/health.route";
import formsRoute from "./routes/forms.route";

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
app.use("/auth", authRoute);
app.use("/forms", formsRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const port = process.env.PORT || 4000;

async function bootstrap() {
    await connectDatabase();

    app.listen(port, () => {
        console.log(`Backend server is running on http://localhost:${port}`);
    });
}

bootstrap().catch((error) => {
    console.error("Failed to start backend server:", error);
    process.exit(1);
});