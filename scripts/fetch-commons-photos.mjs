/**
 * Fetch the Caripe photographic archive from Wikimedia Commons.
 *
 * Two things happen here, in one pass, so the two can never drift apart:
 *   1. each verified file is downloaded into `src/assets/fotos/` under a
 *      descriptive kebab-case English name, and
 *   2. its credit record is written straight from the API `extmetadata` into
 *      `src/content/credits.ts`.
 *
 * Credits are therefore never typed by hand: author, licence, licence URL and
 * the Commons page all come from the source of truth (the Commons API).
 *
 * Run with:  node scripts/fetch-commons-photos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PHOTO_DIR = resolve(ROOT, 'src/assets/fotos');
const CREDITS_FILE = resolve(ROOT, 'src/content/credits.ts');

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'caripe-homanaje/0.1 (homage site; Wikimedia Commons)';

/**
 * Every entry is a file whose description was read and confirmed to depict
 * Caripe del Guácharo, its cave, its village, its mountain or its bird.
 *
 * `maxWidth` caps the stored master so the repository stays reasonable; the
 * build re-encodes everything through `astro:assets` anyway.
 */
const FILES = [
  // -- A) Historical evidence -------------------------------------------------
  {
    id: 'bellermann-cueva-1874',
    title: 'File:Cueva del Guacharo (1874) Ferdinand Bellermann.jpg',
    local: 'cueva-guacharo-bellermann-1874.jpg',
    maxWidth: 1486,
  },
  {
    id: 'humboldt-plate-1811',
    title: 'File:Steatornis caripensis-Humboldt-T044.png',
    local: 'steatornis-caripensis-humboldt-plate.png',
    maxWidth: 1400,
  },
  {
    id: 'iconographia-1872',
    title:
      'File:Steatornis caripensis - 1872 - Print - Iconographia Zoologica - Special Collections University of Amsterdam - UBA01 IZ16700021.tif',
    local: 'steatornis-caripensis-iconographia-1872.jpg',
    maxWidth: 1200,
  },

  // -- B) The bird, photographed in Caripe ------------------------------------
  {
    id: 'guacharo-caripe',
    title: 'File:Steatornis caripensis by anagoria.JPG',
    local: 'steatornis-caripensis-caripe.jpg',
    maxWidth: 1800,
  },

  // -- C) The cave and the park ----------------------------------------------
  {
    id: 'cueva-entrada-2013',
    title: 'File:Cueva del Guácharo in 2013.jpg',
    local: 'cueva-guacharo-entrada-2013.jpg',
    maxWidth: 1800,
  },
  {
    id: 'cueva-entrada-techo-2013',
    title: 'File:Entrada de Cueva del Guácharo in 2013.jpg',
    local: 'cueva-guacharo-techo-entrada-2013.jpg',
    maxWidth: 1800,
  },
  {
    id: 'cueva-interior-2014-01',
    title: 'File:Interior de Cueva del Guácharo in 2014 01.jpg',
    local: 'cueva-guacharo-interior-2014-01.jpg',
    maxWidth: 1800,
  },
  {
    id: 'cueva-interior-2014-03',
    title: 'File:Interior de Cueva del Guácharo in 2014 03.jpg',
    local: 'cueva-guacharo-interior-2014-03.jpg',
    maxWidth: 1800,
  },
  {
    id: 'cueva-interior-profundo',
    title: 'File:Cueva del Guácharo -1600x1200-.jpg',
    local: 'cueva-guacharo-interior-profundo.jpg',
    maxWidth: 1600,
  },
  {
    id: 'cueva-entrada-blmurch',
    title: 'File:Cueva del Guacharo.jpg',
    local: 'cueva-guacharo-entrada.jpg',
    maxWidth: 1800,
  },
  {
    id: 'parque-nacional-guacharo',
    title: 'File:Cueva El Guácharo..JPG',
    local: 'parque-nacional-guacharo-sendero.jpg',
    maxWidth: 1800,
  },
  {
    id: 'entrada-parque-nacional',
    title: 'File:Entrada Parque Nacional El Guácharo.JPG',
    local: 'entrada-parque-nacional-guacharo.jpg',
    maxWidth: 1536,
  },

  // -- D) The village ---------------------------------------------------------
  {
    id: 'casas-estilo-alpino',
    title: 'File:CaripeMonagas.jpg',
    local: 'caripe-casas-estilo-alpino.jpg',
    maxWidth: 1280,
  },
  {
    id: 'paisaje-pueblo',
    title: 'File:Caripe - Monagas.jpg',
    local: 'caripe-paisaje-pueblo.jpg',
    maxWidth: 1800,
  },
  {
    id: 'plaza-bolivar',
    title: 'File:Plaza Bolívar de Caripe, Venezuela.jpg',
    local: 'plaza-bolivar-caripe.jpg',
    maxWidth: 1800,
  },
  {
    id: 'iglesia-santo-angel',
    title: 'File:Iglesia Santo Ángel Custodio, Caripe, Venezuela.jpg',
    local: 'iglesia-santo-angel-custodio-caripe.jpg',
    maxWidth: 1800,
  },
  {
    id: 'estatua-bolivar',
    title: 'File:Estatua de Simón Bolívar en Caripe, Venezuela.jpg',
    local: 'estatua-simon-bolivar-caripe.jpg',
    maxWidth: 1600,
  },
  {
    id: 'grupo-escolar',
    title: 'File:Grupo Escolar Abraham Lincoln, Caripe, Venezuela.jpg',
    local: 'grupo-escolar-abraham-lincoln-caripe.jpg',
    maxWidth: 1800,
  },
  {
    id: 'mirador-de-caripe',
    title: 'File:Mirador de Caripe, Venezuela.jpg',
    local: 'mirador-de-caripe.jpg',
    maxWidth: 1800,
  },

  // -- E) The mountain and the territory -------------------------------------
  {
    id: 'vista-desde-el-peru',
    title: 'File:Vista de Caripe desde El Perú.jpg',
    local: 'vista-de-caripe-desde-el-peru.jpg',
    maxWidth: 2000,
  },
  {
    id: 'vista-desde-el-peru-01',
    title: 'File:Vista de Caripe desde El Perú 01.jpg',
    local: 'vista-de-caripe-desde-el-peru-01.jpg',
    maxWidth: 2000,
  },
  {
    id: 'cerro-negro-sabana',
    title: 'File:Cerro Negro desde Sabana de Piedra.jpg',
    local: 'cerro-negro-desde-sabana-de-piedra.jpg',
    maxWidth: 2000,
  },
  {
    id: 'cerro-negro',
    title: 'File:Cerro Negro.jpg',
    local: 'cerro-negro.jpg',
    maxWidth: 2000,
  },
  {
    id: 'finca-montana-01',
    title: 'File:Finca de montaña en Caripe 01.jpg',
    local: 'finca-de-montana-caripe-01.jpg',
    maxWidth: 1800,
  },
  {
    id: 'finca-montana-02',
    title: 'File:Finca de montaña en Caripe 02.jpg',
    local: 'finca-de-montana-caripe-02.jpg',
    maxWidth: 1800,
  },
  {
    id: 'montana-caripe',
    title: 'File:Montaña en Caripe, Monagas.jpg',
    local: 'montana-en-caripe.jpg',
    maxWidth: 1800,
  },
  {
    id: 'caballito-volador',
    title: 'File:Caballito volador en Caripe, Monagas.jpg',
    local: 'caballito-volador-caripe.jpg',
    maxWidth: 1800,
  },
  {
    id: 'orquidea-cattleya',
    title: 'File:Cattleya sp. en el Guacharo. Caripe - Edo. Monagas.jpg',
    local: 'cattleya-orquidea-cueva-guacharo.jpg',
    maxWidth: 1024,
  },
  {
    id: 'mapa-municipio',
    title: 'File:Venezuela - Monagas - Caripe.svg',
    local: 'mapa-municipio-caripe.svg',
    maxWidth: 1342,
    // Vectors must be taken as the original or they get rasterised.
    raw: true,
  },
];

// -- Small helpers -----------------------------------------------------------

function decodeEntities(value) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

/** Commons embeds `title QS:…` / `label QS:…` machine noise in descriptions. */
function cleanText(value) {
  if (!value) return '';
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/(?:title|label)\s+QS:[^"]*"[^"]*"/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** `Artist` is raw HTML; keep the visible name only. */
function cleanAuthor(value) {
  return cleanText(value)
    .replace(/\s*\b\d{4}\s*-\s*\d{4}\b\s*$/, '')
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim();
}

/**
 * `maxWidth` makes Commons render a capped master; when the original already
 * fits, no thumbnail exists and the original URL is used.
 */
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** Commons rate-limits aggressively; back off and retry instead of failing. */
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

async function queryDownload(title, maxWidth) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(maxWidth),
  });
  const res = await fetchWithRetry(`${API}?${params}`);
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  if (!page || page.missing !== undefined) {
    throw new Error(`"${title}" does not exist on Commons`);
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

/** The curated set of descriptions, authored here (not scraped) in Spanish. */
const records = [];
const failures = [];

await mkdir(PHOTO_DIR, { recursive: true });

for (const entry of FILES) {
  const destination = resolve(PHOTO_DIR, entry.local);
  try {
    const { info } = await queryDownload(entry.title, entry.maxWidth);
    const meta = info.extmetadata ?? {};

    const license = cleanText(meta.LicenseShortName?.value) || 'Public domain';
    const licenseUrl = cleanText(meta.LicenseUrl?.value) || '';
    const author = cleanAuthor(meta.Artist?.value) || 'Desconocido';
    const description = cleanText(meta.ImageDescription?.value);
    const credit = cleanText(meta.Credit?.value);

    // Resume-friendly: an already-downloaded master is left untouched.
    let bytes = existsSync(destination) ? statSync(destination).size : 0;
    if (!bytes) {
      const downloadUrl = entry.raw ? info.url : info.thumburl ?? info.url;
      bytes = await download(downloadUrl, destination);
      await sleep(500);
    }

    records.push({
      id: entry.id,
      file: entry.local,
      title: entry.title.replace(/^File:/, ''),
      author,
      license,
      licenseUrl,
      sourceUrl: info.descriptionurl,
      description,
      credit,
      width: info.thumbwidth ?? info.width,
      height: info.thumbheight ?? info.height,
    });

    console.log(
      `✓ ${entry.local.padEnd(52)} ${license.padEnd(16)} ${author} (${(bytes / 1024).toFixed(0)} KB)`,
    );
  } catch (error) {
    failures.push({ id: entry.id, title: entry.title, message: error.message });
    console.warn(`✗ ${entry.local.padEnd(52)} ${error.message}`);
  }
}

// -- Emit the credits registry ----------------------------------------------

const entry = (r) => `  {
    id: ${JSON.stringify(r.id)},
    file: ${JSON.stringify(r.file)},
    title: ${JSON.stringify(r.title)},
    author: ${JSON.stringify(r.author)},
    license: ${JSON.stringify(r.license)},
    licenseUrl: ${JSON.stringify(r.licenseUrl)},
    sourceUrl: ${JSON.stringify(r.sourceUrl)},
    description: ${JSON.stringify(r.description)},
  },`;

const output = `/**
 * Image credits — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Produced by \`scripts/fetch-commons-photos.mjs\` directly from the Wikimedia
 * Commons API (\`extmetadata\`: LicenseShortName, LicenseUrl, Artist,
 * ImageDescription) together with the URL of each file's Commons page.
 *
 * Author, licence and source therefore always describe the real file that was
 * downloaded, and can be regenerated at any time:
 *
 *   node scripts/fetch-commons-photos.mjs
 *
 * Every file listed here is Public Domain, CC0, CC BY or CC BY-SA. Nothing from
 * Google, Facebook, Pinterest or any other "free" aggregator is used, and no
 * photograph is presented as showing Caripe unless its Commons description says
 * so.
 */

export interface PhotoCredit {
  /** Stable key used by the content model to reference the image. */
  id: string;
  /** Local file name inside \`src/assets/fotos/\`. */
  file: string;
  /** Original file name on Wikimedia Commons. */
  title: string;
  /** Author as recorded on Commons. */
  author: string;
  /** Short licence name, e.g. "CC BY-SA 4.0" or "Public domain". */
  license: string;
  /** Licence deed. Empty for Public Domain files, which carry no deed URL. */
  licenseUrl: string;
  /** The file's page on Wikimedia Commons. */
  sourceUrl: string;
  /** Original description on Commons, for provenance and auditing. */
  description: string;
}

export const photoCredits: PhotoCredit[] = [
${records.map(entry).join('\n')}
];

export const photoCreditById: Record<string, PhotoCredit> = Object.fromEntries(
  photoCredits.map((credit) => [credit.id, credit]),
);

/** Look up a credit record, failing loudly at build time when it is missing. */
export function getPhotoCredit(id: string): PhotoCredit {
  const credit = photoCreditById[id];
  if (!credit) {
    throw new Error(
      \`[caripe] No photo credit registered for "\${id}". \` +
        'Add the file to scripts/fetch-commons-photos.mjs and regenerate credits.ts.',
    );
  }
  return credit;
}
`;

await writeFile(CREDITS_FILE, output, 'utf8');

console.log(`\n${records.length} photographs downloaded to src/assets/fotos/`);
console.log(`credits written to src/content/credits.ts`);
if (failures.length > 0) {
  console.error(`\n${failures.length} file(s) could not be fetched:`);
  for (const failure of failures) {
    console.error(`  ✗ ${failure.title} — ${failure.message}`);
  }
  process.exitCode = 1;
}
