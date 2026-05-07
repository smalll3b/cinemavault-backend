import sqlite3 from 'sqlite3';
import { BaseRepository, User } from '../models';

export class UserRepository extends BaseRepository {
  constructor(db: sqlite3.Database) {
    super(db);
  }

  async createUser(email: string, username: string, password: string, role: string = 'user'): Promise<User> {
    const result = await this.run(
      `INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)`,
      [email, username, password, role]
    );

    const user = await this.getUserById(result.lastID);
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.get<User>(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.get<User>(`SELECT * FROM users WHERE username = ?`, [username]);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), id];

    await this.run(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    const user = await this.getUserById(id);
    if (!user) throw new Error('Failed to update user');
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.all<User>(`SELECT * FROM users`);
  }

  async deleteUser(id: number): Promise<void> {
    await this.run(`DELETE FROM users WHERE id = ?`, [id]);
  }
}




