import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { registerUserSchema, loginUserSchema } from "../utils/zod.schemas";

// import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
const authRoutes = express.Router();

authRoutes.post('/login', validate(loginUserSchema), authController.login);
authRoutes.post('/register', validate(registerUserSchema), authController.register);

export default authRoutes;