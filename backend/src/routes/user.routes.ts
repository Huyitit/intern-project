import userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from '../middlewares/auth.middlewares';
import { checkAdminRole, checkOwnerOrAdmin } from "../middlewares/role.middlewares";
import { registerUserSchema, userSchema } from "../utils/zod.schemas";
import express from 'express';

import { uploadAvatarMiddleware, uploadCsvMiddleware, parseCsvMiddleware } from "../middlewares/upload.middleware";

const userRoutes = express.Router();

userRoutes.get('/', authenticate, checkAdminRole, userController.getUsers);
userRoutes.get('/export', authenticate, checkAdminRole, userController.exportUsersSlow);
userRoutes.get('/:id', authenticate, checkOwnerOrAdmin, userController.getUserById);

userRoutes.post('/', authenticate, checkAdminRole, validate(registerUserSchema), userController.createUser);
userRoutes.post('/:id/csv', authenticate, checkOwnerOrAdmin, uploadCsvMiddleware.single('csv'), parseCsvMiddleware, validate(userSchema), userController.updateUserById);

userRoutes.put('/:id', authenticate, checkOwnerOrAdmin, validate(userSchema), userController.updateUserById);
userRoutes.put('/:id/avatar', authenticate, checkOwnerOrAdmin, uploadAvatarMiddleware.single('avatar'), userController.uploadAvatar);

userRoutes.delete('/:id', authenticate, checkAdminRole, userController.deleteUserById);

export default userRoutes;
