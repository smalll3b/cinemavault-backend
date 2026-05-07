import sqlite3 from 'sqlite3';
import { RatingRepository, MovieRepository } from '../database/repositories';
import { AppError } from '../utils/errors';

export class RatingService {
  private ratingRepository: RatingRepository;
  private movieRepository: MovieRepository;

  constructor(db: sqlite3.Database) {
    this.ratingRepository = new RatingRepository(db);
    this.movieRepository = new MovieRepository(db);
  }

  async createRating(userId: number, movieId: number, rating: number): Promise<any> {
    // Validate rating
    if (rating < 1 || rating > 10) {
      throw new AppError(400, 'Rating must be between 1 and 10');
    }

    // Check if movie exists
    const movie = await this.movieRepository.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    // Check if user already rated
    const existingRating = await this.ratingRepository.getUserMovieRating(userId, movieId);
    if (existingRating) {
      return this.ratingRepository.updateRating(existingRating.id, rating);
    }

    return this.ratingRepository.createRating(userId, movieId, rating);
  }

  async getMovieRatings(movieId: number, limit: number = 50, offset: number = 0): Promise<any> {
    // Check if movie exists
    const movie = await this.movieRepository.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    const ratings = await this.ratingRepository.getMovieRatings(movieId, limit, offset);
    const average = await this.ratingRepository.getAverageMovieRating(movieId);
    const count = await this.ratingRepository.getRatingCount(movieId);

    return {
      ratings,
      average,
      count,
    };
  }

  async getUserMovieRating(userId: number, movieId: number): Promise<any> {
    const rating = await this.ratingRepository.getUserMovieRating(userId, movieId);
    if (!rating) {
      throw new AppError(404, 'Rating not found');
    }
    return rating;
  }

  async updateRating(ratingId: number, rating: number, userId: number): Promise<any> {
    if (rating < 1 || rating > 10) {
      throw new AppError(400, 'Rating must be between 1 and 10');
    }

    const existingRating = await this.ratingRepository.getRatingById(ratingId);
    if (!existingRating) {
      throw new AppError(404, 'Rating not found');
    }

    if (existingRating.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to update this rating');
    }

    return this.ratingRepository.updateRating(ratingId, rating);
  }

  async deleteRating(ratingId: number, userId: number): Promise<void> {
    const rating = await this.ratingRepository.getRatingById(ratingId);
    if (!rating) {
      throw new AppError(404, 'Rating not found');
    }

    if (rating.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to delete this rating');
    }

    await this.ratingRepository.deleteRating(ratingId);
  }
}

