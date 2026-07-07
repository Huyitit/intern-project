import { Request, Response, NextFunction } from "express";
import { verifyToken} from "../../config/jwt";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization;
    const token = header?.split(" ")[1];

    if(!token)
    {
        return res.status(400).json({message:"token is required"});
    }

    try {

        const decoded = verifyToken(token) as {role: string, id: number};
        
        req.body = req.body || {};
        req.body.role = decoded.role;
        req.body.id = decoded.id;
        
        next();

    } catch (error) {
        
        console.log("error: ", error);
        return res.status(403).json({error: error});
    }
}