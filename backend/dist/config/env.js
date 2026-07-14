"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    //server
    port: process.env.PORT || 3000,
    //jwt
    secretKey: process.env.SECRET_KEY || "default value",
    expiredTime: Number(process.env.KEY_EXPIRED_TIME) || 3600,
    // database 
    dbUrl: process.env.dbUrl || "",
    dbUser: process.env.DATABASE_USER || "",
    dbPass: process.env.DATABASE_PASSWORD || "",
    dbName: process.env.DATABASE_NAME || "",
    dbHost: process.env.DATABASE_HOST || "",
    dbPost: process.env.DATABASE_PORT || "",
};
