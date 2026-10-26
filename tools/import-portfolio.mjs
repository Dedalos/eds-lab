#!/usr/bin/env node
/**
 * Imports the portfolio (webpro123.com/roy, painted from cv.json as EDS block markup) as EDS
 * documents, so the Lab shows the same content with the same blocks.
 *
 *   npm run import                                  -> from http://webpro123.local/roy/
 *   npm run import -- --base https://webpro123.com/roy/
 *
 * Writes:
 *   drafts/{index,nav,footer}.plain.html  local preview: `npm run up` (aem up --html-folder drafts)
 *   drafts/media/*.webp                   images for the local preview
 *   da/{index,nav,footer}.html + da/media document format to upload to da.live, images as JPEG:
 *                                         da.live drops WebP files on drag and drop (only jpg, png,
 *                                         gif, svg…); EDS serves optimized WebP renditions anyway
 *
 * The portfolio's <main> is already block markup (one <div> per section, one table-like <div>
 * per block), so the import only rewrites images and links. The metadata block (title,
 * description, robots) goes only in da/: EDS turns it into <meta> tags, aem up does not.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = new URL(baseIndex >= 0 ? args[baseIndex + 1] : 'http://webpro123.local/roy/');
// Links in the documents point to the public portfolio, whatever the import source
const publicBase = new URL('https://webpro123.com/roy/');

const get = (url) => new Promise((resolve, reject) => {
  (url.protocol === 'https:' ? https : http).get(url, (res) => {
    if (res.statusCode !== 200) {
      reject(new Error(`${url} -> HTTP ${res.statusCode}`));
      res.resume();
      return;
    }
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => resolve(Buffer.concat(chunks)));
  }).on('error', reject);
});

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

/** WebP -> JPEG with Pillow (Python, as roy/tools/build-images.py): Node has no image codec. */
const toJpeg = (from, to) => execFileSync('python', ['-c',
  'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], "JPEG", quality=85, optimize=True, progressive=True)',
  from, to]);

/** Largest WebP rendition of a <picture>: as is in drafts/media, as JPEG in da/media. */
async function importPicture(picture) {
  const srcset = (picture.match(/srcset="([^"]+)"/) || [])[1];
  const alt = (picture.match(/alt="([^"]*)"/) || [])[1] || '';
  if (!srcset) return picture;
  const largest = srcset.split(',').map((s) => s.trim().split(' '))
    .sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10))[0][0];
  const name = path.basename(largest).replace(/-\d+\.webp$/, '');
  const data = await get(new URL(largest, base));
  const webp = path.join(root, 'drafts', 'media', `${name}.webp`);
  write(webp, data);
  fs.mkdirSync(path.join(root, 'da', 'media'), { recursive: true });
  toJpeg(webp, path.join(root, 'da', 'media', `${name}.jpg`));
  return `<picture><img src="{media}/${name}.{ext}" alt="${alt}"></picture>`;
}

const absolute = (html) => html.replace(/href="(?!https?:|mailto:|tel:|#)([^"]*)"/g, (m, href) => `href="${new URL(href, publicBase)}"`);

const metadataBlock = (fields) => `<div><div class="metadata">${Object.entries(fields)
  .map(([key, value]) => `<div><div>${key}</div><div>${value}</div></div>`).join('')}</div></div>`;

const page = await get(base);
const html = page.toString('utf8');
const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)[1];
const title = html.match(/<title>([^<]*)<\/title>/)[1];
const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
const brand = html.match(/<a class="brand"[^>]*>([^<]*)<\/a>/)[1];
const navLinks = [...html.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)][0][1].match(/<a [^>]*>[^<]*<\/a>/g);
const inspector = html.match(/class="block-inspector-toggle"[^>]*>([^<]*)</)[1];

let content = main.replace(/\s+id="[^"]*"/g, '').replace(/>\s+</g, '><').trim();
const pictures = content.match(/<picture>[\s\S]*?<\/picture>/g) || [];
// eslint-disable-next-line no-restricted-syntax
for (const picture of pictures) {
  // eslint-disable-next-line no-await-in-loop
  content = content.replace(picture, await importPicture(picture));
}
content = absolute(content);
const metadata = metadataBlock({
  Title: title,
  Description: description,
  Robots: 'noindex, nofollow',
});

const nav = `<div><p><a href="/">${brand}</a></p><ul>${navLinks.map((a) => `<li>${a}</li>`).join('')}</ul><p>${inspector}</p></div>`;
const foot = `<div><p>© ${new Date().getFullYear()} ${brand}. Running on Adobe Edge Delivery Services with the same blocks as <a href="${publicBase}">${publicBase.host}${publicBase.pathname}</a>, authored in Document Authoring.</p><p><a href="${publicBase}archive/">Design work archive</a></p></div>`;

const docs = { index: [content, metadata], nav: [nav, ''], footer: [foot, ''] };
Object.entries(docs).forEach(([name, [body, meta]]) => {
  write(path.join(root, 'drafts', `${name}.plain.html`), `${body.replaceAll('{media}', '/drafts/media').replaceAll('{ext}', 'webp')}\n`);
  write(path.join(root, 'da', `${name}.html`), `<body><header></header><main>${body.replaceAll('{media}', './media').replaceAll('{ext}', 'jpg')}${meta}</main><footer></footer></body>\n`);
});
console.log(`Imported ${base} -> drafts/ and da/ (${pictures.length} images)`);
