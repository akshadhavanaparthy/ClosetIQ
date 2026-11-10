import { z } from 'zod';
export declare const RoleSchema: z.ZodEnum<["USER", "STYLIST", "ADMIN"]>;
export type Role = z.infer<typeof RoleSchema>;
export declare const RegisterRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName?: string | undefined;
}, {
    email: string;
    password: string;
    fullName?: string | undefined;
}>;
export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
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
