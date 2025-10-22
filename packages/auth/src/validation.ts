import { z } from 'zod';

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'Password richiesta'),
  twoFactorCode: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration validation schema
 */
export const registerSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z
    .string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
    .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
    .regex(/[0-9]/, 'Deve contenere almeno un numero')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Deve contenere almeno un carattere speciale'
    ),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Nome richiesto').max(100),
  company: z.string().max(100).optional(),
  accountType: z.enum(['INDIVIDUAL', 'BUSINESS', 'ENTERPRISE']).default('INDIVIDUAL'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Devi accettare i termini e condizioni' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email non valida'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token richiesto'),
  password: z
    .string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
    .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
    .regex(/[0-9]/, 'Deve contenere almeno un numero')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Deve contenere almeno un carattere speciale'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password corrente richiesta'),
  newPassword: z
    .string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
    .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
    .regex(/[0-9]/, 'Deve contenere almeno un numero')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Deve contenere almeno un carattere speciale'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nuova password deve essere diversa dalla password corrente',
  path: ['newPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
