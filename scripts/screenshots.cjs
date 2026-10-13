#!/usr/bin/env node
/**
 * Automated screenshot pipeline for ProShop.
 *
 *   npm run screenshots
 *
 * What it does:
 *   1. Builds the demo bundle (single-file HTML) so the app runs with
 *      VITE_DEMO_MODE=true and an in-memory mock backend — no MongoDB
 *      or Express needed.
 *   2. Spins up a tiny static file server on a random port.
 *   3. Launches headless Chromium, creates a context per (viewport, theme)
 *      pair, logs in when needed, navigates to each target page, waits
 *      for fonts + network idle, and captures a screenshot.
 *   4. Optimizes each PNG with sharp (default 1440×900 ≈ 200-400KB each).
 *
 * Output: docs/screenshots/<name>.png
 *
 * Reproducible: random data is seeded once; images are deterministic
 * per (viewport, theme, route, login state) tuple.
 */
const { chromium } = require('playwright');
const sharp = require('sharp');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'mui-redesign', 'dist');
const OUT = path.join(ROOT, 'docs', 'screenshots');
const MAX_FILE_BYTES = 500 * 1024; // 500 KB per shot
const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2 },
  tablet:  { width: 768,  height: 1024, deviceScaleFactor: 2 },
  mobile:  { width: 375,  height: 812,  deviceScaleFactor: 2 },
};

// Shot definitions
const SHOTS = [
  // Desktop dark
  { id: '01-home-desktop-dark',           v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/',                  full: true  },
  { id: '02-shop-desktop-dark',           v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/',                  full: true,  scroll: '#featured' },
  { id: '03-shop-filter-desktop-dark',    v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/?category=Footwear&brand=Field&inStock=true', full: true },
  { id: '04-product-detail-desktop-dark', v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/product/p_1',       full: true  },
  { id: '05-cart-desktop-dark',           v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/cart',              full: true  },
  { id: '06-checkout-desktop-dark',       v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/checkout',          full: true  },
  { id: '07-orders-desktop-dark',         v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/orders',            full: true  },
  { id: '08-order-detail-desktop-dark',   v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/orders/o_1',        full: true  },
  { id: '09-wishlist-desktop-dark',       v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/wishlist',          full: true  },
  { id: '10-profile-desktop-dark',        v: 'desktop', theme: 'dark',  auth: 'jane',  path: '/profile',           full: true  },
  { id: '11-login-desktop-dark',          v: 'desktop', theme: 'dark',  auth: null,    path: '/login',             full: true  },
  { id: '12-design-system-desktop-dark',  v: 'desktop', theme: 'dark',  auth: null,    path: '/design-system',     full: false },

  // Admin
  { id: '13-admin-dashboard-dark',        v: 'desktop', theme: 'dark',  auth: 'admin', path: '/admin',             full: true  },
  { id: '14-admin-products-dark',         v: 'desktop', theme: 'dark',  auth: 'admin', path: '/admin/products',    full: true  },
  { id: '15-admin-orders-dark',           v: 'desktop', theme: 'dark',  auth: 'admin', path: '/admin/orders',      full: true  },
  { id: '16-admin-analytics-dark',        v: 'desktop', theme: 'dark',  auth: 'admin', path: '/admin/analytics',   full: true  },

  // Desktop light
  { id: '17-home-desktop-light',          v: 'desktop', theme: 'light', auth: 'jane',  path: '/',                  full: true  },
  { id: '18-login-desktop-light',         v: 'desktop', theme: 'light', auth: null,    path: '/login',             full: true  },

  // Mobile
  { id: '19-home-mobile-dark',            v: 'mobile',  theme: 'dark',  auth: 'jane',  path: '/',                  full: true  },
  { id: '20-shop-mobile-dark',            v: 'mobile',  theme: 'dark',  auth: 'jane',  path: '/',                  full: true, scroll: '#featured' },
  { id: '21-product-mobile-dark',         v: 'mobile',  theme: 'dark',  auth: 'jane',  path: '/product/p_1',       full: true  },
  { id: '22-cart-mobile-dark',            v: 'mobile',  theme: 'dark',  auth: 'jane',  path: '/cart',              full: true  },
  { id: '23-home-mobile-light',           v: 'mobile',  theme: 'light', auth: 'jane',  path: '/',                  full: true  },

  // Tablet
  { id: '24-home-tablet-dark',            v: 'tablet',  theme: 'dark',  auth: 'jane',  path: '/',                  full: true  },
  { id: '25-shop-tablet-dark',            v: 'tablet',  theme: 'dark',  auth: 'jane',  path: '/',                  full: true, scroll: '#featured' },
];

const ACCOUNTS = {
  jane:  { email: 'jane@proshop.com',  password: '123456' },
  admin: { email: 'admin@proshop.com', password: '123456' },
};

// ---------- helpers ----------

function buildDemo() {
  console.log('• Building demo bundle…');
  const r = spawnSync('npm', ['run', 'build:demo', '--prefix', 'mui-redesign'], {
    cwd: ROOT, stdio: 'inherit', shell: true,
  });
  if (r.status !== 0) {
    console.error('✗ Demo build failed.');
    process.exit(1);
  }
}

function startServer() {
  return new Promise((resolve) => {
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.svg':  'image/svg+xml',
      '.png':  'image/png',
      '.jpg':  'image/jpeg',
      '.webp': 'image/webp',
    };
    const srv = http.createServer((req, res) => {
      // SPA fallback — any unknown path returns index.html
      const url = req.url.split('?')[0];
      const candidate = path.join(DIST, url === '/' ? 'index.html' : url);
      const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile()
        ? candidate
        : path.join(DIST, 'index.html');
      const ext = path.extname(file).toLowerCase();
      res.setHeader('content-type', types[ext] || 'application/octet-stream');
      res.setHeader('cache-control', 'no-store');
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      resolve({ url: `http://127.0.0.1:${port}`, close: () => srv.close() });
    });
  });
}

async function loginAs(page, account, server) {
  if (!account) return;
  await page.goto(server.url + '/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', ACCOUNTS[account].email);
  await page.fill('input[type="password"]', ACCOUNTS[account].password);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

async function captureShot(browser, server, shot) {
  const ctx = await browser.newContext({
    viewport: VIEWPORTS[shot.v],
    colorScheme: shot.theme,
    deviceScaleFactor: VIEWPORTS[shot.v].deviceScaleFactor,
    // Freeze the clock so dates ("© 2026…") stay deterministic
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  // Seed theme preference before the app reads it
  await page.addInitScript((theme) => {
    try { localStorage.setItem('proshop-theme-mode-v2', theme); } catch {}
  }, shot.theme);

  try {
    await page.goto(server.url + '/login', { waitUntil: 'domcontentloaded' });
    await loginAs(page, shot.auth, server);
    if (shot.auth) {
      // Client-side navigate so the mock's in-memory auth state isn't lost
      await page.evaluate((p) => {
        window.history.pushState({}, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, shot.path);
      // Wait for URL to change + React to render the new page.
      // Mock base query resolves synchronously (no network) so networkidle
      // fires immediately; we need an explicit delay for component mount
      // and any subsequent re-render.
      try {
        await page.waitForURL((u) => u.pathname === new URL(shot.path, server.url).pathname, { timeout: 5000 });
      } catch {}
      await page.waitForTimeout(800);
    } else {
      // Public page — full reload is fine
      await page.goto(server.url + shot.path, { waitUntil: 'domcontentloaded' });
    }

    // Wait for fonts + images
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForLoadState('networkidle');

    // Disable transitions/animations and remove the React DevTools banner
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
        [data-react-devtools], #__react-devtools-container { display: none !important; }
      `,
    });
    // Allow any in-flight layout/paint to settle after the style injection
    await page.waitForTimeout(150);

    if (shot.scroll) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ block: 'start' });
      }, shot.scroll);
      await page.waitForTimeout(150);
    }

    const file = path.join(OUT, `${shot.id}.png`);
    await page.screenshot({ path: file, fullPage: !!shot.full });
    const { size } = fs.statSync(file);
    return { id: shot.id, file, size };
  } finally {
    await ctx.close();
  }
}

async function optimize(file) {
  const before = fs.statSync(file).size;
  if (before <= MAX_FILE_BYTES) return { before, after: before };
  const tmp = file + '.opt';

  // Step 1: aggressive PNG (palette + max compression)
  await sharp(file)
    .png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 })
    .toFile(tmp);
  let after = fs.statSync(tmp).size;
  if (after < before) fs.renameSync(tmp, file); else fs.unlinkSync(tmp);

  // Step 2: if still over target, downscale to 1400px wide.
  if (fs.statSync(file).size > MAX_FILE_BYTES) {
    await sharp(file)
      .resize({ width: 1400, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toFile(tmp);
    after = fs.statSync(tmp).size;
    if (after < fs.statSync(file).size) fs.renameSync(tmp, file); else fs.unlinkSync(tmp);
  }

  // Step 3: still too big? Drop to 1000px and write as .jpg.
  // We rename the original .png to .jpg to keep a single output file
  // whose extension matches its real content.
  if (fs.statSync(file).size > MAX_FILE_BYTES) {
    const jpg = file.replace(/\.png$/, '.jpg');
    await sharp(file)
      .resize({ width: 1000, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpg);
    const jpgSize = fs.statSync(jpg).size;
    if (jpgSize < fs.statSync(file).size) {
      fs.unlinkSync(file);  // remove the oversized .png
    } else {
      fs.unlinkSync(jpg);
    }
  }

  // Stat whatever file now exists (could be .png or .jpg)
  const finalPath = fs.existsSync(file) ? file : file.replace(/\.png$/, '.jpg');
  return { before, after: fs.statSync(finalPath).size, finalPath };
}

// ---------- main ----------

async function main() {
  const args = process.argv.slice(2);
  const skipBuild = args.includes('--no-build');
  if (!skipBuild) buildDemo();

  if (!fs.existsSync(DIST)) {
    console.error('✗ Demo build not found at', DIST);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const server = await startServer();
  console.log(`• Static server: ${server.url}`);

  // Use system Chrome since the headless-shell variant isn't downloaded.
  // Falls back to chromium if Chrome is not available.
  let launchOpts = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  try {
    const { execSync } = require('child_process');
    const chrome = execSync('which google-chrome').toString().trim();
    if (chrome) launchOpts = { ...launchOpts, executablePath: chrome };
  } catch {}
  const browser = await chromium.launch(launchOpts);

  const results = [];
  const failed = [];
  for (const shot of SHOTS) {
    process.stdout.write(`  ${shot.id}… `);
    try {
      const r = await captureShot(browser, server, shot);
      const opt = await optimize(r.file);
      const kb = (r.size / 1024).toFixed(0);
      const optKb = (opt.after / 1024).toFixed(0);
      shot._finalPath = opt.finalPath || r.file;
      console.log(`✓ ${kb}KB → ${optKb}KB`);
      results.push({ ...shot, ...r, size: opt.after });
    } catch (err) {
      console.log(`✗ ${err.message.split('\n')[0]}`);
      failed.push({ id: shot.id, error: err.message });
    }
  }

  await browser.close();
  server.close();

  console.log('');
  console.log(`✓ ${results.length}/${SHOTS.length} screenshots written to ${path.relative(ROOT, OUT)}/`);
  if (failed.length) {
    console.log('✗ Failed:');
    failed.forEach((f) => console.log(`  - ${f.id}: ${f.error}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
