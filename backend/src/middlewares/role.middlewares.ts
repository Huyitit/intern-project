import {Request, Response, NextFunction} from 'express';
import { NetConnectOpts } from 'node:net';

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) =>{
    if(!req.body.role)
    {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

    const role = req.body.role;
    if(role === "admin")
    {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action"
    });

}

export const checkOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {

    const {id} = req.params;

    const trueId = req.body.id;

    if(req.body.role === "admin" || Number(id) === trueId)
    {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "You do not have permission to update this profile"
    });
}