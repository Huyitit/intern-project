import express from "express";
// import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
const authRoutes = express.Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
export default authRoutes;