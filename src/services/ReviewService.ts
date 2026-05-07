import sqlite3 from 'sqlite3';
import { ReviewRepository, MovieRepository } from '../database/repositories';
import { AppError } from '../utils/errors';

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private movieRepository: MovieRepository;

  constructor(db: sqlite3.Database) {
    this.reviewRepository = new ReviewRepository(db);
    this.movieRepository = new MovieRepository(db);
  }

  async createReview(userId: number, movieId: number, reviewText: string, rating?: number): Promise<any> {
    // Check if movie exists
    const movie = await this.movieRepository.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      throw new AppError(400, 'Rating must be between 1 and 10');
    }

    return this.reviewRepository.createReview(userId, movieId, reviewText, rating);
  }

  async getMovieReviews(movieId: number, limit: number = 50, offset: number = 0): Promise<any> {
    // Check if movie exists
    const movie = await this.movieRepository.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    const reviews = await this.reviewRepository.getMovieReviews(movieId, limit, offset);
    const count = await this.reviewRepository.getReviewCount(movieId);

    return {
      reviews,
      count,
    };
  }

  async getUserReviews(userId: number, limit: number = 50, offset: number = 0): Promise<any> {
    const reviews = await this.reviewRepository.getUserReviews(userId, limit, offset);
    return reviews;
  }

  async updateReview(reviewId: number, reviewText?: string, rating?: number, userId?: number): Promise<any> {
    const review = await this.reviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (review.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to update this review');
    }

    if (rating !== undefined && (rating < 1 || rating > 10)) {
      throw new AppError(400, 'Rating must be between 1 and 10');
    }

    return this.reviewRepository.updateReview(reviewId, reviewText || review.review_text, rating);
  }

  async deleteReview(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (review.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to delete this review');
    }

    await this.reviewRepository.deleteReview(reviewId);
  }
}

