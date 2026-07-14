import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    console.log("req.body", req.body);
    if (!token) {
        return res.status(406).json({
            success: false,
            message: "Token is required"
        });
    }

    try {

        const decoded = verifyToken(token) as { role: string, id: number };

        req.body = req.body || {};
        req.body.role = decoded.role;
        req.body.id = decoded.id;
        // console.log("request's body", req.body);
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Token is expired or invalid"
        });
    }
}