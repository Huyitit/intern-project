"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const jwt_1 = require("../../config/jwt");
const bcrypt_1 = require("bcrypt");
class authController {
}
_a = authController;
// register new user with username, password, email, phone, name and role
authController.register = async (req, res) => {
    console.log("req comes");
    let { user } = req.body;
    //find existed user
    const existedUser = await prisma_1.default.users.findUnique({
        where: { username: user.username },
    });
    if (existedUser) {
        return res.status(409).json({ message: "User existed" });
    }
    // add new user
    try {
        // hash password
        const hashed_password = await (0, bcrypt_1.hash)(user.password, 4);
        user.hashed_password = hashed_password;
        const newUser = await prisma_1.default.users.create({ data: user });
        if (newUser) {
            return res.status(201).json({
                success: true,
                user: {
                    id: newUser.id,
                    full_name: newUser.full_name,
                    username: newUser.username,
                    phone: newUser.phone,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// login with username and password
authController.login = async (req, res) => {
    let { user } = req.body;
    const username = user.username;
    const password = user.password;
    // find user
    try {
        const currentUser = await prisma_1.default.users.findUnique({
            where: { username },
            select: {
                id: true,
                full_name: true,
                username: true,
                phone: true,
                email: true,
                role: true,
                hashed_password: true
            }
        });
        if (currentUser === null) {
            return res.status(409).json({
                success: false,
                message: "Cannot find user"
            });
        }
        // check password
        const validPassword = await (0, bcrypt_1.compare)(password, currentUser.hashed_password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        // token saves user information (id, role, username, email, phone, name)
        currentUser.hashed_password = "";
        const token = (0, jwt_1.generateToken)(currentUser);
        return res.status(200).json({
            success: true,
            user: {
                id: currentUser.id,
                full_name: currentUser.full_name,
                username: currentUser.username,
                phone: currentUser.phone,
                email: currentUser.email,
                role: currentUser.role
            },
            token: token
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.default = authController;
