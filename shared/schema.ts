import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const kurals = pgTable("kurals", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull(),
  tamil: text("tamil").notNull(),
  english: text("english").notNull(),
  section: text("section"),
  chapter: text("chapter"),
  chapterGroup: text("chapter_group"),
  explanation: text("explanation"),
  aiInterpretation: text("ai_interpretation"),
  backgroundImage: text("background_image").notNull(),
});

export const insertKuralSchema = createInsertSchema(kurals).omit({ 
  id: true,
  aiInterpretation: true 
});

export type InsertKural = z.infer<typeof insertKuralSchema>;
export type Kural = typeof kurals.$inferSelect;