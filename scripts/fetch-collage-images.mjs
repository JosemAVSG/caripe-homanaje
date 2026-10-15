/**
 * Fetch the hero collage: historical cartography plus one real photograph of a
 * coffee hacienda in Teresen (Caripe), for the editorial opening of the site.
 *
 * Same discipline as `scripts/fetch-commons-photos.mjs`: nothing is typed by
 * hand. Each file is queried on Wikimedia Commons by its page id, downloaded
 * under a descriptive kebab-case English name into `src/assets/fotos/`, and its
 * credit is written straight from the API `extmetadata` into a dedicated
 * generated registry, `src/content/collage-credits.ts`.
 *
 * The photographic archive in `src/content/credits.ts` is deliberately left
 * untouched: the collage is a separate, self-contained set. Every file here is
 * Public Domain except the hacienda photograph, which is CC BY-SA 4.0.
 *
 * Run with:  node scripts/fetch-collage-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PHOTO_DIR = resolve(ROOT, 'src/assets/fotos');
const CREDITS_FILE = resolve(ROOT, 'src/content/collage-credits.ts');

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'caripe-homanaje/0.1 (homage site; Wikimedia Commons)';

/**
 * The collage, in narrative scale: the world, the country, the state, the
 * terrain, and one living photograph of the place itself.
 *
 * `pageid` is the stable Commons page id. `maxWidth` caps the stored master so
 * the repository stays reasonable; `astro:assets` re-encodes for the web anyway.
 * Wikimedia only serves a fixed ladder of thumbnail widths (960, 1280, 1920,
 * 3840, …) and the API rounds an off-ladder request UP to the next step, so the
 * caps below sit exactly on the ladder. `authorName` is only used when the API
 * `Artist` field is not a person (a bare URL, or empty); it is taken verbatim
 * from the Commons description, never invented.
 */
const FILES = [
  // -- The world ------------------------------------------------------------
  {
    id: 'map-guiana-blaeu-1635',
    kind: 'map',
    pageid: 14683930,
    local: 'guiana-amazon-region-blaeu-1635.jpg',
    maxWidth: 1280,
  },
  {
    id: 'map-guiana-sanson-1656',
    kind: 'map',
    pageid: 14683944,
    local: 'guiana-venezuela-sanson-1656.jpg',
    maxWidth: 1280,
    // Commons records the uploader's source page as the "artist" here; the
    // cartographer named in the file's own description and title is Sanson.
    authorName: 'Nicolas Sanson',
  },

  // -- The country ----------------------------------------------------------
  {
    id: 'map-orinoco-1732',
    kind: 'map',
    pageid: 31556717,
    local: 'orinoco-river-valley-1732.png',
    // The original is only 1024px wide; asking for more would upscale it.
    maxWidth: 1024,
  },
  {
    id: 'map-venezuela-pinkerton-1818',
    kind: 'map',
    pageid: 14676232,
    local: 'northeastern-south-america-pinkerton-1818.jpg',
    maxWidth: 1280,
  },

  // -- The state and the terrain -------------------------------------------
  {
    id: 'map-monagas-mintur-2015',
    kind: 'map',
    pageid: 120324690,
    local: 'estado-monagas-mintur-2015.jpg',
    maxWidth: 1280,
  },
  {
    id: 'map-hoja-7644-san-jose-de-buja-1979',
    kind: 'map',
    pageid: 120152218,
    local: 'hoja-7644-san-jose-de-buja-dcn-1979.jpg',
    maxWidth: 1280,
  },

  // -- The living cell: a real place, with a name --------------------------
  {
    id: 'hacienda-teresen-caripe',
    kind: 'photo',
    pageid: 60984695,
    local: 'hacienda-de-cafe-teresen-caripe.jpg',
    maxWidth: 1280,
  },
];

// -- Small helpers (mirrors of the photo fetcher) ----------------------------

function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function cleanText(value) {
  if (!value) return '';
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/(?:title|label)\s+QS:[^"]*"[^"]*"/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** `Artist` is raw HTML; keep the visible name only, and never a bare URL. */
function cleanAuthor(value) {
  const text = cleanText(value)
    .replace(/\s*\b\d{4}\s*-\s*\d{4}\b\s*$/, '')
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim();
  return /^https?:\/\//i.test(text) ? '' : text;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function fetchWithRetry(url, attempts = 7) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return res;
    lastStatus = res.status;
    if (res.status !== 429 && res.status < 500) break;
    await sleep(4000 * 2 ** attempt);
  }
  throw new Error(`Request failed (${lastStatus}) for ${url}`);
}

async function queryDownload(pageid, maxWidth) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    pageids: String(pageid),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(maxWidth),
  });
  const res = await fetchWithRetry(`${API}?${params}`);
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  if (!page || page.missing !== undefined) {
    throw new Error(`Commons page id ${pageid} does not exist`);
  }
  return { page, info: page.imageinfo[0] };
}

async function download(url, destination) {
  const res = await fetchWithRetry(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destination, buffer);
  return buffer.byteLength;
}

// -- Main --------------------------------------------------------------------

const records = [];
const failures = [];

await mkdir(PHOTO_DIR, { recursive: true });

for (const entry of FILES) {
  const destination = resolve(PHOTO_DIR, entry.local);
  try {
    const { page, info } = await queryDownload(entry.pageid, entry.maxWidth);
    const meta = info.extmetadata ?? {};

    const license = cleanText(meta.LicenseShortName?.value) || 'Public domain';
    const licenseUrl = cleanText(meta.LicenseUrl?.value) || '';
    const author = entry.authorName || cleanAuthor(meta.Artist?.value) || 'Desconocido';
    const description = cleanText(meta.ImageDescription?.value);

    let bytes = existsSync(destination) ? statSync(destination).size : 0;
    if (!bytes) {
      const downloadUrl = info.thumburl ?? info.url;
      bytes = await download(downloadUrl, destination);
      await sleep(500);
    }

    records.push({
      id: entry.id,
      kind: entry.kind,
      file: entry.local,
      title: page.title.replace(/^File:/, ''),
      author,
      license,
      licenseUrl,
      sourceUrl: info.descriptionurl,
      description,
      width: info.thumbwidth ?? info.width,
      height: info.thumbheight ?? info.height,
    });

    console.log(
      `✓ ${entry.local.padEnd(48)} ${license.padEnd(14)} ${author} (${(bytes / 1024).toFixed(0)} KB)`,
    );
  } catch (error) {
    failures.push({ id: entry.id, pageid: entry.pageid, message: error.message });
    console.warn(`✗ ${entry.local.padEnd(48)} ${error.message}`);
  }
}

// -- Emit the collage credits registry --------------------------------------

const entry = (r) => `  {
    id: ${JSON.stringify(r.id)},
    kind: ${JSON.stringify(r.kind)},
    file: ${JSON.stringify(r.file)},
    title: ${JSON.stringify(r.title)},
    author: ${JSON.stringify(r.author)},
    license: ${JSON.stringify(r.license)},
    licenseUrl: ${JSON.stringify(r.licenseUrl)},
    sourceUrl: ${JSON.stringify(r.sourceUrl)},
    description: ${JSON.stringify(r.description)},
  },`;

const output = `/**
 * Hero collage credits — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Produced by \`scripts/fetch-collage-images.mjs\` directly from the Wikimedia
 * Commons API (\`extmetadata\`: LicenseShortName, LicenseUrl, Artist,
 * ImageDescription) together with the URL of each file's Commons page.
 *
 * This is the cartography of the opening collage plus one contemporary
 * photograph of a coffee hacienda in Teresen (Caripe). It is kept apart from the
 * photographic archive in \`credits.ts\` on purpose: the collage is a distinct
 * set, and the archive stays exactly as it was verified.
 *
 * Every file here is Public Domain except the hacienda photograph (CC BY-SA
 * 4.0). Nothing is presented as showing Caripe unless its Commons description
 * says so; the old maps are of Venezuela and South America, and say so.
 */

import type { PhotoCredit } from './credits';

export interface CollageCredit extends PhotoCredit {
  /** 'map' for the historical cartography, 'photo' for the living cell. */
  kind: 'map' | 'photo';
}

export const collageCredits: CollageCredit[] = [
${records.map(entry).join('\n')}
];

export const collageCreditById: Record<string, CollageCredit> = Object.fromEntries(
  collageCredits.map((credit) => [credit.id, credit]),
);

/** Look up a collage credit, failing loudly at build time when it is missing. */
export function getCollageCredit(id: string): CollageCredit {
  const credit = collageCreditById[id];
  if (!credit) {
    throw new Error(
      \`[caripe] No collage credit registered for "\${id}". \` +
        'Add the page id to scripts/fetch-collage-images.mjs and regenerate collage-credits.ts.',
    );
  }
  return credit;
}
`;

await writeFile(CREDITS_FILE, output, 'utf8');

console.log(`\n${records.length} collage image(s) downloaded to src/assets/fotos/`);
console.log('credits written to src/content/collage-credits.ts');
if (failures.length > 0) {
  console.error(`\n${failures.length} file(s) could not be fetched:`);
  for (const failure of failures) {
    console.error(`  ✗ ${failure.id} (pageid ${failure.pageid}) — ${failure.message}`);
  }
  process.exitCode = 1;
}
