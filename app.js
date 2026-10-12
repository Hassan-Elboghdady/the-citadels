require('dotenv').config();
const express        = require('express');
const path           = require('path');
const fs             = require('fs');
const helmet         = require('helmet');
const mongoose       = require('mongoose');
const rateLimit      = require('express-rate-limit');
const mongoSanitize  = require('express-mongo-sanitize');
const routes         = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy (essential for Cloud hosts like Render, Railway, AWS, Nginx)
// Allows express-rate-limit and req.ip to accurately identify real client IP addresses
app.set('trust proxy', 1);

// Connect to MongoDB
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb+srv://your_username:your_password@cluster0.mongodb.net/citadels?retryWrites=true&w=majority') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.log('⚠️  MONGO_URI not configured or using placeholder. Database disabled.');
}

// ── Security headers (helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    // Content-Security-Policy: lock down what the browser is allowed to load
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'", 'https://www.google.com', 'https://www.gstatic.com'],
        styleSrc:    ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
        imgSrc:      ["'self'", 'data:', 'https://www.gstatic.com'],
        connectSrc:  ["'self'", 'https://www.google.com'],
        frameSrc:    ["'self'", 'https://www.google.com'],  // reCAPTCHA needs this
        objectSrc:   ["'none'"],
        baseUri:     ["'self'"],
        formAction:  ["'self'"],
        frameAncestors: ["'none'"],        // Prevents Clickjacking
        upgradeInsecureRequests: [],
      },
    },
    // Cross-Origin headers
    crossOriginEmbedderPolicy: false,      // Keep false — Google Fonts needs it
    crossOriginOpenerPolicy:   { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    // Other protections (all on by default in helmet)
    dnsPrefetchControl:  { allow: false },
    frameguard:          { action: 'deny' }, // X-Frame-Options: DENY
    hidePoweredBy:       true,              // Remove X-Powered-By: Express
    hsts: {
      maxAge:            365 * 24 * 60 * 60, // 1 year in seconds
      includeSubDomains: true,
      preload:           true,
    },
    ieNoOpen:            true,              // X-Download-Options for old IE
    noSniff:             true,              // X-Content-Type-Options: nosniff
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy:      { policy: 'strict-origin-when-cross-origin' },
    xssFilter:           true,             // Legacy X-XSS-Protection header
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Assets & Browser Caching (Bandwidth Optimization) ─────────────────
// Eliminates asset re-downloads on Render for returning visitors
const isDev = process.env.NODE_ENV === 'development';

const staticCacheOptions = isDev
  ? { maxAge: 0 }
  : {
      maxAge: '30d',
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Images, fonts, and PDFs: 1 year immutable cache
        if (/\.(webp|avif|png|jpe?g|gif|svg|ico|pdf|woff2?|ttf|eot)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        // CSS & JS: 30 days cache with stale-while-revalidate
        else if (/\.(css|js)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
        }
      }
    };

app.use(express.static(path.join(__dirname, 'public'), staticCacheOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Handle JSON payloads for contact API

// ── NoSQL Injection Protection ─────────────────────────────────────────────
// Strips $ and . operators from ALL req.body, req.params, req.query globally
// Prevents: { "email": { "$gt": "" } } style MongoDB injection attacks
app.use(mongoSanitize({
  replaceWith: '_',          // Replace banned chars with _ instead of deleting
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Sanitized suspicious input on key: ${key} from IP: ${req.ip}`);
  }
}));

// i18n middleware — injects `t` (translations) and `lang` into every render
app.use((req, res, next) => {
  // Detect language from URL prefix /ar/... or /it/... or default to en
  const isArabic = req.path.startsWith('/ar') || req.path === '/ar';
  const isItalian = req.path.startsWith('/it') || req.path === '/it';
  const isFrench = req.path.startsWith('/fr') || req.path === '/fr';
  const lang = isArabic ? 'ar' : isItalian ? 'it' : isFrench ? 'fr' : 'en';
  const localePath = path.join(__dirname, 'locales', `${lang}.json`);
  const t = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  res.locals.t = t;
  res.locals.lang = lang;
  // Build equivalent URLs in the other languages
  const basePath = lang === 'ar' ? req.path.replace(/^\/ar/, '') || '/'
                 : lang === 'it' ? req.path.replace(/^\/it/, '') || '/'
                 : lang === 'fr' ? req.path.replace(/^\/fr/, '') || '/'
                 : req.path;
  res.locals.enUrl = basePath;
  res.locals.arUrl = '/ar' + basePath;
  res.locals.itUrl = '/it' + basePath;
  res.locals.frUrl = '/fr' + basePath;
  // Keep backward-compat
  res.locals.alternateLangUrl = lang === 'ar' ? basePath : '/ar' + basePath;
  // Convenient prefix: '' | '/ar' | '/it' | '/fr'
  res.locals.pfx = lang === 'ar' ? '/ar' : lang === 'it' ? '/it' : lang === 'fr' ? '/fr' : '';
  next();
});

// ── Rate Limiting ─────────────────────────────────────────────────────────────
// 1. Global DDoS & scraping protection: max 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP address. Please try again after 15 minutes.'
});
app.use(globalLimiter);

// 2. Contact form: strict limit of max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please wait 15 minutes and try again.' }
});
app.use('/api/contact', contactLimiter);

app.use('/', routes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found — The Citadels',
    currentPage: ''
  });
});

// ── 500 Internal Server Error Handler ─────────────────────────────────────────
// Catches unhandled errors and renders a clean page without leaking stack traces
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Server Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  // Handle API requests with clean JSON
  if (req.path.startsWith('/api/') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error. Please try again later.'
        : err.message
    });
  }

  // Ensure basic i18n locals exist even if the error occurred early
  if (!res.locals.t) {
    try {
      const fallbackLocale = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', 'en.json'), 'utf8'));
      res.locals.t = fallbackLocale;
      res.locals.lang = 'en';
      res.locals.pfx = '';
      res.locals.enUrl = '/';
      res.locals.arUrl = '/ar';
      res.locals.itUrl = '/it';
      res.locals.frUrl = '/fr';
      res.locals.alternateLangUrl = '/ar';
    } catch (e) {}
  }

  // Render clean 500 error view for page requests
  res.status(500).render('500', {
    title: 'Server Error — The Citadels',
    currentPage: ''
  });
});

app.listen(PORT, () => {
  console.log(`The Citadels running at http://localhost:${PORT}`);
});
