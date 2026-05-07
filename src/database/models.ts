import sqlite3 from 'sqlite3';
import { promisify } from 'util';

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
  poster?: string;
  plot?: string;
  runtime?: number;
  genre?: string;
  director?: string;
  actors?: string;
  external_rating?: number;
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

  protected promisifyAll() {
    return {
      run: promisify(this.db.run.bind(this.db)),
      get: promisify(this.db.get.bind(this.db)),
      all: promisify(this.db.all.bind(this.db)),
    };
  }
}

