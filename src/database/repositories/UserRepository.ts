import sqlite3 from 'sqlite3';
import { BaseRepository, User } from './models';

export class UserRepository extends BaseRepository {
  async createUser(email: string, username: string, password: string, role: string = 'user'): Promise<User> {
    const { run } = this.promisifyAll();

    const result = await run(
      `INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)`,
      [email, username, password, role]
    );

    return this.getUserById((result as any).lastID);
  }

  async getUserById(id: number): Promise<User> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { get } = this.promisifyAll();
    return get(`SELECT * FROM users WHERE username = ?`, [username]);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const { run } = this.promisifyAll();
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), id];

    await run(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    return this.getUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    const { all } = this.promisifyAll();
    return all(`SELECT * FROM users`);
  }

  async deleteUser(id: number): Promise<void> {
    const { run } = this.promisifyAll();
    await run(`DELETE FROM users WHERE id = ?`, [id]);
  }
}

