import sqlite3 from 'sqlite3';
import { BaseRepository, Review } from './models';

export class ReviewRepository extends BaseRepository {
  async createReview(userId: number, movieId: number, reviewText: string, rating?: number): Promise<Review> {
    const { run } = this.promisifyAll();

    const result = await run(
      `INSERT INTO reviews (user_id, movie_id, review_text, rating) VALUES (?, ?, ?, ?)`,
      [userId, movieId, reviewText, rating || null]
    );

    return this.getReviewById((result as any).lastID);
  }

  async getReviewById(id: number): Promise<Review> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM reviews WHERE id = ?`, [id]);
  }

  async getMovieReviews(movieId: number, limit: number = 50, offset: number = 0): Promise<Review[]> {
    const { all } = this.promisifyAll();
    return all(
      `SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [movieId, limit, offset]
    );
  }

  async getUserReviews(userId: number, limit: number = 50, offset: number = 0): Promise<Review[]> {
    const { all } = this.promisifyAll();
    return all(
      `SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
  }

  async updateReview(id: number, reviewText: string, rating?: number): Promise<Review> {
    const { run } = this.promisifyAll();
    await run(
      `UPDATE reviews SET review_text = ?, rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [reviewText, rating || null, id]
    );
    return this.getReviewById(id);
  }

  async deleteReview(id: number): Promise<void> {
    const { run } = this.promisifyAll();
    await run(`DELETE FROM reviews WHERE id = ?`, [id]);
  }

  async getReviewCount(movieId: number): Promise<number> {
    const { get } = this.promisifyAll();
    const result = await get(`SELECT COUNT(*) as count FROM reviews WHERE movie_id = ?`, [movieId]);
    return result.count;
  }
}

