import {z} from 'zod';

export const registerUserSchema = z.object(
    {
        body: z.object({
            user: z.object({
            full_name: z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long"),
            phone: z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").optional(),
            email: z.email().nullish(),
            role: z.enum(['user', 'admin'])
            })
        })
    }
);

export const loginUserSchema = z.object({
    body: z.object({
        user: z.object({
        username: z.string().min(6, "username must be at least 6 characters long").lowercase(),
        password: z.string().min(6, "password must be at least 6 characters long"),
    })
})
});

export  const userSchema = z.object({
    body: z.object(
        {
            user: z.object({
            full_name: z.string().min(6, "full name must be at least 6 characters long").max(20, "full name must be at most 20 characters long"),
            username: z.string().min(6, "username must be at least 6 characters long").max(20, "username must be at most 20 characters long"),
            password: z.string().min(6, "password must be at least 6 characters long").max(20, "password must be at most 20 characters long").nullish(),
            phone: z.string().min(10, "phone must be at least 10 digits long").max(15, "phone must be at most 15 digits long").nullish(),
            email: z.email().nullish(),
            role: z.enum(['user', 'admin']),
        })
    })
});