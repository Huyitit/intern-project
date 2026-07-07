import jwt from 'jsonwebtoken';
import { config } from './env'

export const generateToken = (payload: object) => {
    return jwt.sign(payload, config.secretKey, 
        {expiresIn: "12h", algorithm: "HS384"});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.secretKey);
}
