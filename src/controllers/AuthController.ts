import { Request, Response } from 'express';
import { AuthService } from '../services';
import { getDatabase } from '../database';
import { createSuccessResponse, createErrorResponse } from '../utils/errors';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password } = req.validatedBody;
      const db = await getDatabase();
      const authService = new AuthService(db);

      const result = await authService.register(email, username, password);

      res.status(201).json(createSuccessResponse(result, 'User registered successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.validatedBody;
      const db = await getDatabase();
      const authService = new AuthService(db);

      const result = await authService.login(email, password);

      res.status(200).json(createSuccessResponse(result, 'Login successful'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const db = await getDatabase();
      const authService = new AuthService(db);
      const profile = await authService.getProfile(userId);

      res.status(200).json(createSuccessResponse(profile, 'Profile fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }
}

