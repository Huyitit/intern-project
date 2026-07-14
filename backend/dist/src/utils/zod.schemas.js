"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            full_name: zod_1.z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: zod_1.z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: zod_1.z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long"),
            phone: zod_1.z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").optional(),
            email: zod_1.z.email().nullish(),
            role: zod_1.z.enum(['user'])
        })
    })
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            username: zod_1.z.string().min(6, "username must be at least 6 characters long").lowercase(),
            password: zod_1.z.string().min(6, "password must be at least 6 characters long"),
        })
    })
});
exports.userSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            full_name: zod_1.z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: zod_1.z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: zod_1.z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long").nullish(),
            phone: zod_1.z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").nullish(),
            email: zod_1.z.email().nullish(),
            role: zod_1.z.enum(['user', 'admin']),
        })
    })
});
