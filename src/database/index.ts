import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve('./data');
const dbFile = path.join(dbPath, 'cinemavault.db');

// Ensure data directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

let db: sqlite3.Database;

export const getDatabase = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      db = new sqlite3.Database(dbFile, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    } else {
      resolve(db);
    }
  });
};

export const initializeDatabase = async (): Promise<void> => {
  const database = await getDatabase();
  const run = promisify(database.run.bind(database));

  try {
    console.log('Initializing database...');

    // Create Users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Movies table
    await run(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        imdb_id TEXT UNIQUE,
        poster TEXT,
        plot TEXT,
        runtime INTEGER,
        genre TEXT,
        director TEXT,
        actors TEXT,
        external_rating REAL,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Create Watchlist table
    await run(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        status TEXT DEFAULT 'to-watch',
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create Ratings table
    await run(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        rating REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create Reviews table
    await run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        review_text TEXT NOT NULL,
        rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (movie_id) REFERENCES movies(id)
      )
    `);

    // Create indices for common queries
    await run(`CREATE INDEX IF NOT EXISTS idx_movies_imdb_id ON movies(imdb_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id)`);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
};

