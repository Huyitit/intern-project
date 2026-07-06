import prisma from "../../config/prisma";
import {Request, Response} from "express";
import {generateToken} from "../../config/jwt";
import {hash, compare} from 'bcrypt'
export default class authController{

    static login = async (req: Request, res: Response) => {
        let {data} = req.body;
        const username = data.username;

        // find user
        const currentUser = await prisma.users.findUnique({
            where: {username},
        })

        if(currentUser  === null)
        {   
            return res.status(403).json({message: "invalid username"});
        }
        else 
        {
        // generate token
            const token = generateToken(currentUser);  
            res.status(200).json({
                success: true,
                data: currentUser,
                token: token
            })
        }
    } 

    static register = async (req: Request, res: Response) => {
        console.log("req comes");
        let {data} = req.body;
        const username = data.username;
        //find existed user

        const existedUser = await prisma.users.findUnique({
            where: {username},
        });

        if(existedUser)
        {
            return res.status(405).json({message: "User existed"});
        }

        // add new user
        
        try {   

            const hashed_password = await hash(data.password, 4);
            data.hashed_password = hashed_password;
            const newUser = await prisma.users.create({data:data});

            if(newUser)
            {
                res.status(201).json(
                    {
                        success: true,
                        data: {
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
        } catch (error) {
            res.json({error: error});
            console.log(error);
        }
    }
}