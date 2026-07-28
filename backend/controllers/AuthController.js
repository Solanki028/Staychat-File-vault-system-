import userService from '../services/UserService.js';

class AuthController {
  async register(req, res, next) {
    try {
      const result = await userService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await userService.login(req.body);
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req, res) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  }

  async me(req, res, next) {
    try {
      const profile = await userService.getCurrentUser(req.user.id);
      return res.status(200).json({
        success: true,
        data: { user: profile }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
