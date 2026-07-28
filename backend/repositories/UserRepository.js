import User from '../models/User.js';

class UserRepository {
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  async findById(id) {
    return await User.findById(id).exec();
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true });
  }

  async updateProfile(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

export default new UserRepository();
