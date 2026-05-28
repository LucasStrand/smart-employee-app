import type { Chapter } from "./types";
import { chapters_1_3 } from "./chapters/01-03";
import { chapters_4_5 } from "./chapters/04-05";
import { chapters_6_7 } from "./chapters/06-07";
import { chapters_8_9 } from "./chapters/08-09";
import { chapters_10_11 } from "./chapters/10-11";
import { chapters_12_14 } from "./chapters/12-14";
import { chapters_15_16 } from "./chapters/15-16";

export * from "./types";
export { categories, getCategory } from "./categories";

export const chapters: Chapter[] = [
  ...chapters_1_3,
  ...chapters_4_5,
  ...chapters_6_7,
  ...chapters_8_9,
  ...chapters_10_11,
  ...chapters_12_14,
  ...chapters_15_16,
];

export const getChapter = (id: string): Chapter | undefined =>
  chapters.find((c) => c.id === id);

export const getChaptersByCategory = (categoryId: string): Chapter[] =>
  chapters.filter((c) => c.categoryId === categoryId);

export const totalReadMinutes = chapters.reduce(
  (sum, c) => sum + c.estimatedReadMinutes,
  0
);

/**
 * Manual meta — change in admin portal later.
 */
export const manualMeta = {
  title: "Smart Teknik Standard",
  subtitle: "Vår samlade arbetsstandard",
  description:
    "Hur vi planerar, projekterar, installerar, märker, bygger, testar och lämnar över – tillsammans.",
  version: "v4.0",
  updatedAt: "2026-04-08",
};
