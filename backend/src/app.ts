import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("Health check OK!");
  res.json({ message: "Health check OK!" });
});

export default app;