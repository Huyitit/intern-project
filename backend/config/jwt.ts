import jwt from 'jsonwebtoken';
import { config } from './env'

export const generateToken = (payload: object) => {
    console.log(config.expiredTime);
    return jwt.sign(payload, config.secretKey, 
        {expiresIn: config.expiredTime, algorithm: "HS256"});
};

export const verifyToken = (token:string|undefined) => {
    return jwt.verify(token || "", config.secretKey);
}
