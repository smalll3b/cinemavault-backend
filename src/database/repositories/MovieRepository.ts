import sqlite3 from 'sqlite3';
import { BaseRepository, Movie } from '../models';

export class MovieRepository extends BaseRepository {
  constructor(db: sqlite3.Database) {
    super(db);
  }

  async createMovie(movieData: Partial<Movie>): Promise<Movie> {
    const fields = Object.keys(movieData).join(', ');
    const placeholders = Object.keys(movieData).map(() => '?').join(', ');
    const values = Object.values(movieData);

    const result = await this.run(
      `INSERT INTO movies (${fields}) VALUES (${placeholders})`,
      values
    );

    const movie = await this.getMovieById(result.lastID);
    if (!movie) throw new Error('Failed to create movie');
    return movie;
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    return this.get<Movie>(`SELECT * FROM movies WHERE id = ?`, [id]);
  }

  async getMovieByImdbId(imdbId: string): Promise<Movie | undefined> {
    return this.get<Movie>(`SELECT * FROM movies WHERE imdb_id = ?`, [imdbId]);
  }

  async getAllMovies(limit: number = 50, offset: number = 0): Promise<Movie[]> {
    return this.all<Movie>(`SELECT * FROM movies LIMIT ? OFFSET ?`, [limit, offset]);
  }

  async searchMovies(query: string, limit: number = 50, offset: number = 0): Promise<Movie[]> {
    const searchTerm = `%${query}%`;
    return this.all<Movie>(
      `SELECT * FROM movies WHERE title LIKE ? OR director LIKE ? OR actors LIKE ? LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );
  }

  async updateMovie(id: number, updates: Partial<Movie>): Promise<Movie> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), id];

    await this.run(`UPDATE movies SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    const movie = await this.getMovieById(id);
    if (!movie) throw new Error('Failed to update movie');
    return movie;
  }

  async deleteMovie(id: number): Promise<void> {
    await this.run(`DELETE FROM movies WHERE id = ?`, [id]);
  }

  async getMovieCount(): Promise<number> {
    const result = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM movies`);
    return result?.count ?? 0;
  }
}



