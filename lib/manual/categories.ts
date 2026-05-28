import type { Category } from "./types";

/**
 * Top-level categories shown in the playbook. Editable later via an admin
 * portal — keep ids stable since chapters reference them.
 */
export const categories: Category[] = [
  {
    id: "projekt",
    name: "Projekt",
    description: "Syfte, faser och dokumentstyrning",
    iconName: "rocket-outline",
    colorKey: "cat1",
    chapterIds: ["c1", "c2", "c3"],
  },
  {
    id: "roller",
    name: "Roller & Ledning",
    description: "Ansvar och operativ projektledning",
    iconName: "people-outline",
    colorKey: "cat2",
    chapterIds: ["c4", "c7"],
  },
  {
    id: "projektering",
    name: "Projektering",
    description: "Bluebeam, CAD och Stardraw",
    iconName: "construct-outline",
    colorKey: "cat3",
    chapterIds: ["c5"],
  },
  {
    id: "installation",
    name: "Installation",
    description: "Tekniker, montage och rackbygge",
    iconName: "build-outline",
    colorKey: "cat4",
    chapterIds: ["c6", "c12"],
  },
  {
    id: "rack",
    name: "Rack & El",
    description: "Rackdesign, värme, kraft och säkerhet",
    iconName: "server-outline",
    colorKey: "cat5",
    chapterIds: ["c8", "c9", "c13", "c14"],
  },
  {
    id: "natverk",
    name: "Nätverk & Kabel",
    description: "Kabelstandard, märkning och nätverk",
    iconName: "git-network-outline",
    colorKey: "cat6",
    chapterIds: ["c10", "c11"],
  },
  {
    id: "overlamning",
    name: "Överlämning",
    description: "Checklistor och kundöverlämning",
    iconName: "checkmark-done-outline",
    colorKey: "cat7",
    chapterIds: ["c15", "c16"],
  },
];

export const getCategory = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);
