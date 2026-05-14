import sqlite3 from 'sqlite3';
import { MovieRepository } from '../database/repositories';
import { searchMovieByTitle, searchMovieById, mapOMDBToMovie } from '../utils/omdb';
import { AppError } from '../utils/errors';
import { Movie } from '../database/models';

export class MovieService {
  private movieRepository: MovieRepository;

  constructor(db: sqlite3.Database) {
    this.movieRepository = new MovieRepository(db);
  }

  async createMovie(movieData: Partial<Movie>, userId: number): Promise<Movie> {
    if (!movieData.title) {
      throw new AppError(400, 'Movie title is required');
    }

    const movie = await this.movieRepository.createMovie({
      ...movieData,
      created_by: userId,
    });

    return movie;
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.getMovieById(id);
    if (!movie) {
      throw new AppError(404, 'Movie not found');
    }
    return movie;
  }

  async getAllMovies(limit: number = 50, offset: number = 0): Promise<Movie[]> {
    return this.movieRepository.getAllMovies(limit, offset);
  }

  async searchMovies(query: string, limit: number = 50, offset: number = 0, mediaType?: string): Promise<Movie[]> {
    if (!query || query.trim().length === 0) {
      throw new AppError(400, 'Search query is required');
    }
    return this.movieRepository.searchMovies(query, limit, offset, mediaType);
  }

  async updateMovie(id: number, updates: Partial<Movie>, userId: number): Promise<Movie> {
    const movie = await this.getMovieById(id);

    // Check ownership or admin permission
    if (movie.created_by !== userId) {
      throw new AppError(403, 'You do not have permission to update this movie');
    }

    return this.movieRepository.updateMovie(id, updates);
  }

  async deleteMovie(id: number, userId: number): Promise<void> {
    const movie = await this.getMovieById(id);

    // Check ownership or admin permission
    if (movie.created_by !== userId) {
      throw new AppError(403, 'You do not have permission to delete this movie');
    }

    await this.movieRepository.deleteMovie(id);
  }

  async getMovieFromOMDB(title: string, type?: string): Promise<Partial<Movie> | null> {
    const omdbMovie = await searchMovieByTitle(title, type);
    if (!omdbMovie) {
      return null;
    }
    return mapOMDBToMovie(omdbMovie);
  }

  async getMovieFromOMDBById(imdbId: string): Promise<Partial<Movie> | null> {
    const omdbMovie = await searchMovieById(imdbId);
    if (!omdbMovie) {
      return null;
    }
    return mapOMDBToMovie(omdbMovie);
  }

  async createMovieFromOMDB(title: string, userId: number): Promise<Movie> {
    // Search in OMDB
    const omdbData = await this.getMovieFromOMDB(title);
    if (!omdbData) {
      throw new AppError(404, 'Movie not found in OMDB');
    }

    // Check if movie already exists
    const existingMovie = await this.movieRepository.getMovieByImdbId(omdbData.imdb_id!);
    if (existingMovie) {
      return existingMovie;
    }

    // Create movie
    return this.movieRepository.createMovie({
      ...omdbData,
      created_by: userId,
    });
  }

  async getMovieCount(): Promise<number> {
    return this.movieRepository.getMovieCount();
  }
}


