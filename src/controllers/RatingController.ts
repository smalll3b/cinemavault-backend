import { Request, Response } from 'express';
import { RatingService } from '../services';
import { getDatabase } from '../database';
import { createSuccessResponse, createErrorResponse } from '../utils/errors';

export class RatingController {
  async createRating(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { movie_id, rating } = req.validatedBody;
      const db = await getDatabase();
      const ratingService = new RatingService(db);

      const result = await ratingService.createRating(userId, movie_id, rating);

      res.status(201).json(createSuccessResponse(result, 'Rating submitted successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getMovieRatings(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const db = await getDatabase();
      const ratingService = new RatingService(db);

      const result = await ratingService.getMovieRatings(
        parseInt(movieId, 10),
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      res.status(200).json(createSuccessResponse(result, 'Ratings fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async updateRating(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const { rating } = req.validatedBody;
      const db = await getDatabase();
      const ratingService = new RatingService(db);

      const result = await ratingService.updateRating(parseInt(id, 10), rating, userId);

      res.status(200).json(createSuccessResponse(result, 'Rating updated successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async deleteRating(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const db = await getDatabase();
      const ratingService = new RatingService(db);

      await ratingService.deleteRating(parseInt(id, 10), userId);

      res.status(200).json(createSuccessResponse({}, 'Rating deleted successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }
}

