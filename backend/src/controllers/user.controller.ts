import { hash } from "bcrypt"
import prisma from "../../config/prisma";
import {Request, Response} from 'express';
import { number } from "zod";


export default class userController{

    // get users with pagination
    static getUsers = async (req:Request, res: Response) => {
        
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);  

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
                    role: "user"
                },

                take: limit,
                skip: (page-1)*limit
            })

            if(!result)
            {
                res.status(500).json({message:"Cannot find any user"});
            }

            res.status(202).json({
                success: true,
                data: result
            })
        } catch (error) {
            return res.status(500).json({message: error});
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
                res.status(500).json({message:"Cannot find user"});
            }

            res.status(202).json({
                success: true,
                data: result
            })
        } catch (error) {
            return res.status(500).json({message: error});
        }
    }

    // create a user
    static createUser = async (req: Request, res: Response) => {
        
        const {data} = req.body;

        // check if username already exists
        if(data.username)
        {
            const existingUser = await prisma.users.findUnique({where: {username: data.username}});

            if(existingUser)
            {
                return res.status(500).json({message: "Username already exists"});
            }
        }

        try {
            // create new user
            // hash password
            const hashed_password = await hash(data.password, 4);
            data.hashed_password = hashed_password;

            const newUser = await prisma.users.create({
                data: data,
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
                data: newUser
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: error});

        }
    }

    // update a user
    static updateUserById = async (req: Request, res: Response) => {

        const {id} = req.params;
        const {data} = req.body;

        if(!data)
        {
            return res.status(400).json({message: "Please provide data to update"});
        }

        // check if user is exists
        const user = await prisma.users.findUnique({
            where: {id: Number(id)}
        });

        if(!user)
        {
            return res.status(500).json({message: "Cannot find user"});
        }

        // update user
        try {

            const updatedUser = await prisma.users.update({
                where: {id: Number(id)},
                data: data,
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
                data: updatedUser
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: error});
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
            res.status(500).json({message: error});
        }
    }
}