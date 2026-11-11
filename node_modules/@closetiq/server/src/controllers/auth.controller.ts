import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiSuccessResponse } from '@closetiq/shared-types';
import { config } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { authResponse, rawRefreshToken } = await authService.register(req.body);

    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
      domain: config.cookieDomain,
    });

    const response: ApiSuccessResponse<typeof authResponse> = {
      success: true,
      data: authResponse,
      meta: { timestamp: new Date().toISOString() },
    };
    res.status(201).json(response);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { authResponse, rawRefreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
      domain: config.cookieDomain,
    });

    const response: ApiSuccessResponse<typeof authResponse> = {
      success: true,
      data: authResponse,
      meta: { timestamp: new Date().toISOString() },
    };
    res.json(response);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const rawToken = req.cookies?.refreshToken;
    if (!rawToken) {
      res.clearCookie('refreshToken', {
        path: '/api/v1/auth',
        domain: config.cookieDomain,
      });
      res.status(401).json({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'Refresh token cookie required' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let tokenData: Awaited<ReturnType<typeof authService.refreshToken>>;
    try {
      tokenData = await authService.refreshToken(rawToken);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.clearCookie('refreshToken', {
          path: '/api/v1/auth',
          domain: config.cookieDomain,
        });
      }
      throw error;
    }
    const { accessToken, newRawRefreshToken, user } = tokenData;

    res.cookie('refreshToken', newRawRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
      domain: config.cookieDomain,
    });

    res.json({
      success: true,
      data: { accessToken, expiresIn: 900, user },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const rawToken = req.cookies?.refreshToken;
    await authService.logout(rawToken);

    res.clearCookie('refreshToken', {
      path: '/api/v1/auth',
      domain: config.cookieDomain,
    });

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export const authController = new AuthController();
