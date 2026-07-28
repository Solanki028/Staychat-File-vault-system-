import { verifyToken } from '../utils/jwtUtils.js';
import userRepository from '../repositories/UserRepository.js';

/**
 * Middleware: Verify JWT Access Token in Authorization Header
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required. Please log in.',
        errorCode: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user || user.isDeleted || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User account is invalid or disabled.',
        errorCode: 'UNAUTHORIZED'
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
      errorCode: 'INVALID_TOKEN'
    });
  }
};

/**
 * Middleware: Role-Based Access Control (RBAC)
 * @param  {...String} allowedRoles - Array of allowed user roles ('owner', 'secretary', 'employee', 'admin')
 */
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated user request.',
        errorCode: 'UNAUTHORIZED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role lacks sufficient permissions.`,
        errorCode: 'FORBIDDEN'
      });
    }

    next();
  };
};
