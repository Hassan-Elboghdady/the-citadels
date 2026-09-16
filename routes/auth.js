const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { signupSchema, loginSchema } = require('../utils/validation');
const { findByEmail, createUser, updateUser } = require('../models/User');
const { generateToken, setAuthCookie, clearAuthCookie, redirectIfAuth } = require('../middleware/auth');

const router = express.Router();

// ────────────────────────────────────────────────────────
//  Rate limiters
// ────────────────────────────────────────────────────────

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many accounts created from this IP. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.render('signup', {
      title: 'Sign Up — The Citadels',
      currentPage: 'signup',
      errors: { general: 'Too many signup attempts. Please try again in 15 minutes.' },
      formData: req.body || {}
    });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.render('login', {
      title: 'Sign In — The Citadels',
      currentPage: 'login',
      errors: { general: 'Too many login attempts. Please try again in 15 minutes.' },
      formData: req.body || {}
    });
  }
});

// ────────────────────────────────────────────────────────
//  SIGN UP
// ────────────────────────────────────────────────────────

router.get('/signup', redirectIfAuth, (req, res) => {
  res.render('signup', {
    title: 'Sign Up — The Citadels',
    currentPage: 'signup',
    errors: {},
    formData: {}
  });
});

router.post('/signup', signupLimiter, redirectIfAuth, async (req, res) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    const errors = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (!errors[field]) errors[field] = issue.message;
    });
    return res.status(400).render('signup', {
      title: 'Sign Up — The Citadels',
      currentPage: 'signup',
      errors,
      formData: req.body
    });
  }

  const { firstName, lastName, email, phone, password } = result.data;

  // Check if email already registered
  const existing = findByEmail(email);
  if (existing) {
    return res.status(409).render('signup', {
      title: 'Sign Up — The Citadels',
      currentPage: 'signup',
      errors: { email: 'An account with this email address already exists' },
      formData: req.body
    });
  }

  // Hash password with bcrypt (12 rounds)
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

  const user = createUser({
    firstName,
    lastName,
    email,
    phone,
    passwordHash,
    verificationToken,
    verificationExpiry
  });

  // In production you would send an email with a verification link.
  // For now we log the token to the console.
  console.log(`[Email Verification] Token for ${email}: ${verificationToken}`);
  console.log(`[Email Verification] Verify URL: http://localhost:3000/verify-email?token=${verificationToken}`);

  // Auto-login after signup
  const token = generateToken(user.id);
  setAuthCookie(res, token);

  res.redirect('/signup-success');
});

// ────────────────────────────────────────────────────────
//  EMAIL VERIFICATION
// ────────────────────────────────────────────────────────

router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).render('verify-email', {
      title: 'Verify Email — The Citadels',
      currentPage: '',
      status: 'error',
      message: 'Missing verification token.'
    });
  }

  const { readUsers } = require('../models/User');
  const users = readUsers();
  const user = users.find(u => u.verificationToken === token);

  if (!user) {
    return res.render('verify-email', {
      title: 'Verify Email — The Citadels',
      currentPage: '',
      status: 'error',
      message: 'Invalid or expired verification link.'
    });
  }

  if (new Date(user.verificationExpiry) < new Date()) {
    return res.render('verify-email', {
      title: 'Verify Email — The Citadels',
      currentPage: '',
      status: 'error',
      message: 'This verification link has expired. Please request a new one.'
    });
  }

  updateUser(user.id, {
    emailVerified: true,
    verificationToken: null,
    verificationExpiry: null
  });

  res.render('verify-email', {
    title: 'Email Verified — The Citadels',
    currentPage: '',
    status: 'success',
    message: 'Your email has been verified successfully.'
  });
});

// ────────────────────────────────────────────────────────
//  SIGNUP SUCCESS
// ────────────────────────────────────────────────────────

router.get('/signup-success', (req, res) => {
  res.render('signup-success', {
    title: 'Account Created — The Citadels',
    currentPage: ''
  });
});

// ────────────────────────────────────────────────────────
//  LOGIN
// ────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login', {
    title: 'Sign In — The Citadels',
    currentPage: 'login',
    errors: {},
    formData: {}
  });
});

router.post('/login', loginLimiter, redirectIfAuth, async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (!errors[field]) errors[field] = issue.message;
    });
    return res.status(400).render('login', {
      title: 'Sign In — The Citadels',
      currentPage: 'login',
      errors,
      formData: req.body
    });
  }

  const { email, password } = result.data;
  const user = findByEmail(email);

  // Generic error message to prevent user enumeration
  const genericError = 'Invalid email address or password';

  if (!user) {
    return res.status(401).render('login', {
      title: 'Sign In — The Citadels',
      currentPage: 'login',
      errors: { general: genericError },
      formData: { email }
    });
  }

  // Check account lockout
  if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
    const mins = Math.ceil((new Date(user.lockUntil) - new Date()) / 60000);
    return res.status(429).render('login', {
      title: 'Sign In — The Citadels',
      currentPage: 'login',
      errors: { general: `Account temporarily locked. Try again in ${mins} minute${mins > 1 ? 's' : ''}.` },
      formData: { email }
    });
  }

  // Compare password
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1;
    const updates = { loginAttempts: attempts };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockUntil = new Date(Date.now() + LOCK_TIME_MS).toISOString();
      updates.loginAttempts = 0;
    }

    updateUser(user.id, updates);

    return res.status(401).render('login', {
      title: 'Sign In — The Citadels',
      currentPage: 'login',
      errors: { general: genericError },
      formData: { email }
    });
  }

  // Successful login: reset attempts and set last login
  updateUser(user.id, {
    loginAttempts: 0,
    lockUntil: null,
    lastLogin: new Date().toISOString()
  });

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  // Redirect to intended page or home
  const redirect = req.query.redirect || '/';
  res.redirect(redirect);
});

// ────────────────────────────────────────────────────────
//  LOGOUT
// ────────────────────────────────────────────────────────

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.redirect('/');
});

module.exports = router;
