import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

import path from "path";

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("Health check OK!");
  res.json({ message: "Health check OK!" });
});

export default app;