"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestSchema = exports.RegisterRequestSchema = exports.RoleSchema = void 0;
const zod_1 = require("zod");
exports.RoleSchema = zod_1.z.enum(['USER', 'STYLIST', 'ADMIN']);
exports.RegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one digit'),
    fullName: zod_1.z.string().min(2).optional(),
});
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
