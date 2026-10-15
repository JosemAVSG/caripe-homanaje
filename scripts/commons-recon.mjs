/**
 * Read-only reconnaissance pass over the Wikimedia Commons API.
 *
 * Prints, for every candidate file: license, author, size and the plain-text
 * description, so a human can confirm each file really depicts Caripe before it
 * is downloaded. Nothing is written to disk.
 */
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'caripe-homanaje/0.1 (homage site; Wikimedia Commons)';

const TITLES = [
  // A) Historical evidence — public domain
  'File:Cueva del Guacharo (1874) Ferdinand Bellermann.jpg',
  'File:Steatornis caripensis-Humboldt-T044.png',
  'File:Steatornis caripensis - 1872 - Print - Iconographia Zoologica - Special Collections University of Amsterdam - UBA01 IZ16700021.tif',
  // B) The bird, photographed in Caripe
  'File:Steatornis caripensis by anagoria.JPG',
  // C) The cave and the park
  'File:Cueva del Guácharo in 2013.jpg',
  'File:Entrada de Cueva del Guácharo in 2013.jpg',
  'File:Interior de Cueva del Guácharo in 2014 01.jpg',
  'File:Interior de Cueva del Guácharo in 2014 03.jpg',
  'File:Cueva del Guacharo por dentro.JPG',
  'File:Cuevas del Guacharo.jpg',
  'File:Interior de la Cueva del Guacharo Caripe.jpg',
  'File:Cueva del Guacharo Monagas.JPG',
  'File:Cueva del Guacharo Venezuela.jpg',
  'File:Cueva El Guácharo..JPG',
  'File:Entrada Parque Nacional El Guácharo.JPG',
  'File:Cueva del Guacharo.jpg',
  'File:Cueva del Guácharo -1600x1200-.jpg',
  // D) The village
  'File:CaripeMonagas.jpg',
  'File:Caripe - Monagas.jpg',
  'File:Plaza Bolívar de Caripe, Venezuela.jpg',
  'File:Iglesia Santo Ángel Custodio, Caripe, Venezuela.jpg',
  'File:Iglesia Santo Ángel Custodio, Caripe, Venezuela (2).jpg',
  'File:Estatua de Simón Bolívar en Caripe, Venezuela.jpg',
  'File:Grupo Escolar Abraham Lincoln, Caripe, Venezuela.jpg',
  'File:Mirador de Caripe, Venezuela.jpg',
  'File:Mirador de Caripe, Venezuela, vista posterior.jpg',
  // E) The mountain and the territory
  'File:Vista de Caripe desde El Perú.jpg',
  'File:Vista de Caripe desde El Perú 01.jpg',
  'File:Cerro Negro desde Sabana de Piedra.jpg',
  'File:Cerro Negro.jpg',
  'File:Finca de montaña en Caripe 01.jpg',
  'File:Finca de montaña en Caripe 02.jpg',
  'File:Montaña en Caripe, Monagas.jpg',
  'File:Caballito volador en Caripe, Monagas.jpg',
  'File:Cattleya sp. en el Guacharo. Caripe - Edo. Monagas.jpg',
  'File:Venezuela - Monagas - Caripe.svg',
];

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchBatch(titles) {
  const url =
    `${API}?action=query&format=json&titles=${encodeURIComponent(titles.join('|'))}` +
    '&prop=imageinfo&iiprop=url|extmetadata|size';
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Object.values(json.query.pages);
}

const reports = [];
for (let i = 0; i < TITLES.length; i += 10) {
  const batch = TITLES.slice(i, i + 10);
  const pages = await fetchBatch(batch);
  for (const page of pages) {
    if (page.missing !== undefined) {
      reports.push({ title: page.title, MISSING: true });
      continue;
    }
    const info = page.imageinfo?.[0];
    const meta = info?.extmetadata ?? {};
    reports.push({
      title: page.title,
      width: info?.width,
      height: info?.height,
      bytes: info?.size,
      license: stripHtml(meta.LicenseShortName?.value),
      licenseUrl: stripHtml(meta.LicenseUrl?.value),
      artist: stripHtml(meta.Artist?.value),
      credit: stripHtml(meta.Credit?.value),
      description: stripHtml(meta.ImageDescription?.value).slice(0, 260),
      sourceUrl: info?.descriptionurl,
      url: info?.url?.split('?')[0],
    });
  }
}

for (const r of reports) {
  console.log('='.repeat(90));
  if (r.MISSING) {
    console.log(`MISSING: ${r.title}`);
    continue;
  }
  console.log(`TITLE : ${r.title}`);
  console.log(`LIC   : ${r.license}  |  ${r.licenseUrl}`);
  console.log(`AUTHOR: ${r.artist}`);
  console.log(`CREDIT: ${r.credit}`);
  console.log(`SIZE  : ${r.width}x${r.height}  ${(r.bytes / 1024).toFixed(0)} KB`);
  console.log(`DESC  : ${r.description}`);
}
