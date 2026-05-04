#!/usr/bin/env node
// Capture full-page screenshots of every Lumen route at desktop + mobile widths.
// Also capture hover and focus states on key buttons, plus light-mode parity.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'screenshots');
const BASE = 'https://warp-lumen-design-guidelines.vercel.app';

const ROUTES = ['/foundations', '/library', '/saas', '/landing', '/tool', '/commerce', '/mobile', '/desktop'];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 }, // iPhone 14
};

async function capture() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      const slug = route.replace('/', '') || 'home';
      const url = BASE + route;
      console.log(`[${vpName}] ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(700);
        // Full-page screenshot
        await page.screenshot({ path: join(OUT, `${vpName}-${slug}-fullpage.png`), fullPage: true, type: 'png' });
        // Above-fold screenshot
        await page.screenshot({ path: join(OUT, `${vpName}-${slug}-abovefold.png`), fullPage: false, type: 'png' });
      } catch (e) {
        console.error(`  FAIL: ${e.message}`);
      }
    }

    // Light-mode pass at desktop only
    if (vpName === 'desktop') {
      // Toggle theme on the foundations page
      try {
        await page.goto(BASE + '/foundations', { waitUntil: 'networkidle' });
        // Click the theme-toggle button (sun/moon icon in header)
        const themeBtn = await page.$('button[aria-label*="theme" i], button[aria-label*="mode" i], header button:has(svg)');
        if (themeBtn) {
          await themeBtn.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: join(OUT, `desktop-foundations-LIGHT-abovefold.png`), fullPage: false });
        }
      } catch (e) { console.error('light-mode toggle:', e.message); }
    }

    // Hover-state captures on key buttons (desktop only)
    if (vpName === 'desktop') {
      try {
        await page.goto(BASE + '/library', { waitUntil: 'networkidle' });
        await page.waitForTimeout(700);
        const btn = await page.$('button:visible, a[role="button"]:visible');
        if (btn) {
          await btn.hover();
          await page.waitForTimeout(300);
          await page.screenshot({ path: join(OUT, 'desktop-library-button-hover.png'), fullPage: false, clip: await btn.boundingBox().then(b => b ? { x: Math.max(0, b.x - 20), y: Math.max(0, b.y - 20), width: Math.min(700, b.width + 200), height: Math.min(300, b.height + 100) } : undefined) });
        }
      } catch (e) { console.error('hover:', e.message); }
    }

    await ctx.close();
  }
  await browser.close();
  console.log('done');
}

capture().catch(e => { console.error(e); process.exit(1); });
