import userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from '../middlewares/auth.middlewares';
import { checkAdminRole, checkOwner } from "../middlewares/role.middlewares";
import { registerUserSchema, loginUserSchema, userSchema } from "../utils/zod.schemas";
import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/', authenticate, checkAdminRole, userController.getUsers);
userRoutes.get('/:id', authenticate, userController.getUserById);
userRoutes.post('/', authenticate, checkAdminRole, validate(registerUserSchema), userController.createUser);
userRoutes.put('/:id', authenticate, checkOwner, validate(userSchema), userController.updateUserById);
userRoutes.delete('/:id', authenticate, checkAdminRole, userController.deleteUserById);

export default userRoutes;
