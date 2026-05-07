import { Request, Response } from 'express';
import { WatchlistService } from '../services';
import { getDatabase } from '../database';
import { createSuccessResponse, createErrorResponse } from '../utils/errors';

export class WatchlistController {
  async addToWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { movie_id, status = 'to-watch' } = req.validatedBody;
      const db = await getDatabase();
      const watchlistService = new WatchlistService(db);

      const result = await watchlistService.addToWatchlist(userId, movie_id, status);

      res.status(201).json(createSuccessResponse(result, 'Added to watchlist successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getUserWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { status, limit = 50, offset = 0 } = req.query;
      const db = await getDatabase();
      const watchlistService = new WatchlistService(db);

      const watchlist = await watchlistService.getUserWatchlist(
        userId,
        status as string,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      res.status(200).json(createSuccessResponse(watchlist, 'Watchlist fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async updateWatchlistStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const { status } = req.validatedBody;
      const db = await getDatabase();
      const watchlistService = new WatchlistService(db);

      const result = await watchlistService.updateWatchlistStatus(parseInt(id, 10), status, userId);

      res.status(200).json(createSuccessResponse(result, 'Watchlist status updated successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async removeFromWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const db = await getDatabase();
      const watchlistService = new WatchlistService(db);

      await watchlistService.removeFromWatchlist(parseInt(id, 10), userId);

      res.status(200).json(createSuccessResponse({}, 'Removed from watchlist successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }
}

