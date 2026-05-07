import sqlite3 from 'sqlite3';
import { WatchlistRepository, MovieRepository } from '../database/repositories';
import { AppError } from '../utils/errors';

export class WatchlistService {
  private watchlistRepository: WatchlistRepository;
  private movieRepository: MovieRepository;

  constructor(db: sqlite3.Database) {
    this.watchlistRepository = new WatchlistRepository(db);
    this.movieRepository = new MovieRepository(db);
  }

  async addToWatchlist(userId: number, movieId: number, status: string = 'to-watch'): Promise<any> {
    // Check if movie exists
    const movie = await this.movieRepository.getMovieById(movieId);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }

    // Check if already in watchlist
    const existing = await this.watchlistRepository.isInWatchlist(userId, movieId);
    if (existing) {
      return existing;
    }

    return this.watchlistRepository.addToWatchlist(userId, movieId, status);
  }

  async getUserWatchlist(userId: number, status?: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const items = await this.watchlistRepository.getUserWatchlist(userId, status, limit, offset);

    // Fetch full movie details
    const watchlistWithMovies = await Promise.all(
      items.map(async (item) => {
        const movie = await this.movieRepository.getMovieById(item.movie_id);
        return {
          ...item,
          movie,
        };
      })
    );

    return watchlistWithMovies;
  }

  async updateWatchlistStatus(watchlistId: number, status: string, userId: number): Promise<any> {
    const item = await this.watchlistRepository.getWatchlistItem(watchlistId);
    if (!item) {
      throw new AppError(404, 'Watchlist item not found');
    }

    if (item.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to update this watchlist item');
    }

    return this.watchlistRepository.updateWatchlistStatus(watchlistId, status);
  }

  async removeFromWatchlist(watchlistId: number, userId: number): Promise<void> {
    const item = await this.watchlistRepository.getWatchlistItem(watchlistId);
    if (!item) {
      throw new AppError(404, 'Watchlist item not found');
    }

    if (item.user_id !== userId) {
      throw new AppError(403, 'You do not have permission to delete this watchlist item');
    }

    await this.watchlistRepository.removeFromWatchlist(watchlistId);
  }
}

