import sqlite3 from 'sqlite3';
import { BaseRepository, Movie } from './models';

export class MovieRepository extends BaseRepository {
  async createMovie(movieData: Partial<Movie>): Promise<Movie> {
    const { run } = this.promisifyAll();
    const fields = Object.keys(movieData).join(', ');
    const placeholders = Object.keys(movieData).map(() => '?').join(', ');
    const values = Object.values(movieData);

    const result = await run(
      `INSERT INTO movies (${fields}) VALUES (${placeholders})`,
      values
    );

    return this.getMovieById((result as any).lastID);
  }

  async getMovieById(id: number): Promise<Movie> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM movies WHERE id = ?`, [id]);
  }

  async getMovieByImdbId(imdbId: string): Promise<Movie | undefined> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM movies WHERE imdb_id = ?`, [imdbId]);
  }

  async getAllMovies(limit: number = 50, offset: number = 0): Promise<Movie[]> {
    const { all } = this.promisifyAll();
    return all(`SELECT * FROM movies LIMIT ? OFFSET ?`, [limit, offset]);
  }

  async searchMovies(query: string, limit: number = 50, offset: number = 0): Promise<Movie[]> {
    const { all } = this.promisifyAll();
    const searchTerm = `%${query}%`;
    return all(
      `SELECT * FROM movies WHERE title LIKE ? OR director LIKE ? OR actors LIKE ? LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );
  }

  async updateMovie(id: number, updates: Partial<Movie>): Promise<Movie> {
    const { run } = this.promisifyAll();
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), id];

    await run(`UPDATE movies SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    return this.getMovieById(id);
  }

  async deleteMovie(id: number): Promise<void> {
    const { run } = this.promisifyAll();
    await run(`DELETE FROM movies WHERE id = ?`, [id]);
  }

  async getMovieCount(): Promise<number> {
    const { get } = this.promisifyAll();
    const result = await get(`SELECT COUNT(*) as count FROM movies`);
    return result.count;
  }
}

