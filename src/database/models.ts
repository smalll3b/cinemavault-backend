import sqlite3 from 'sqlite3';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  title: string;
  year?: number;
  imdb_id?: string;
  media_type?: 'movie' | 'series' | 'episode' | 'game' | string | null;
  type?: 'movie' | 'series' | 'episode' | 'game' | string | null;
  mediaType?: 'movie' | 'series' | 'episode' | 'game' | string | null;
  poster?: string | null;
  plot?: string | null;
  runtime?: number | null;
  genre?: string | null;
  director?: string | null;
  actors?: string | null;
  external_rating?: number | null;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItem {
  id: number;
  user_id: number;
  movie_id: number;
  status: 'to-watch' | 'watching' | 'watched';
  added_at: string;
}

export interface Rating {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  review_text: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export class BaseRepository {
  protected db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  protected run(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params as any, function (err) {
        if (err) reject(err);
        else resolve({ lastID: (this as any).lastID, changes: (this as any).changes });
      });
    });
  }

  protected get<T = any>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params as any, (err, row) => {
        if (err) reject(err);
        else resolve(row as T | undefined);
      });
    });
  }

  protected all<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params as any, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }
}






