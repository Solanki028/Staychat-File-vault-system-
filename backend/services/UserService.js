import userRepository from '../repositories/UserRepository.js';
import { generateToken } from '../utils/jwtUtils.js';

class UserService {
  async register({ fullName, email, password, role = 'owner', phone }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered.');
      error.statusCode = 409;
      error.errorCode = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const newUser = await userRepository.create({
      fullName,
      email,
      password,
      role,
      phone
    });

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      const error = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password credentials.');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    if (user.status !== 'active') {
      const error = new Error(`Account is currently ${user.status}. Please contact support.`);
      error.statusCode = 403;
      error.errorCode = 'ACCOUNT_DISABLED';
      throw error;
    }

    await userRepository.updateLastLogin(user._id);

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        lastLoginAt: new Date()
      }
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User account not found.');
      error.statusCode = 404;
      error.errorCode = 'USER_NOT_FOUND';
      throw error;
    }

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };
  }
}

export default new UserService();
