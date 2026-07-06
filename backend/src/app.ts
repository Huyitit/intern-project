import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  console.log("Health check OK!");
  res.json({ message: "Health check OK!" });
});

export default app;