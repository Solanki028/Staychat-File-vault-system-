import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token
 * @param {Object} payload - User details (id, email, role)
 * @returns {String} Signed JWT token string
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'staychat_company_workspace_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'staychat_company_workspace_secret_jwt_key_2026';
  return jwt.verify(token, secret);
};
