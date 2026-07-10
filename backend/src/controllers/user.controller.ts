import { hash } from "bcrypt"
import prisma from "../../config/prisma";
import {Request, Response} from 'express';
import { number } from "zod";


export default class userController{

    // get users with pagination
    static getUsers = async (req:Request, res: Response) => {
        
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);  
        const keyword = String(req.query.keyword);
        const sort = String(req.query.sortBy);
        const order = String(req.query.order);
        console.log(sort, "and", order);
        try {

            const result = await prisma.users.findMany({
                select:{
                    id: true,
                    full_name: true,
                    username: true,
                    phone: true,
                    email: true,
                    role: true,
                    create_at: true
                },

                where:{
                    role: "user",
                    username:{
                        contains: keyword
                    }
                },

                orderBy:{
                    [sort]: order
                },

                take: limit,
                skip: (page-1)*limit
            })
            
            if(result.length === 0)
            {
                return res.status(403).json({
                    success: false,
                    message: "No more users"
                });
            }
            
            return res.status(201).json({
                success: true,
                users: result
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
        
    }

    // get a user by id
    static getUserById = async (req: Request, res: Response) => {

        const {id} = (req.params);

        try {
            const result = await prisma.users.findUnique({
                where: {
                    id: Number(id),
                    role: "user"
                },

                select:{
                    id: true,
                    full_name: true,
                    username: true,
                    phone: true,
                    email: true,
                    role: true
                }
            })

            if(!result)
            {
                return res.status(404).json({
                    success: false,
                    message: "Cannot find user"
                });
            }

            return res.status(201).json({
                success: true,
                user: result
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    // create a user
    static createUser = async (req: Request, res: Response) => {
        
        const {user} = req.body;

        // check if username already exists
        if(user.username)
        {
            const existingUser = await prisma.users.findUnique({where: {username: user.username}});

            if(existingUser)
            {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }

        try {
            // create new user
            // hash password
            const hashed_password = await hash(user.password, 4);
            user.hashed_password = hashed_password;

            const newUser = await prisma.users.create({
                data: user,
                select:
                {
                    id: true,
                    full_name: true,
                    username: true,
                    phone: true,
                    email: true,
                    role: true,
                    create_at: true
                }
            })

            return res.status(200).json({
                success: true,
                user: newUser
            })
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });

        }
    }

    // update a user
    static updateUserById = async (req: Request, res: Response) => {

        const {user} = req.body;

        if(!user)
        {
            return res.status(400).json({message: "Please provide data to update"});
        }

        // check if user is exists
        const currentUser = await prisma.users.findUnique({
            where: {id: Number(user.id)}
        });

        if(!currentUser)
        {
            return res.status(404).json({
                success: false,
                message: "Cannot find user"
            });
        }

        // update user
        try {

            const updatedUser = await prisma.users.update({
                where: {id: Number(user.id)},
                data: user,
                select:
                {
                    id: true,
                    full_name: true,
                    username: true,
                    phone: true,
                    email: true,
                    role: true
                }
            })

            return res.status(200).json({
                success: true,
                user: updatedUser
            })
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
    
    // delete a user
    static deleteUserById = async (req: Request, res: Response) => {

        const {id} = (req.params);

        try {
            
            const deletedUser = await prisma.users.delete({
                where: {id: Number(id)},
            })

            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    // upload avatar
    static uploadAvatar = async (req: Request, res: Response) => {

        const id = Number(req.params.id); 
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image provided"
            });
        }

        const avatar_url = `/uploads/avatars/${req.file.filename}`;

        try {
            await prisma.users.update({
                where: { id: id },
                data: { avatar_url }
            });

            return res.status(200).json({
                success: true,
                message: "Avatar uploaded successfully",
                avatar_url
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}