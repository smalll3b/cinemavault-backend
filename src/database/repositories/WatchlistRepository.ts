import sqlite3 from 'sqlite3';
import { BaseRepository, WatchlistItem } from '../models';

export class WatchlistRepository extends BaseRepository {
  constructor(db: sqlite3.Database) {
    super(db);
  }

  async addToWatchlist(userId: number, movieId: number, status: string = 'to-watch'): Promise<WatchlistItem> {
    const result = await this.run(
      `INSERT INTO watchlist (user_id, movie_id, status) VALUES (?, ?, ?)`,
      [userId, movieId, status]
    );

    const item = await this.getWatchlistItem(result.lastID);
    if (!item) throw new Error('Failed to add watchlist item');
    return item;
  }

  async getWatchlistItem(id: number): Promise<WatchlistItem | undefined> {
    return this.get<WatchlistItem>(`SELECT * FROM watchlist WHERE id = ?`, [id]);
  }

  async getUserWatchlist(userId: number, status?: string, limit: number = 50, offset: number = 0): Promise<WatchlistItem[]> {
    if (status) {
      return this.all<WatchlistItem>(
        `SELECT * FROM watchlist WHERE user_id = ? AND status = ? LIMIT ? OFFSET ?`,
        [userId, status, limit, offset]
      );
    }
    return this.all<WatchlistItem>(`SELECT * FROM watchlist WHERE user_id = ? LIMIT ? OFFSET ?`, [userId, limit, offset]);
  }

  async updateWatchlistStatus(id: number, status: string): Promise<WatchlistItem> {
    await this.run(`UPDATE watchlist SET status = ? WHERE id = ?`, [status, id]);
    const item = await this.getWatchlistItem(id);
    if (!item) throw new Error('Failed to update watchlist item');
    return item;
  }

  async removeFromWatchlist(id: number): Promise<void> {
    await this.run(`DELETE FROM watchlist WHERE id = ?`, [id]);
  }

  async isInWatchlist(userId: number, movieId: number): Promise<WatchlistItem | undefined> {
    return this.get<WatchlistItem>(`SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?`, [userId, movieId]);
  }
}



