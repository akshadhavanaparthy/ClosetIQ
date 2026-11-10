import { z } from 'zod';

export const RoleSchema = z.enum(['USER', 'STYLIST', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit'),
  fullName: z.string().min(2).optional(),
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    role: Role;
    isVerified: boolean;
  };
  tokens: AuthTokens;
}

export interface JwtAccessPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
