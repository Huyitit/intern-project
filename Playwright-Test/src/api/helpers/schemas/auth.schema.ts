import { z } from 'zod';

/**
 * Base User Schema in Authentication Responses
 */
export const baseAuthUserSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  username: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  role: z.enum(['admin', 'user']),
});

/**
 * Response Schema for POST /api/auth/register (201 Created)
 */
export const registerResponseSchema = z.object({
  success: z.boolean().optional(),
  user: baseAuthUserSchema,
});

/**
 * Response Schema for POST /api/auth/login (200 OK)
 */
export const loginResponseSchema = z.object({
  success: z.boolean().optional(),
  user: baseAuthUserSchema,
  token: z.string().min(1, 'Token must not be empty'),
});

/**
 * Error Item Schema for validation errors
 */
export const validationErrorItemSchema = z.object({
  message: z.string(),
  code: z.string(),
});

/**
 * Error Schema for API authentication / validation failures (400, 401, 409, 422, 500)
 */
export const authErrorResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  errors: z.array(validationErrorItemSchema),
});
