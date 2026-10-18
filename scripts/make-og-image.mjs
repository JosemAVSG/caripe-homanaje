// Builds public/og.jpg (1200x630), the preview card for shared links.
// Run: node scripts/make-og-image.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;
const photo = 'src/assets/fotos/vista-de-caripe-desde-el-peru.jpg';

const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#060d08" stop-opacity="0.15"/>
      <stop offset="0.45" stop-color="#060d08" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#060d08" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="72" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="150" fill="#f1ece0">Caripe</text>
  <text x="76" y="470" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-style="italic" fill="#d9d2bf">del Guácharo</text>
  <text x="76" y="560" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="5" fill="#b9c4ad">HOMENAJE DOCUMENTAL · MONAGAS, VENEZUELA</text>
</svg>`;

await sharp(photo)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile('public/og.jpg');
