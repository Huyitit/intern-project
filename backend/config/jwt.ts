import jwt from 'jsonwebtoken';
import { config } from './env'

export const generateToken = (payload: object) => {
    return jwt.sign(payload, config.secretKey, 
        {expiresIn: config.expiredTime});
};

export const verifyToken = (token:string|undefined) => {
    return jwt.verify(token || "", config.secretKey);
}
