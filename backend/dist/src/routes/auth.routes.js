"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const zod_schemas_1 = require("../utils/zod.schemas");
// import authMiddleware from "../middlewares/auth.middleware";
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRoutes = express_1.default.Router();
authRoutes.post('/login', (0, validate_middleware_1.validate)(zod_schemas_1.loginUserSchema), auth_controller_1.default.login);
authRoutes.post('/register', (0, validate_middleware_1.validate)(zod_schemas_1.registerUserSchema), auth_controller_1.default.register);
exports.default = authRoutes;
