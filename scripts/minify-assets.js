/**
 * minify-assets.js
 * Minifies all CSS and JS files, writing .min.css / .min.js next to the originals.
 * Run with:  node scripts/minify-assets.js
 */

const fs      = require('fs');
const path    = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const CSS_DIR  = path.join(__dirname, '..', 'public', 'css');
const JS_DIR   = path.join(__dirname, '..', 'public', 'js');

let cssCount = 0, jsCount = 0;
let cssSaved = 0, jsSaved = 0;

// ─── CSS ─────────────────────────────────────────────────────────────────────
async function minifyCSS() {
  console.log('\n🎨  Minifying CSS…');

  const files = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css') && !f.endsWith('.min.css'));

  for (const file of files) {
    const src  = path.join(CSS_DIR, file);
    const dest = path.join(CSS_DIR, file.replace('.css', '.min.css'));

    try {
      const srcSize = fs.statSync(src).size;
      const css     = new CleanCSS({ level: 2 });
      const result  = css.minify(fs.readFileSync(src, 'utf8'));

      if (result.errors && result.errors.length > 0) {
        console.error(`  ✗  ${file}: ${result.errors.join(', ')}`);
        continue;
      }

      fs.writeFileSync(dest, result.styles, 'utf8');

      const dstSize = fs.statSync(dest).size;
      const saved   = srcSize - dstSize;
      cssSaved     += saved;
      cssCount++;

      console.log(
        `  ✓  ${file.padEnd(28)} ${(srcSize / 1024).toFixed(1).padStart(6)} KB → ` +
        `${(dstSize / 1024).toFixed(1).padStart(5)} KB  (-${((saved / srcSize) * 100).toFixed(1)}%)`
      );
    } catch (err) {
      console.error(`  ✗  ${file}: ${err.message}`);
    }
  }
}

// ─── JS ──────────────────────────────────────────────────────────────────────
async function minifyJS() {
  console.log('\n⚡  Minifying JS…');
  const files = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));

  for (const file of files) {
    const src  = path.join(JS_DIR, file);
    const dest = path.join(JS_DIR, file.replace('.js', '.min.js'));

    try {
      const srcSize = fs.statSync(src).size;
      const code    = fs.readFileSync(src, 'utf8');

      const result  = await minify(code, {
        compress: { drop_console: false, passes: 2 },
        mangle:   true,
        format:   { comments: false }
      });

      if (!result.code) {
        console.error(`  ✗  ${file}: terser returned nothing`);
        continue;
      }

      fs.writeFileSync(dest, result.code, 'utf8');

      const dstSize = fs.statSync(dest).size;
      const saved   = srcSize - dstSize;
      jsSaved      += saved;
      jsCount++;

      console.log(
        `  ✓  ${file.padEnd(28)} ${(srcSize / 1024).toFixed(1).padStart(6)} KB → ` +
        `${(dstSize / 1024).toFixed(1).padStart(5)} KB  (-${((saved / srcSize) * 100).toFixed(1)}%)`
      );
    } catch (err) {
      console.error(`  ✗  ${file}: ${err.message}`);
    }
  }
}

(async () => {
  console.log('\n⚙️   The Citadels — Asset Minifier\n');
  await minifyCSS();
  await minifyJS();
  console.log('\n──────────────────────────────────────────────');
  console.log(`  CSS minified : ${cssCount} file(s)  (saved ${(cssSaved / 1024).toFixed(1)} KB)`);
  console.log(`  JS  minified : ${jsCount} file(s)  (saved ${(jsSaved  / 1024).toFixed(1)} KB)`);
  console.log('──────────────────────────────────────────────\n');
})();
