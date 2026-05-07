import sqlite3 from 'sqlite3';
import { BaseRepository, WatchlistItem } from './models';

export class WatchlistRepository extends BaseRepository {
  async addToWatchlist(userId: number, movieId: number, status: string = 'to-watch'): Promise<WatchlistItem> {
    const { run } = this.promisifyAll();

    const result = await run(
      `INSERT INTO watchlist (user_id, movie_id, status) VALUES (?, ?, ?)`,
      [userId, movieId, status]
    );

    return this.getWatchlistItem((result as any).lastID);
  }

  async getWatchlistItem(id: number): Promise<WatchlistItem> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM watchlist WHERE id = ?`, [id]);
  }

  async getUserWatchlist(userId: number, status?: string, limit: number = 50, offset: number = 0): Promise<WatchlistItem[]> {
    const { all } = this.promisifyAll();
    if (status) {
      return all(
        `SELECT * FROM watchlist WHERE user_id = ? AND status = ? LIMIT ? OFFSET ?`,
        [userId, status, limit, offset]
      );
    }
    return all(`SELECT * FROM watchlist WHERE user_id = ? LIMIT ? OFFSET ?`, [userId, limit, offset]);
  }

  async updateWatchlistStatus(id: number, status: string): Promise<WatchlistItem> {
    const { run } = this.promisifyAll();
    await run(`UPDATE watchlist SET status = ? WHERE id = ?`, [status, id]);
    return this.getWatchlistItem(id);
  }

  async removeFromWatchlist(id: number): Promise<void> {
    const { run } = this.promisifyAll();
    await run(`DELETE FROM watchlist WHERE id = ?`, [id]);
  }

  async isInWatchlist(userId: number, movieId: number): Promise<WatchlistItem | undefined> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?`, [userId, movieId]);
  }
}

