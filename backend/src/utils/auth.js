import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

// Create a token when user logs in
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Check if token is valid
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password before saving
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Check if password matches
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Make sure user is logged in
export const authenticate = (context) => {
  if (!context.token) {
    throw new Error('Please login first');
  }

  const user = verifyToken(context.token);
  if (!user) {
    throw new Error('Invalid token');
  }

  return user;
};

// Make sure user is admin
export const requireAdmin = (context) => {
  const user = authenticate(context);
  if (user.role !== 'Admin') {
    throw new Error('Only admins can do this');
  }
  return user;
};
