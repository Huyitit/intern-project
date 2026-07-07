import {Request, Response, NextFunction} from 'express';
import { NetConnectOpts } from 'node:net';

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) =>{
    
    if(!req.body.role)
    {
        return res.status(401).json({message: "role is required"});
    }

    const role = req.body.role;
    if(role === "admin")
    {
        return next();
    }

    return res.status(403).json({message: "Only admin has permission"});

}

export const checkOwner = (req: Request, res: Response, next: NextFunction) => {

    const {id} = req.params;

    const trueId = req.body.id;

    if(req.body.role === "admin" || Number(id) === trueId)
    {
        return next();
    }

    res.status(403).json({messave: "You do not have permission to update this profile"});
}