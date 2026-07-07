import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { z } from 'zod';

type MiddlewareFunction = (
    req: Request, 
    res: Response,
    next: NextFunction
) => void;

type ValidateInput = (
    schema: z.ZodObject<{
        body?: z.ZodTypeAny,
        params?: z.ZodTypeAny,
        query?: z.ZodTypeAny
    }>
) => MiddlewareFunction; 

export const validate: ValidateInput = (schema): MiddlewareFunction => (req, res, next) => {
    
    // validate input
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    });

    if(!result.success)
    {
        return res.status(400).json({
            success: false,
            message: "invalid input",
            errors: result.error.issues.map((i)=>({
                error_message: i.message,
                code: i.code
            }))
        });
    }
    
    next();
}