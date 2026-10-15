# caripe-homanaje

A documentary **scrollytelling** homage to **Caripe del Guácharo** — village and
capital of the Municipio Caripe, Monagas state, Venezuela, in the cordillera de
Caripe (serranía del Turimiquire).

The scroll moves through time: a prologue, then numbered chapters staged as
pinned scenes, with photographs treated as evidence and a closing note of
thanks. The signature device is **fog** — Caripe is the town seen through the
mist, so mist is a real actor driven by scroll, not a filter.

## Stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Astro (static output, zero JS by default)     |
| Scroll     | GSAP + ScrollTrigger                          |
| Smoothness | Lenis, driven by `gsap.ticker`                |
| Styling    | Plain CSS with custom properties (no Tailwind)|
| Type       | Self-hosted via `@fontsource`                 |
| Images     | `astro:assets` → responsive WebP, all lazy    |

No UI framework, no CSS framework, no analytics. Fonts are local, so the page
makes no third-party requests.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run photos   # re-download the archive + regenerate src/content/credits.ts
```

## Project structure

```
scripts/                        # build-time tooling, not shipped
├── commons-recon.mjs           # read-only survey of Commons candidates
└── fetch-commons-photos.mjs    # downloads the archive + generates credits.ts

src/
├── assets/fotos/               # the photographic archive (29 files)
├── content/                    # the narrative lives here
│   ├── types.ts                # Beat / Chapter / Voice model
│   ├── site.ts                 # prologue + colophon copy and facts
│   ├── index.ts                # collects and sorts chapters by `order`
│   ├── credits.ts              # GENERATED: author / licence / source per file
│   ├── photos.ts               # joins the credit registry to the image files
│   └── chapters/
│       ├── 01-1799.ts          # chapter 1 — real, sourced content
│       ├── 02-el-cafe.ts       # structural stub (pending)
│       ├── 03-la-neblina.ts    # structural stub (pending)
│       └── 04-quedarse-o-partir.ts  # structural stub (pending)
├── components/
│   ├── Hero.astro              # prologue: fog clearing over the ridge
│   ├── Mist.astro              # the signature fog device
│   ├── ChapterSection.astro    # chapter shell + pinned evidence column
│   ├── Beat.astro              # renders one beat in its voice's register
│   ├── ChapterTimeline.astro   # the scroll-drawn chronology
│   ├── LexiconPlate.astro      # a term worth stopping at
│   ├── EvidencePlates.astro    # historical documents, staged as evidence
│   ├── ChapterGallery.astro    # a chapter's photographic documentation
│   ├── PhotoFigure.astro       # one photograph: frame, caption, credit
│   ├── PhotoCreditLine.astro   # the visible attribution a licence requires
│   ├── PhotoSlot.astro         # reserved, designed empty frame for photography
│   ├── SourceNote.astro        # documentary source footer
│   ├── ProgressRail.astro      # vertical reading rail (desktop)
│   └── Colophon.astro          # closing thanks + full image credits
├── layouts/BaseLayout.astro    # document shell, fonts, motion bootstrap
├── pages/index.astro           # the whole documentary
├── scripts/motion.ts           # GSAP + Lenis + ScrollTrigger, all of it
└── styles/
    ├── tokens.css              # every design decision as a CSS variable
    └── global.css              # reset, base type, shared primitives
```

## The content model: two voices

The site speaks with **two narrative registers**, and the data model says so
explicitly rather than hardcoding chapters into markup:

```ts
type Beat =
  | { voice: 'documental'; text: string; source?: Source }
  | { voice: 'testimonio'; text: string; attribution?: string; placeholder?: boolean };

interface Chapter {
  slug: string;
  order: number;          // sort order; lower comes first
  number: string;         // numeral shown in the marker, e.g. "01"
  title: string;
  kicker?: string;
  lede?: string;
  tone?: 'monte' | 'cafe' | 'bruma';
  beats: Beat[];
  lexicon?: LexiconEntry;
  timeline?: Milestone[];
  plates?: EvidencePlate[];  // historical documents, shown as evidence
  gallery?: ChapterGallery;  // contemporary photographs of the territory
  photo?: PhotoSlot;         // reserved frame, still empty
  sources?: Source[];
  pending?: boolean;      // marks a structural stub
  pendingNote?: string;   // what the stub is reserved for (never a claim)
}
```

Photography is data too. A `ChapterImage` never references a file path — it
carries a `photo` **key** into the generated credit registry, plus its visible
caption and honest `alt`:

```ts
interface ChapterImage {
  photo: string;                  // key into src/content/credits.ts
  caption: string;                // what the photograph actually shows
  alt: string;
  layout?: 'feature' | 'grid';
};

interface EvidencePlate extends ChapterImage {
  label?: string;                 // e.g. "Bellermann · 1874"
};

interface ChapterGallery {
  label?: string;                 // e.g. "El ave y la cueva"
  images: ChapterImage[];
};
```

`src/content/photos.ts` is the single join between those keys and the files in
`src/assets/fotos/`. A key with no credit record, or a credit whose file is
missing, throws at build time — an uncredited or broken photograph cannot ship.

`Beat.astro` maps `voice` to a visual variant, and the two are deliberately
unmistakable:

- **`documental`** — sober serif (Spectral), cool bone text, narrow measure, a
  thin source footnote under every sourced claim.
- **`testimonio`** — a warm coffee-coloured inset panel, a warm left rule, and
  italic display serif (Fraunces). The reader always knows who is speaking.

### Adding a chapter

Adding a chapter is a **pure data operation**:

1. Create `src/content/chapters/05-your-slug.ts` exporting a `chapter: Chapter`.
2. Set a unique `order` (it controls sequence) and a unique `slug`.
3. Done. It is collected by `import.meta.glob` in `src/content/index.ts`, sorted
   by `order`, rendered on the page, and added to the progress rail.

No markup changes, no registration list. Duplicate slugs throw at build time.

## Motion architecture

Everything lives in `src/scripts/motion.ts` and follows three rules:

1. **Nothing is hidden by CSS.** Copy is fully readable at rest. GSAP only ever
   stages elements via `gsap.from` / `fromTo`, so if the script never loads, the
   document is complete. The hero intro is CSS-keyframe driven for the same
   reason: no flash of hidden text, no JS required.
2. **`prefers-reduced-motion: reduce` returns immediately.** No pinning, no
   smooth scroll, no tweens, no reveals — a 100% static, complete document. The
   `data-motion` attribute on `<html>` publishes this contract from first paint.
3. **A failure cannot trap content.** If anything throws mid-setup, `revealAll()`
   clears every inline style GSAP applied.

What is animated:

- **Hero pin** — the scene is held while the fog clears (`autoAlpha` + a
  depth-weighted rise per layer) and the ridge settles. Pinning is desktop-only
  (`min-width: 48rem`), because on phones it fights dynamic browser chrome.
- **Reveals** — beats, source notes, plates and timeline entries fade up as they
  cross the reading line (`[data-reveal]`, `once: true`).
- **The timeline rule** — `[data-timeline-line]` is drawn by the scroll, scaling
  on `X` on wide screens and on `Y` on narrow ones (`gsap.matchMedia`).
- **Progress** — the top bar on small screens, the vertical rail on large ones.
- **Active chapter** — the rail entry matching the chapter on screen.

Generic hooks you can reuse from markup: `data-pin` +
`data-pin-distance` (viewport-height multiplier), `data-reveal`, `data-timeline`,
`data-depth` (fog parallax weight).

JavaScript ships as one bundle (GSAP core + ScrollTrigger + Lenis).

## Design tokens

All `--cu-*`, defined in `src/styles/tokens.css`:

- **Palette** — `monte` (deep mountain green), `cafe` (roasted coffee brown),
  `bruma` (cool fog greys), `hueso` (bone/cream text), and one warm accent
  (`--cu-accent`). Every text/background pair clears WCAG AA.
- **Voices** — `--cu-doc-*` and `--cu-testimony-*` encode the two registers.
- **Type** — fluid scale `--cu-step--2 … --cu-step-6`, three families
  (`--cu-font-display` Fraunces, `--cu-font-serif` Spectral, `--cu-font-sans`
  Inter), plus leading and tracking tokens.
- **Space / layout / motion** — spacing steps, measures, gutters, the reserved
  hero band, easing and durations.

Re-theming means editing this one file.

## Photography

The site carries **29 photographs**, all sourced from **Wikimedia Commons**
under a free licence (Public Domain, CC0, CC BY or CC BY-SA). Nothing comes
from Google, Facebook, Pinterest or any other "free" aggregator, and no
photograph is presented as showing Caripe unless its Commons description says
so. Three of them are period documents used as **evidence** rather than
illustration.

### The archive is fetched, never assembled by hand

`scripts/fetch-commons-photos.mjs` is the only way images enter the repo. In one
pass it:

1. queries the Commons API for each curated file, and
2. downloads it into `src/assets/fotos/` under a descriptive **kebab-case
   English** name, and
3. writes its credit record — author, licence, licence URL, Commons page and the
   original description — straight from the API's `extmetadata` into
   `src/content/credits.ts`.

Credits are therefore **generated, never typed**: the sheet always describes the
exact bytes that were downloaded. `scripts/commons-recon.mjs` is the read-only
companion — it prints licence, author, size and description for a candidate set
so a human can confirm each file really depicts Caripe *before* anything is
written to disk. Re-run everything with `npm run photos`.

```bash
node scripts/commons-recon.mjs        # survey candidates (writes nothing)
npm run photos                        # fetch + regenerate credits.ts
```

Commons rate-limits hard (HTTP 429); the fetcher backs off exponentially and
skips files already on disk, so a re-run resumes instead of restarting.

### How images are presented

- **`EvidencePlates.astro`** — the historical documents (a Bellermann work of
  1874, Humboldt's 1811 zoological plate, an 1872 engraving), staged in a
  paper-toned row beside the narration they corroborate. Chapter 01 leads with
  them: the cave and the bird, drawn by the people who named them.
- **`ChapterGallery.astro`** — contemporary documentation of each chapter's
  territory, in a responsive 1/2/3-column grid. `layout: 'feature'` lets one
  image span the full width.

Both are built on **`PhotoFigure.astro`**, which renders a real
`<figure>`/`<figcaption>` with the caption *and* the attribution inside the
figcaption, and **`PhotoCreditLine.astro`**, the one place the CC BY / CC BY-SA
obligation — name the author, name the licence, link to the source — is
discharged. Nothing is cropped, so the caption and the alternative text always
describe exactly what is on screen. Every image is `loading="lazy"`; none is
given `priority`, so the CSS/SVG fog scene stays the LCP.

A single, mild tonal treatment unifies an archive shot on wildly different
cameras across twenty years: `saturate(0.84) contrast(1.04)` on contemporary
photographs, a lighter `saturate(0.92) contrast(1.02)` on the historical plates.
It is declared in the colophon, as CC BY-SA requires, along with the fact that
files were rescaled and recompressed for the web.

### The build trims what it does not use

Importing a local image makes the bundler emit the **original** file next to
every derived WebP, because the module still carries an `src` URL. Nothing on
this site renders that URL. The `dropUnreferencedOriginals()` integration in
`astro.config.mjs` runs after the build, scans the emitted HTML/CSS/JS for the
URLs actually in use, and deletes only the raster files nothing references —
freeing ~32 MB of dead originals and leaving a `dist/` of **~6.6 MB of files**
(4.96 MB WebP + 0.83 MB fonts + 0.55 MB SVG + 0.17 MB CSS/JS/HTML).

### Chapters 02–04

Those chapters are declared stubs: they carry no invented text, but they do
carry a labelled "Documentación visual · …" gallery, so the reader sees the
territory the chapter is still waiting to tell.

`PhotoSlot.astro` remains for a chapter whose photography genuinely does not
exist yet — a designed, honest empty frame (hairline plate, aperture mark,
caption) rather than a stock stand-in.

## Accessibility

- `<html lang="es">`, semantic landmarks (`main`, `footer`, `nav`, `section`
  with `aria-labelledby`), correct heading hierarchy (`h1` → `h2` → `h3`).
- Decorative layers (fog, ridges, marker numerals, progress) are `aria-hidden`;
  the rail exposes full chapter names via `aria-label`.
- Visible focus styles; a skip link; anchor navigation moves focus for keyboard
  users.
- AA contrast throughout; the fog never sits over body copy.
- Full `prefers-reduced-motion` support, as described above.

## Content provenance

Only verified facts are stated. Documentary claims carry a descriptive source
label; the generic footer names the provenance (Wikipedia; Venezuelan press)
without inventing citations or URLs. Testimony beats in this version are written
stand-ins marked `placeholder: true` and rendered with a discreet
"voz preliminar" note, awaiting their real recorded counterparts.

## Roadmap

- Replace the placeholder testimony beats with attributed, recorded voices.
- Fill chapters 02–04 (data only — the shell already renders them); their
  galleries are already in place.
- Extend the Commons archive as new, verified Caripe material appears.
- Add `@astrojs/check` if type-checking in CI becomes desirable.
