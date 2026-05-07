import sqlite3 from 'sqlite3';
import { BaseRepository, Rating } from '../models';

export class RatingRepository extends BaseRepository {
  constructor(db: sqlite3.Database) {
    super(db);
  }

  async createRating(userId: number, movieId: number, rating: number): Promise<Rating> {
    const result = await this.run(
      `INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)`,
      [userId, movieId, rating]
    );

    const created = await this.getRatingById(result.lastID);
    if (!created) throw new Error('Failed to create rating');
    return created;
  }

  async getRatingById(id: number): Promise<Rating | undefined> {
    return this.get<Rating>(`SELECT * FROM ratings WHERE id = ?`, [id]);
  }

  async getUserMovieRating(userId: number, movieId: number): Promise<Rating | undefined> {
    return this.get<Rating>(`SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?`, [userId, movieId]);
  }

  async getMovieRatings(movieId: number, limit: number = 50, offset: number = 0): Promise<Rating[]> {
    return this.all<Rating>(`SELECT * FROM ratings WHERE movie_id = ? LIMIT ? OFFSET ?`, [movieId, limit, offset]);
  }

  async getAverageMovieRating(movieId: number): Promise<number> {
    const result = await this.get<{ average: number | null }>(`SELECT AVG(rating) as average FROM ratings WHERE movie_id = ?`, [movieId]);
    return result?.average ?? 0;
  }

  async updateRating(id: number, rating: number): Promise<Rating> {
    await this.run(`UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [rating, id]);
    const updated = await this.getRatingById(id);
    if (!updated) throw new Error('Failed to update rating');
    return updated;
  }

  async deleteRating(id: number): Promise<void> {
    await this.run(`DELETE FROM ratings WHERE id = ?`, [id]);
  }

  async getRatingCount(movieId: number): Promise<number> {
    const result = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM ratings WHERE movie_id = ?`, [movieId]);
    return result?.count ?? 0;
  }
}



