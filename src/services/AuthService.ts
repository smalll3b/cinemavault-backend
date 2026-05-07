import sqlite3 from 'sqlite3';
import { UserRepository } from '../database/repositories';
import { hashPassword, comparePassword, generateToken, JWTPayload } from '../utils/auth';
import { AppError } from '../utils/errors';

export class AuthService {
  private userRepository: UserRepository;

  constructor(db: sqlite3.Database) {
    this.userRepository = new UserRepository(db);
  }

  async register(email: string, username: string, password: string): Promise<{ token: string; user: any }> {
    // Check if user exists
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    const existingUsername = await this.userRepository.getUserByUsername(username);
    if (existingUsername) {
      throw new AppError(400, 'Username already taken');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await this.userRepository.createUser(email, username, hashedPassword);

    // Generate token
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    };
  }
}

