const { z } = require('zod');

// Password must be at least 8 chars, contain uppercase, lowercase, digit, and special char
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine(val => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
  .refine(val => /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
  .refine(val => /[0-9]/.test(val), 'Password must contain at least one number')
  .refine(val => /[^A-Za-z0-9]/.test(val), 'Password must contain at least one special character');

const signupSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  phone: z.string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
});

module.exports = { signupSchema, loginSchema, passwordSchema };
