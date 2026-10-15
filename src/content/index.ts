import type { Chapter } from './types';

/**
 * Chapter registry.
 *
 * Every `*.ts` file in `./chapters` is collected eagerly at build time and
 * sorted by its `order` field. Adding a chapter is therefore a pure data
 * operation: drop a file in `src/content/chapters/` and it appears on the page,
 * in order, with no markup to touch.
 */
const modules = import.meta.glob<{ chapter: Chapter }>('./chapters/*.ts', {
  eager: true,
});

function collectChapters(): Chapter[] {
  const found = Object.entries(modules).map(([path, mod]) => {
    if (!mod.chapter) {
      throw new Error(
        `[caripe] Chapter module "${path}" must export a "chapter" binding.`,
      );
    }
    return mod.chapter;
  });

  const slugs = new Set<string>();
  for (const chapter of found) {
    if (slugs.has(chapter.slug)) {
      throw new Error(`[caripe] Duplicate chapter slug: "${chapter.slug}".`);
    }
    slugs.add(chapter.slug);
  }

  return found.sort((a, b) => a.order - b.order);
}

export const chapters: Chapter[] = collectChapters();

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug);
}

export type { Chapter, Beat, Voice, Source } from './types';
