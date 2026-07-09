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
        const sortBy = String(req.params.sortBy);
        const order = String(req.params.order);
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
                    [sortBy]: order
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
                res.status(404).json({
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

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            })

        } catch (error) {
            res.status(501).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}