import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'mobile';

const dir = join(process.cwd(), 'temporary screenshots');
mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0', 10));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}-${label}.png`;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

await page.evaluate(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const height = document.body.scrollHeight;
  for (let y = 0; y < height; y += 300) {
    window.scrollTo(0, y);
    await delay(80);
  }
  window.scrollTo(0, 0);
  await delay(500);
});

await new Promise(r => setTimeout(r, 800));

const path = join(dir, filename);
await page.screenshot({ path, fullPage: true });
console.log(`Screenshot saved: ${path}`);

await browser.close();
