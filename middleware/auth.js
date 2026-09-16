const jwt = require('jsonwebtoken');
const { findById } = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'citadels-dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function setAuthCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
}

function clearAuthCookie(res) {
  res.clearCookie('auth_token', { path: '/' });
}

// Middleware: attach user to req if logged in (does not block)
function attachUser(req, res, next) {
  const token = req.cookies && req.cookies.auth_token;
  if (!token) {
    res.locals.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findById(decoded.userId);
    if (user) {
      // Never expose password hash to views
      const { passwordHash, ...safeUser } = user;
      res.locals.user = safeUser;
      req.user = safeUser;
    } else {
      res.locals.user = null;
    }
  } catch {
    res.locals.user = null;
  }
  next();
}

// Middleware: require authentication (blocks unauthenticated)
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

// Middleware: redirect if already logged in
function redirectIfAuth(req, res, next) {
  if (req.user) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  attachUser,
  requireAuth,
  redirectIfAuth,
  JWT_SECRET
};
