import sqlite3 from 'sqlite3';
import { BaseRepository, Review } from '../models';

export class ReviewRepository extends BaseRepository {
  constructor(db: sqlite3.Database) {
    super(db);
  }

  async createReview(userId: number, movieId: number, reviewText: string, rating?: number): Promise<Review> {
    const result = await this.run(
      `INSERT INTO reviews (user_id, movie_id, review_text, rating) VALUES (?, ?, ?, ?)`,
      [userId, movieId, reviewText, rating || null]
    );

    const created = await this.getReviewById(result.lastID);
    if (!created) throw new Error('Failed to create review');
    return created;
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    return this.get<Review>(`SELECT * FROM reviews WHERE id = ?`, [id]);
  }

  async getMovieReviews(movieId: number, limit: number = 50, offset: number = 0): Promise<Review[]> {
    return this.all<Review>(
      `SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [movieId, limit, offset]
    );
  }

  async getUserReviews(userId: number, limit: number = 50, offset: number = 0): Promise<Review[]> {
    return this.all<Review>(
      `SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
  }

  async updateReview(id: number, reviewText: string, rating?: number): Promise<Review> {
    await this.run(
      `UPDATE reviews SET review_text = ?, rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [reviewText, rating || null, id]
    );
    const updated = await this.getReviewById(id);
    if (!updated) throw new Error('Failed to update review');
    return updated;
  }

  async deleteReview(id: number): Promise<void> {
    await this.run(`DELETE FROM reviews WHERE id = ?`, [id]);
  }

  async getReviewCount(movieId: number): Promise<number> {
    const result = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM reviews WHERE movie_id = ?`, [movieId]);
    return result?.count ?? 0;
  }
}



