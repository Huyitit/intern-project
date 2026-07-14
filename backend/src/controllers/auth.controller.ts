import prisma from "../config/prisma";
import { Request, Response } from "express";
import { generateToken } from "../config/jwt";
import { hash, compare } from 'bcrypt';



export default class authController {

    // register new user with username, password, email, phone, name and role
    static register = async (req: Request, res: Response) => {

        console.log("req comes");
        let { user } = req.body;

        //find existed user
        const existedUser = await prisma.users.findUnique({
            where: { username: user.username },
        });

        if (existedUser) {
            return res.status(409).json({ message: "User existed" });
        }

        // add new user
        try {

            // hash password
            const hashed_password = await hash(user.password, 4);
            user.hashed_password = hashed_password;

            const newUser = await prisma.users.create({ data: user });

            if (newUser) {
                return res.status(201).json(
                    {
                        success: true,
                        user: {
                            id: newUser.id,
                            full_name: newUser.full_name,
                            username: newUser.username,
                            phone: newUser.phone,
                            email: newUser.email,
                            role: newUser.role
                        }
                    }
                )
            }

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    // login with username and password
    static login = async (req: Request, res: Response) => {

        let { user } = req.body;
        const username = user.username;
        const password = user.password;

        // find user
        try {
            const currentUser = await prisma.users.findUnique({
                where: { username },
                select:
                {
                    id: true,
                    full_name: true,
                    username: true,
                    phone: true,
                    email: true,
                    role: true,
                    hashed_password: true
                }
            })

            if (currentUser === null) {
                return res.status(409).json({
                    success: false,
                    message: "Cannot find user"
                });
            }

            // check password
            const validPassword = await compare(password, currentUser.hashed_password);

            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            // token saves user information (id, role, username, email, phone, name)
            currentUser.hashed_password = "";

            const token = generateToken(currentUser);

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
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}