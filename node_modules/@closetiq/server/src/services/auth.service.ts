import { prisma, Role } from '@closetiq/database';
import { RegisterRequestDto, LoginRequestDto, AuthResponseDto } from '@closetiq/shared-types';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { createHash } from 'crypto';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export class AuthService {
  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: Role.USER,
        profile: {
          create: {
            fullName: dto.fullName || null,
          },
        },
      },
      include: { profile: true },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        details: { email: user.email },
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      tokens: {
        accessToken,
        expiresIn: 900,
      },
    };
  }

  async login(dto: LoginRequestDto): Promise<{ authResponse: AuthResponseDto; rawRefreshToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const rawRefreshToken = signRefreshToken(user.id);
    const tokenHash = hashToken(rawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      authResponse: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        tokens: {
          accessToken,
          expiresIn: 900,
        },
      },
      rawRefreshToken,
    };
  }

  async refreshToken(rawToken: string): Promise<{ accessToken: string; newRawRefreshToken: string }> {
    const { userId } = verifyRefreshToken(rawToken);
    const tokenHash = hashToken(rawToken);

    const existingToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Token reuse detection! If already revoked or not found, invalidate ALL refresh tokens for user
    if (!existingToken || existingToken.revokedAt || existingToken.expiresAt < new Date()) {
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedError('Invalid or reused refresh token. Session terminated.');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new token pair
    const accessToken = signAccessToken({
      userId: existingToken.user.id,
      email: existingToken.user.email,
      role: existingToken.user.role,
    });

    const newRawRefreshToken = signRefreshToken(existingToken.user.id);
    const newTokenHash = hashToken(newRawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: existingToken.user.id,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    return { accessToken, newRawRefreshToken };
  }

  async logout(rawToken?: string): Promise<void> {
    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      });
    }
  }
}

export const authService = new AuthService();
