const express = require('express');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// i18n middleware — injects `t` (translations) and `lang` into every render
app.use((req, res, next) => {
  // Detect language from URL prefix /ar/... or /it/... or default to en
  const isArabic = req.path.startsWith('/ar') || req.path === '/ar';
  const isItalian = req.path.startsWith('/it') || req.path === '/it';
  const lang = isArabic ? 'ar' : isItalian ? 'it' : 'en';
  const localePath = path.join(__dirname, 'locales', `${lang}.json`);
  const t = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  res.locals.t = t;
  res.locals.lang = lang;
  // Build equivalent URLs in the other languages
  const basePath = lang === 'ar' ? req.path.replace(/^\/ar/, '') || '/'
                 : lang === 'it' ? req.path.replace(/^\/it/, '') || '/'
                 : req.path;
  res.locals.enUrl = basePath;
  res.locals.arUrl = '/ar' + basePath;
  res.locals.itUrl = '/it' + basePath;
  // Keep backward-compat
  res.locals.alternateLangUrl = lang === 'ar' ? basePath : '/ar' + basePath;
  // Convenient prefix: '' | '/ar' | '/it'
  res.locals.pfx = lang === 'ar' ? '/ar' : lang === 'it' ? '/it' : '';
  next();
});

app.use('/', routes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found — The Citadels',
    currentPage: ''
  });
});

app.listen(PORT, () => {
  console.log(`The Citadels running at http://localhost:${PORT}`);
});
