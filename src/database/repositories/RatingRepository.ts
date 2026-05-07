import sqlite3 from 'sqlite3';
import { BaseRepository, Rating } from './models';

export class RatingRepository extends BaseRepository {
  async createRating(userId: number, movieId: number, rating: number): Promise<Rating> {
    const { run } = this.promisifyAll();

    const result = await run(
      `INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)`,
      [userId, movieId, rating]
    );

    return this.getRatingById((result as any).lastID);
  }

  async getRatingById(id: number): Promise<Rating> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM ratings WHERE id = ?`, [id]);
  }

  async getUserMovieRating(userId: number, movieId: number): Promise<Rating | undefined> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?`, [userId, movieId]);
  }

  async getMovieRatings(movieId: number, limit: number = 50, offset: number = 0): Promise<Rating[]> {
    const { all } = this.promisifyAll();
    return all(`SELECT * FROM ratings WHERE movie_id = ? LIMIT ? OFFSET ?`, [movieId, limit, offset]);
  }

  async getAverageMovieRating(movieId: number): Promise<number> {
    const { get } = this.promisifyAll();
    const result = await get(`SELECT AVG(rating) as average FROM ratings WHERE movie_id = ?`, [movieId]);
    return result?.average || 0;
  }

  async updateRating(id: number, rating: number): Promise<Rating> {
    const { run } = this.promisifyAll();
    await run(`UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [rating, id]);
    return this.getRatingById(id);
  }

  async deleteRating(id: number): Promise<void> {
    const { run } = this.promisifyAll();
    await run(`DELETE FROM ratings WHERE id = ?`, [id]);
  }

  async getRatingCount(movieId: number): Promise<number> {
    const { get } = this.promisifyAll();
    const result = await get(`SELECT COUNT(*) as count FROM ratings WHERE movie_id = ?`, [movieId]);
    return result.count;
  }
}

