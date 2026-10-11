/**
 * optimize-images.js
 * Converts all hero/project/partner images to WebP with quality and size limits.
 * Run with:  node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const IMAGES_ROOT = path.join(__dirname, '..', 'public', 'images');
const WEBP_QUALITY = 78;           // 0–100. 78 is a great quality/size balance
const MAX_WIDTH    = 1920;         // Resize large images down to max 1920 px wide
const LOGO_QUALITY = 85;           // Logos get slightly higher quality
const LOGO_MAX_W   = 400;          // Logos don't need to be wide

// File extensions to process
const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

// Directories where we want LOGO settings (higher quality, smaller max width)
const LOGO_DIRS = ['partners'];

let converted = 0;
let skipped   = 0;
let totalSaved = 0;

function isLogoDir(filePath) {
  return LOGO_DIRS.some(d => filePath.includes(path.sep + d + path.sep));
}

async function processFile(filePath) {
  const ext  = path.extname(filePath);
  if (!CONVERTIBLE.has(ext)) return;

  const webpPath = filePath.replace(/\.[^.]+$/, '.webp');

  // Skip if .webp already exists and is newer than source
  if (fs.existsSync(webpPath)) {
    const srcStat  = fs.statSync(filePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      return;
    }
  }

  const isLogo  = isLogoDir(filePath);
  const quality = isLogo ? LOGO_QUALITY : WEBP_QUALITY;
  const maxW    = isLogo ? LOGO_MAX_W   : MAX_WIDTH;

  try {
    const srcSize = fs.statSync(filePath).size;

    await sharp(filePath)
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(webpPath);

    const dstSize = fs.statSync(webpPath).size;
    const saved   = srcSize - dstSize;
    totalSaved   += saved;

    const pct = ((saved / srcSize) * 100).toFixed(1);
    console.log(
      `  ✓  ${path.relative(IMAGES_ROOT, filePath).padEnd(55)} ` +
      `${(srcSize / 1024).toFixed(0).padStart(6)} KB → ` +
      `${(dstSize / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`
    );
    converted++;
  } catch (err) {
    console.error(`  ✗  ${filePath}: ${err.message}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const tasks   = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      tasks.push(...walkDir(full));
    } else {
      tasks.push(full);
    }
  }
  return tasks;
}

(async () => {
  console.log('\n🖼  The Citadels — Image Optimizer\n');
  const files = walkDir(IMAGES_ROOT);
  for (const f of files) {
    await processFile(f);
  }
  console.log('\n──────────────────────────────────────────────');
  console.log(`  Converted : ${converted} file(s)`);
  console.log(`  Skipped   : ${skipped} (already up-to-date)`);
  console.log(`  Saved     : ${(totalSaved / 1024 / 1024).toFixed(2)} MB total`);
  console.log('──────────────────────────────────────────────\n');
})();
