#!/usr/bin/env node
// Dark-mode capture pass + corrected /ecommerce route + key hover states.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'screenshots');
const BASE = 'https://warp-lumen-design-guidelines.vercel.app';

const ROUTES = ['/foundations', '/library', '/saas', '/landing', '/tool', '/ecommerce', '/mobile', '/desktop'];

async function capture() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  // ---------------- Desktop dark ----------------
  const ctxDark = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  const pageDark = await ctxDark.newPage();
  for (const route of ROUTES) {
    const slug = route.replace('/', '') || 'home';
    console.log(`[dark-desktop] ${route}`);
    try {
      await pageDark.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      // Force dark via root attribute
      await pageDark.evaluate(() => {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.dataset.mood = 'obsidian-mint';
      });
      await pageDark.waitForTimeout(500);
      await pageDark.screenshot({ path: join(OUT, `dark-${slug}-fullpage.png`), fullPage: true, type: 'png' });
      await pageDark.screenshot({ path: join(OUT, `dark-${slug}-abovefold.png`), fullPage: false, type: 'png' });
    } catch (e) { console.error(`  fail: ${e.message}`); }
  }
  await ctxDark.close();

  // ---------------- Hover/focus states (light, common viewport) ----------------
  const ctxLight = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const pageL = await ctxLight.newPage();
  // Landing primary CTA hover
  try {
    await pageL.goto(BASE + '/landing', { waitUntil: 'networkidle' });
    await pageL.waitForTimeout(500);
    const cta = await pageL.locator('button, a').filter({ hasText: /get started/i }).first();
    if (await cta.count()) {
      const box = await cta.boundingBox();
      if (box) {
        await cta.hover();
        await pageL.waitForTimeout(400);
        await pageL.screenshot({ path: join(OUT, 'hover-landing-getstarted.png'), clip: { x: Math.max(0, box.x - 30), y: Math.max(0, box.y - 30), width: Math.min(800, box.width + 400), height: Math.min(200, box.height + 80) } });
      }
    }
  } catch (e) { console.error('hover landing:', e.message); }
  // SaaS Active tab hover
  try {
    await pageL.goto(BASE + '/saas', { waitUntil: 'networkidle' });
    await pageL.waitForTimeout(800);
    const newShip = await pageL.locator('button').filter({ hasText: /\+ new shipment/i }).first();
    if (await newShip.count()) {
      const box = await newShip.boundingBox();
      if (box) {
        await newShip.hover();
        await pageL.waitForTimeout(400);
        await pageL.screenshot({ path: join(OUT, 'hover-saas-newshipment.png'), clip: { x: Math.max(0, box.x - 30), y: Math.max(0, box.y - 30), width: Math.min(800, box.width + 400), height: Math.min(200, box.height + 80) } });
      }
    }
  } catch (e) { console.error('hover saas:', e.message); }
  // Tool Get rates hover
  try {
    await pageL.goto(BASE + '/tool', { waitUntil: 'networkidle' });
    await pageL.waitForTimeout(800);
    const getRates = await pageL.locator('button').filter({ hasText: /get rates/i }).first();
    if (await getRates.count()) {
      const box = await getRates.boundingBox();
      if (box) {
        await getRates.hover();
        await pageL.waitForTimeout(400);
        await pageL.screenshot({ path: join(OUT, 'hover-tool-getrates.png'), clip: { x: Math.max(0, box.x - 30), y: Math.max(0, box.y - 30), width: Math.min(800, box.width + 400), height: Math.min(200, box.height + 80) } });
      }
    }
  } catch (e) { console.error('hover tool:', e.message); }
  // Foundations theme toggle hover
  try {
    await pageL.goto(BASE + '/foundations', { waitUntil: 'networkidle' });
    await pageL.waitForTimeout(500);
    const themeBtn = await pageL.locator('header button[aria-label*="theme" i], header button:has(svg)').first();
    if (await themeBtn.count()) {
      const box = await themeBtn.boundingBox();
      if (box) {
        await themeBtn.hover();
        await pageL.waitForTimeout(400);
        await pageL.screenshot({ path: join(OUT, 'hover-foundations-theme-toggle.png'), clip: { x: Math.max(0, box.x - 60), y: Math.max(0, box.y - 30), width: Math.min(400, box.width + 120), height: Math.min(200, box.height + 60) } });
      }
    }
  } catch (e) { console.error('hover theme:', e.message); }
  // Foundations search focus
  try {
    await pageL.goto(BASE + '/foundations', { waitUntil: 'networkidle' });
    await pageL.waitForTimeout(500);
    const search = await pageL.locator('input[placeholder*="search" i]').first();
    if (await search.count()) {
      await search.focus();
      await pageL.waitForTimeout(400);
      const box = await search.boundingBox();
      if (box) await pageL.screenshot({ path: join(OUT, 'focus-foundations-search.png'), clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 20), width: Math.min(900, box.width + 80), height: Math.min(150, box.height + 50) } });
    }
  } catch (e) { console.error('focus search:', e.message); }
  await ctxLight.close();

  await browser.close();
  console.log('done');
}

capture().catch(e => { console.error(e); process.exit(1); });
