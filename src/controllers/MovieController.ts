import { Request, Response } from 'express';
import { MovieService } from '../services';
import { getDatabase } from '../database';
import { createSuccessResponse, createErrorResponse } from '../utils/errors';

export class MovieController {
  async createMovie(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { title, year, imdb_id, poster, plot, runtime, genre, director, actors, external_rating } =
        req.validatedBody;
      const { media_type } = req.validatedBody;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movie = await movieService.createMovie(
        {
          title,
          year,
          imdb_id,
          poster,
          plot,
          runtime,
          genre,
          director,
          actors,
          external_rating,
          media_type,
        },
        userId
      );

      res.status(201).json(createSuccessResponse(movie, 'Movie created successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movie = await movieService.getMovieById(parseInt(id, 10));

      res.status(200).json(createSuccessResponse(movie, 'Movie fetched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movies = await movieService.getAllMovies(parseInt(limit as string, 10), parseInt(offset as string, 10));
      const count = await movieService.getMovieCount();

      res.status(200).json(
        createSuccessResponse({ movies, count, limit: parseInt(limit as string, 10), offset: parseInt(offset as string, 10) }, 'Movies fetched successfully')
      );
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async searchMovies(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit = 50, offset = 0, media_type } = req.validatedQuery;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movies = await movieService.searchMovies(
        query,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10),
        media_type
      );

      res.status(200).json(createSuccessResponse({ movies, count: movies.length }, 'Movies searched successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const updates = req.validatedBody;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movie = await movieService.updateMovie(parseInt(id, 10), updates, userId);

      res.status(200).json(createSuccessResponse(movie, 'Movie updated successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { id } = req.params;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      await movieService.deleteMovie(parseInt(id, 10), userId);

      res.status(200).json(createSuccessResponse({}, 'Movie deleted successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }

  async createMovieFromOMDB(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json(createErrorResponse(401, 'Unauthorized'));
        return;
      }

      const { title } = req.validatedBody;
      const db = await getDatabase();
      const movieService = new MovieService(db);

      const movie = await movieService.createMovieFromOMDB(title, userId);

      res.status(201).json(createSuccessResponse(movie, 'Movie created from OMDB successfully'));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(createErrorResponse(error.statusCode || 500, error.message));
    }
  }
}


