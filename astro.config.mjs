// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

/**
 * Drop the un-optimised originals that Astro copies into the build output.
 *
 * Importing a local image (`import.meta.glob` or a plain `import`) makes the
 * bundler emit the *original* file alongside every derived image, because the
 * module carries an original `src` URL. Nothing on this site ever renders that
 * URL — every `<Image>` resolves to an optimised WebP — so the originals are
 * dead weight: on this archive they would add ~32 MB to a ~5 MB page.
 *
 * The plugin is deliberately conservative. It runs *after* the output is
 * written, scans every emitted HTML, CSS and JS file for the URLs actually in
 * use, and deletes only raster files that no document references.
 */
function dropUnreferencedOriginals() {
  /** Extensions `astro:assets` re-encodes; anything else is left alone. */
  const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff']);

  return {
    name: 'caripe:drop-unreferenced-originals',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outputDir = dir.pathname;
        const assetsDir = join(outputDir, '_astro');

        let assetNames;
        try {
          assetNames = await readdir(assetsDir);
        } catch {
          return;
        }

        // Everything the site actually points at, harvested from its own output.
        const referenced = new Set();
        const collect = async (file) => {
          const text = await readFile(file, 'utf8');
          for (const match of text.matchAll(/[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|tif|tiff|webp|avif|svg)/g)) {
            referenced.add(match[0]);
          }
        };

        const walk = async (directory) => {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) {
              await walk(path);
            } else if (['.html', '.css', '.js', '.json', '.xml'].includes(extname(entry.name))) {
              await collect(path);
            }
          }
        };
        await walk(outputDir);

        let removed = 0;
        let bytes = 0;
        for (const name of assetNames) {
          if (!rasterExtensions.has(extname(name))) continue;
          if (referenced.has(name)) continue;

          const path = join(assetsDir, name);
          bytes += (await stat(path)).size;
          await rm(path);
          removed += 1;
        }

        if (removed > 0) {
          logger.info(
            `dropped ${removed} unreferenced original image(s), freeing ${(bytes / 1024 / 1024).toFixed(1)} MB`,
          );
        }
      },
    },
  };
}

// Static, content-first output. No UI framework, no adapter.
export default defineConfig({
  site: 'https://caripe.example',
  // Build a fully static site; all narrative copy is server-rendered.
  trailingSlash: 'ignore',
  build: {
    // Keep the emitted CSS readable for a project this small.
    inlineStylesheets: 'auto',
  },
  integrations: [dropUnreferencedOriginals()],
  devToolbar: {
    enabled: false,
  },
});
