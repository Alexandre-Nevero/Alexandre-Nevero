#!/usr/bin/env node
/**
 * GitHub serves README images as <img>, so links inside one PNG/SVG never fire.
 * Render the hero, then slice the header into abutting linked PNGs so Work /
 * Stats / Contact stay clickable. Contact + body open LinkedIn.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const measureRoot = '/tmp/gh-hero-measure';
const puppeteerPath = path.join(measureRoot, 'node_modules/puppeteer-core');
const heroPath = path.join(root, 'assets/profile-hero.png');
const outDir = path.join(root, 'assets/hotspots');
const W = 2048;
const H = 1276;
const LI = 'https://www.linkedin.com/in/alexandre-andrei-nevero/';
const GH = 'https://github.com/Alexandre-Nevero';
const WORK = 'https://github.com/Alexandre-Nevero/SelyoPass';

if (!fs.existsSync(chrome)) {
  console.error('Google Chrome is required to render the profile hero.');
  process.exit(1);
}

if (!fs.existsSync(puppeteerPath)) {
  execFileSync('npm', ['install', '--prefix', measureRoot, 'puppeteer-core@24'], {
    stdio: 'inherit'
  });
}

const puppeteer = require(puppeteerPath);

function pad(x0, x1, p) {
  return [Math.max(0, x0 - p), Math.min(W, x1 + p)];
}

function buildSegments(cuts, defaultHref) {
  const segments = [];
  let x = 0;
  for (const cut of cuts) {
    if (cut.x0 > x) {
      segments.push({
        name: cut.gapName || `gap-${segments.length}`,
        x0: x,
        x1: cut.x0,
        href: cut.gapHref || defaultHref
      });
    }
    segments.push({ name: cut.name, x0: cut.x0, x1: cut.x1, href: cut.href });
    x = cut.x1;
  }
  if (x < W) {
    segments.push({ name: 'tail', x0: x, x1: W, href: defaultHref });
  }
  return segments.filter((s) => s.x1 > s.x0);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'new',
    args: ['--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(root, 'assets/hero.html')}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  await new Promise((r) => setTimeout(r, 1500));

  const b = await page.evaluate(() => {
    const grab = (sel) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`missing ${sel}`);
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        right: Math.round(r.right),
        bottom: Math.round(r.bottom)
      };
    };
    return {
      work: grab('#nav-work'),
      stats: grab('#nav-stats'),
      contact: grab('#nav-contact'),
      header: grab('header')
    };
  });

  await page.screenshot({
    path: heroPath,
    type: 'png',
    clip: { x: 0, y: 0, width: W, height: H }
  });
  await browser.close();

  const stripBottom = Math.max(b.header.bottom + 8, b.contact.bottom + 12);
  const [workL, workR] = pad(b.work.x, b.work.right, 12);
  const [statsL, statsR] = pad(b.stats.x, b.stats.right, 12);
  const [contactL, contactR] = pad(b.contact.x, b.contact.right, 12);

  const segments = buildSegments(
    [
      { name: 'work', x0: workL, x1: workR, href: WORK, gapHref: LI, gapName: 'pre-work' },
      { name: 'stats', x0: statsL, x1: statsR, href: GH, gapHref: LI, gapName: 'pre-stats' },
      { name: 'contact', x0: contactL, x1: contactR, href: LI, gapHref: LI, gapName: 'pre-contact' }
    ],
    LI
  );

  const manifest = segments.map((s) => ({
    ...s,
    y0: 0,
    y1: stripBottom,
    w: s.x1 - s.x0,
    h: stripBottom,
    file: `nav-${s.name}.png`,
    widthPct: ((s.x1 - s.x0) / W) * 100
  }));

  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(outDir)) {
    if (file.endsWith('.png') || file === 'manifest.json') {
      fs.unlinkSync(path.join(outDir, file));
    }
  }

  const py = `
from PIL import Image
import os, json
im = Image.open(${JSON.stringify(heroPath)}).convert("RGBA")
assert im.size == (${W}, ${H}), im.size
out = ${JSON.stringify(outDir)}
manifest = json.loads(${JSON.stringify(JSON.stringify(manifest))})
strip_bottom = ${stripBottom}
for s in manifest:
    im.crop((s["x0"], s["y0"], s["x1"], s["y1"])).save(os.path.join(out, s["file"]), "PNG")
im.crop((0, strip_bottom, ${W}, ${H})).save(os.path.join(out, "body.png"), "PNG")
print("Wrote", len(manifest), "header slices + body @ y", strip_bottom)
`;
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ stripBottom, segments: manifest }, null, 2)
  );

  const alt =
    'Alexandre Nevero. I work where business judgment, product design, and technical delivery have to agree. Focus: business models that survive contact with users. Portfolio: products worth studying before they are scaled. Signal: open work, public code, visible progress. Contact: LinkedIn.';

  const navHtml = manifest
    .map((s) => {
      const w = Number(s.widthPct.toFixed(6));
      return `<a href="${s.href}"><img src="assets/hotspots/${s.file}" width="${w}%" height="auto" alt="" border="0"></a>`;
    })
    .join('');

  const readme = `<p align="center">
${navHtml}<img src="assets/hotspots/body.png" alt="${alt}" width="100%" border="0">
</p>
`;
  fs.writeFileSync(path.join(root, 'README.md'), readme);
  console.log('Updated README.md, assets/profile-hero.png, assets/hotspots/');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
