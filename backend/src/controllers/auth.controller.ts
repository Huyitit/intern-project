import prisma from "../../config/prisma";
import {Request, Response} from "express";
import {generateToken} from "../../config/jwt";
import {hash, compare} from 'bcrypt';



export default class authController{

    // register new user with username, password, email, phone, name and role
    static register = async (req: Request, res: Response) => {
        
        console.log("req comes");
        let {data} = req.body;

        //find existed user
        const existedUser = await prisma.users.findUnique({
            where: {username: data.username},
        });

        if(existedUser)
        {
            return res.status(400).json({message: "User existed"});
        }
        
        // add new user
        try {   

            // hash password
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
            res.status(500).json({
                message: "error in register",
                error: error});
            console.log(error);
        }
    }

    // login with username and password
    static login = async (req: Request, res: Response) => {

        let {data} = req.body;
        const username = data.username;
        const password = data.password;

        // find user
        const currentUser = await prisma.users.findUnique({
            where: {username},
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

        if(currentUser  === null)
        {   
            return res.status(404).json({message: "Cannot find user"});
        }

        // check password
        const validPassword = await compare(password, currentUser.hashed_password);
        
        if(!validPassword)
        {
            return res.status(404).json({message: "Invalid password"});
        }
        
        // token saves user information (id, role, username, email, phone, name)
        currentUser.hashed_password = "";
        console.log("data", currentUser);
        const token = generateToken(currentUser);

        res.status(200).json({
            success: true,
            data: {
                id: currentUser.id,
                full_name: currentUser.full_name,
                username: currentUser.username,
                phone: currentUser.phone,
                email: currentUser.email,
                role: currentUser.role
            },
            token: token
        })
        
    } 
}