/**
 * Manual content types for Smart Teknik playbook.
 *
 * Structured so the same data can later be edited from an admin portal /
 * API without changing the rendering code. Every chapter is built from
 * a typed `Block` union; new screens render blocks creatively.
 */

export type BlockType =
  | "paragraph"
  | "lede"
  | "heading"
  | "list"
  | "highlight"
  | "formula"
  | "table"
  | "phase"
  | "check"
  | "columns"
  | "colorRow"
  | "definition";

export type Paragraph = {
  type: "paragraph";
  text: string;
};

export type Lede = {
  type: "lede";
  text: string;
};

export type Heading = {
  type: "heading";
  level: 2 | 3 | 4;
  text: string;
};

export type List = {
  type: "list";
  ordered: boolean;
  items: string[];
};

export type Highlight = {
  type: "highlight";
  label?: string; // e.g. "Praktisk tolkning:"
  text: string;
};

export type Formula = {
  type: "formula";
  text: string;
};

export type Table = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type Phase = {
  type: "phase";
  number: string; // F1, F2...
  title: string;
  body: { paragraph?: string; outcome?: string }[];
};

export type Check = {
  type: "check";
  label: string; // 01, 02, ✓
  title?: string;
  body: string;
};

export type Columns = {
  type: "columns";
  count: 2 | 3;
  columns: {
    title?: string;
    paragraph?: string;
    items?: string[];
  }[];
};

export type ColorRow = {
  type: "colorRow";
  system: string;
  color: string; // hex or descriptor
  swatch?: string; // hex for the dot
  comment: string;
};

export type Definition = {
  type: "definition";
  term: string;
  description: string;
};

export type Block =
  | Paragraph
  | Lede
  | Heading
  | List
  | Highlight
  | Formula
  | Table
  | Phase
  | Check
  | Columns
  | ColorRow
  | Definition;

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Chapter {
  id: string;
  number: number;
  numberLabel: string; // "01", "02"... shown in eyebrow
  title: string;
  shortTitle: string;
  summary: string;
  categoryId: CategoryId;
  estimatedReadMinutes: number;
  updatedAt: string; // ISO date
  intro?: string;
  sections: Section[];
}

export type CategoryId =
  | "projekt"
  | "roller"
  | "projektering"
  | "installation"
  | "rack"
  | "natverk"
  | "overlamning";

export type CategoryColorKey =
  | "cat1"
  | "cat2"
  | "cat3"
  | "cat4"
  | "cat5"
  | "cat6"
  | "cat7";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string; // Ionicons name
  colorKey: CategoryColorKey;
  chapterIds: string[];
}
