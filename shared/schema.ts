import { z } from "zod";

// Types for the Kural data
export const kuralSchema = z.object({
  number: z.number(),
  tamil: z.string(),
  english: z.string(),
  section: z.string(),
  chapter: z.string(),
  chapterGroup: z.string(),
  explanation: z.string().optional(),
  aiInterpretation: z.string().optional(),
  backgroundImage: z.string(),
  transliteration: z.string().optional(),
  translation: z.string().optional()
});

export type Kural = z.infer<typeof kuralSchema>;

// Types for the metadata from detail.json
export interface ChapterDetail {
  name: string;
  translation: string;
  transliteration: string;
  number: number;
  start: number;
  end: number;
}

export interface ChapterGroup {
  name: string;
  transliteration: string;
  translation: string;
  number: number;
  chapters: {
    tamil: string;
    detail: ChapterDetail[];
  };
}

export interface Section {
  name: string;
  transliteration: string;
  translation: string;
  number: number;
  chapterGroup: {
    tamil: string;
    detail: ChapterGroup[];
  };
}

export interface ThirukkuralDetail {
  tamil: string;
  section: {
    tamil: string;
    detail: Section[];
  };
}