import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const kurals = pgTable("kurals", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  tamil: text("tamil").notNull(),
  english: text("english").notNull(),
  section: text("section").notNull(),
  chapter: text("chapter").notNull(),
  chapterGroup: text("chapter_group").notNull(),
  explanation: text("explanation"),
  aiInterpretation: text("ai_interpretation"),
  backgroundImage: text("background_image").notNull(),
  transliteration: text("transliteration"),
  translation: text("translation")
});

export const insertKuralSchema = createInsertSchema(kurals).omit({ 
  id: true,
  aiInterpretation: true 
});

export type InsertKural = z.infer<typeof insertKuralSchema>;
export type Kural = typeof kurals.$inferSelect;

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