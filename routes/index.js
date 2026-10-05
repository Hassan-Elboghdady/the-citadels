const express = require('express');
const router = express.Router();
const projects = require('../utils/projects-data');

// ─── Helper: render with common locals ────────────────────────────────────────
function render(res, view, locals) {
  res.render(view, locals);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ENGLISH ROUTES  (default)
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/', (req, res) => {
  render(res, 'home', {
    title: 'The Citadels | Premium Imported Furniture for Distinctive Spaces',
    description: 'High-end furniture solutions for residential, hospitality, office, healthcare, laboratory, airport, and control-room environments across Egypt.',
    currentPage: 'home'
  });
});

router.get('/about', (req, res) => {
  render(res, 'about', {
    title: 'About | The Citadels',
    description: 'Founded in 2009, The Citadels is a family-owned company with a proven track record in engineering, contracting, fit-out, and furniture solutions across Egypt.',
    currentPage: 'about'
  });
});

router.get('/our-partners', (req, res) => {
  render(res, 'our-partners', {
    title: 'Our Partners | The Citadels',
    description: 'Explore premium imported furniture collections for residential, hotel, office, control room, healthcare, laboratory, and airport environments.',
    currentPage: 'our-partners'
  });
});

router.get('/projects', (req, res) => {
  render(res, 'projects', {
    title: 'Projects & Experience | The Citadels',
    description: 'The Citadels has delivered furniture solutions across healthcare, railway, control-room, and specialized environments in Egypt.',
    currentPage: 'projects'
  });
});

router.get('/contact', (req, res) => {
  render(res, 'contact', {
    title: 'Contact | The Citadels',
    description: 'Get in touch with The Citadels team. Visit our showroom, call us, or send an inquiry for premium imported furniture solutions.',
    currentPage: 'contact'
  });
});

router.get('/privacy-policy', (req, res) => {
  render(res, 'privacy-policy', {
    title: 'Privacy Policy | The Citadels',
    description: 'Learn how The Citadels collects, uses, and protects your personal data.',
    currentPage: 'privacy-policy'
  });
});

router.get('/terms', (req, res) => {
  render(res, 'terms', {
    title: 'Terms & Conditions | The Citadels',
    description: 'Terms and conditions governing the use of The Citadels website and services.',
    currentPage: 'terms'
  });
});

router.get('/cookie-policy', (req, res) => {
  render(res, 'cookie-policy', {
    title: 'Cookie Policy | The Citadels',
    description: 'Learn about the cookies used on The Citadels website and how to manage them.',
    currentPage: 'cookie-policy'
  });
});

router.get('/partners/able',    (req, res) => render(res, 'partner-able',    { title: 'ABLE — Hotel & Residential Furniture | The Citadels', description: 'ABLE is the largest furniture manufacturer specializing in contemporary design in Eastern Europe with over 30 years of experience.', currentPage: 'our-partners' }));
router.get('/partners/zivella', (req, res) => render(res, 'partner-zivella', { title: 'Zivella — Office Furniture | The Citadels', description: 'Zivella Office Furniture exports to nearly 50 countries creating designs that promote well-being.', currentPage: 'our-partners' }));
router.get('/partners/falmar',  (req, res) => render(res, 'partner-falmar',  { title: 'Falmar — Office Furniture & Partitions | The Citadels', description: 'Falmar, based in Pesaro Italy since 1990, manufactures premium wall partitions, storage walls and office furniture.', currentPage: 'our-partners' }));
router.get('/partners/bosco',   (req, res) => render(res, 'partner-bosco',   { title: 'Bosco — Control Room Furniture | The Citadels', description: 'Bosco is a pioneer in designing and delivering high-tech control room solutions in 20+ countries.', currentPage: 'our-partners' }));

router.get('/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).render('404', { title: 'Not Found | The Citadels', description: '', currentPage: '' });
  render(res, 'project-detail', {
    title: `${project.name} — The Citadels`,
    description: project.description,
    currentPage: 'projects',
    project
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ARABIC ROUTES  /ar/...
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/ar', (req, res) => {
  render(res, 'home', {
    title: 'The Citadels | أثاث مستورد راقي لمساحات متميزة',
    description: 'حلول أثاث فاخرة للبيئات السكنية والضيافة والمكاتب والرعاية الصحية والمختبرات والمطارات وغرف التحكم في جميع أنحاء مصر.',
    currentPage: 'home'
  });
});

router.get('/ar/about', (req, res) => {
  render(res, 'about', {
    title: 'من نحن | The Citadels',
    description: 'تأسست عام 2009، وتتمتع The Citadels بسجل حافل في الهندسة والمقاولات والتشطيب وحلول الأثاث في مصر.',
    currentPage: 'about'
  });
});

router.get('/ar/our-partners', (req, res) => {
  render(res, 'our-partners', {
    title: 'شركاؤنا | The Citadels',
    description: 'استكشف مجموعات الأثاث المستورد الراقي للبيئات السكنية والفندقية والمكتبية وغرف التحكم والرعاية الصحية والمختبرات والمطارات.',
    currentPage: 'our-partners'
  });
});

router.get('/ar/projects', (req, res) => {
  render(res, 'projects', {
    title: 'مشاريعنا وخبرتنا | The Citadels',
    description: 'قدمت The Citadels حلول أثاث عبر قطاعات الرعاية الصحية والسكك الحديدية وغرف التحكم والبيئات المتخصصة في مصر.',
    currentPage: 'projects'
  });
});

router.get('/ar/contact', (req, res) => {
  render(res, 'contact', {
    title: 'اتصل بنا | The Citadels',
    description: 'تواصل مع فريق The Citadels. زور معرضنا أو اتصل بنا أو أرسل استفساراً للحصول على حلول أثاث فاخرة.',
    currentPage: 'contact'
  });
});

router.get('/ar/partners/able',    (req, res) => render(res, 'partner-able',    { title: 'ABLE — أثاث فنادق وسكني | The Citadels', description: 'ABLE أكبر شركة تصنيع أثاث متخصصة في التصميم المعاصر في أوروبا الشرقية بخبرة تتجاوز 30 عامًا.', currentPage: 'our-partners' }));
router.get('/ar/partners/zivella', (req, res) => render(res, 'partner-zivella', { title: 'Zivella — أثاث مكاتب | The Citadels', description: 'تصدر Zivella منتجاتها إلى ما يقارب 50 دولة بتصاميم تعزز الرفاهية والراحة.', currentPage: 'our-partners' }));
router.get('/ar/partners/falmar',  (req, res) => render(res, 'partner-falmar',  { title: 'Falmar — أثاث مكاتب وتقسيمات | The Citadels', description: 'Falmar من إيطاليا، تصنع فواصل جدارية وأثاث مكاتب فاخراً منذ عام 1990.', currentPage: 'our-partners' }));
router.get('/ar/partners/bosco',   (req, res) => render(res, 'partner-bosco',   { title: 'Bosco — أثاث غرف التحكم | The Citadels', description: 'Bosco رائدة في تصميم وتوريد حلول غرف التحكم التقنية المتقدمة في أكثر من 20 دولة.', currentPage: 'our-partners' }));

router.get('/ar/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).render('404', { title: 'الصفحة غير موجودة — The Citadels', description: '', currentPage: '' });
  render(res, 'project-detail', {
    title: `${project.name} — The Citadels`,
    description: project.description,
    currentPage: 'projects',
    project
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ITALIAN ROUTES  /it/...
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/it', (req, res) => {
  render(res, 'home', {
    title: 'The Citadels — Arredi Premium per Spazi di Carattere',
    description: 'Soluzioni di arredo di alta gamma per ambienti residenziali, hospitality, uffici, sanità, laboratori, aeroporti e sale di controllo in tutto l\'Egitto.',
    currentPage: 'home'
  });
});

router.get('/it/about', (req, res) => {
  render(res, 'about', {
    title: 'Chi Siamo — The Citadels',
    description: 'Fondata nel 2009, The Citadels vanta un solido percorso nell\'ingegneria, nell\'appalto di lavori, negli allestimenti e nelle soluzioni di arredo in Egitto.',
    currentPage: 'about'
  });
});

router.get('/it/our-partners', (req, res) => {
  render(res, 'our-partners', {
    title: 'I Nostri Partner — The Citadels',
    description: 'Esplora le collezioni di arredi premium d\'importazione per ambienti residenziali, hotel, uffici, sale di controllo, sanità, laboratori e aeroporti.',
    currentPage: 'our-partners'
  });
});

router.get('/it/projects', (req, res) => {
  render(res, 'projects', {
    title: 'Progetti ed Esperienza — The Citadels',
    description: 'The Citadels ha realizzato soluzioni di arredo in ambienti sanitari, ferroviari, sale di controllo e ambienti specializzati in Egitto.',
    currentPage: 'projects'
  });
});

router.get('/it/contact', (req, res) => {
  render(res, 'contact', {
    title: 'Contattaci — The Citadels',
    description: 'Mettiti in contatto con il team di The Citadels. Visita il nostro showroom, chiamaci o invia una richiesta per soluzioni di arredo premium.',
    currentPage: 'contact'
  });
});

router.get('/it/partners/able',    (req, res) => render(res, 'partner-able',    { title: 'ABLE — Arredi Hotel e Residenziali | The Citadels', description: 'ABLE è il più grande produttore di arredi specializzato nel design contemporaneo in Europa orientale con oltre 30 anni di esperienza.', currentPage: 'our-partners' }));
router.get('/it/partners/zivella', (req, res) => render(res, 'partner-zivella', { title: 'Zivella — Arredi per Ufficio | The Citadels', description: 'Zivella esporta in quasi 50 paesi creando design che promuovono il benessere.', currentPage: 'our-partners' }));
router.get('/it/partners/falmar',  (req, res) => render(res, 'partner-falmar',  { title: 'Falmar — Arredi e Pareti Divisorie per Uffici | The Citadels', description: 'Falmar, con sede a Pesaro dal 1990, produce pareti divisorie e arredi per uffici di alta qualità.', currentPage: 'our-partners' }));
router.get('/it/partners/bosco',   (req, res) => render(res, 'partner-bosco',   { title: 'Bosco — Arredi per Sale di Controllo | The Citadels', description: 'Bosco è pioniera nella progettazione e fornitura di soluzioni hi-tech per sale di controllo in oltre 20 paesi.', currentPage: 'our-partners' }));

router.get('/it/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).render('404', { title: 'Pagina non trovata — The Citadels', description: '', currentPage: '' });
  render(res, 'project-detail', {
    title: `${project.name} — The Citadels`,
    description: project.description_it || project.description,
    currentPage: 'projects',
    project
  });
});

module.exports = router;
