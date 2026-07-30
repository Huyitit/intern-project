import { z } from 'zod';

/**
 * Base User Object Schema for CRUD operations
 */
export const userObjectSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  username: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  role: z.enum(['admin', 'user']),
  create_at: z.string().or(z.date()).optional(),
});

/**
 * Response Schema for GET /api/users
 */
export const getUsersResponseSchema = z.object({
  success: z.boolean(),
  users: z.array(userObjectSchema),
  message: z.string().optional(),
  info: z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    total: z.number().optional(),
    totalPages: z.number().optional(),
  }).optional()
});

/**
 * Response Schema for GET /api/users/:id
 */
export const getUserByIdResponseSchema = z.object({
  success: z.boolean(),
  user: userObjectSchema,
});

/**
 * Response Schema for POST /api/users
 */
export const createUserResponseSchema = z.object({
  success: z.boolean(),
  user: userObjectSchema,
});

/**
 * Response Schema for PUT /api/users/:id
 */
export const updateUserResponseSchema = z.object({
  success: z.boolean(),
  user: userObjectSchema,
});

/**
 * Response Schema for DELETE /api/users/:id
 */
export const deleteUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const validationErrorItemSchema = z.object({
  message: z.string(),
  code: z.string(),
});

/**
 * Error Schema for API authentication / validation failures (400, 401, 409, 422, 500)
 */
export const crudErrorResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  errors: z.array(validationErrorItemSchema),
});
