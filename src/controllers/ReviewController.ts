import { Request, Response } from 'express';
import { ReviewService } from '../services';
import { getDatabase } from '../database';
import { createSuccessResponse, createErrorResponse } from '../utils/errors';

export class ReviewController {
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { movie_id, review_text, rating } = req.validatedBody;
      const db = await getDatabase();
      const reviewService = new ReviewService(db);

      const result = await reviewService.createReview(userId, movie_id, review_text, rating);

      res.status(201).json(createSuccessResponse(result, 'Review created successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getMovieReviews(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const db = await getDatabase();
      const reviewService = new ReviewService(db);

      const result = await reviewService.getMovieReviews(
        parseInt(movieId, 10),
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      res.status(200).json(createSuccessResponse(result, 'Reviews fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getUserReviews(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { limit = 50, offset = 0 } = req.query;
      const db = await getDatabase();
      const reviewService = new ReviewService(db);

      const reviews = await reviewService.getUserReviews(
        userId,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );

      res.status(200).json(createSuccessResponse(reviews, 'User reviews fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const { review_text, rating } = req.validatedBody;
      const db = await getDatabase();
      const reviewService = new ReviewService(db);

      const result = await reviewService.updateReview(parseInt(id, 10), review_text, rating, userId);

      res.status(200).json(createSuccessResponse(result, 'Review updated successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const db = await getDatabase();
      const reviewService = new ReviewService(db);

      await reviewService.deleteReview(parseInt(id, 10), userId);

      res.status(200).json(createSuccessResponse({}, 'Review deleted successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }
}

