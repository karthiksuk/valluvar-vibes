import { kurals, type Kural, type InsertKural } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1471666875520-c75081f42081",
  "https://images.unsplash.com/photo-1459908676235-d5f02a50184b",
  "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6",
  "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
  "https://images.unsplash.com/photo-1503455637927-730bce583c0",
  "https://images.unsplash.com/photo-1487088678257-3a541e6e3922",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
  "https://images.unsplash.com/photo-1584478036284-0018bef95c88",
  "https://images.unsplash.com/photo-1576085898323-218337e3e43c",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e"
];

export interface IStorage {
  getKurals(page?: number): Promise<{ kurals: Kural[]; hasMore: boolean }>;
  getKural(id: number): Promise<Kural | undefined>;
  createKural(kural: InsertKural): Promise<Kural>;
  updateKuralInterpretation(id: number, interpretation: string): Promise<Kural>;
  clearKurals(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private readonly PAGE_SIZE = 100;

  private getRandomBackgroundImage(): string {
    return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  }

  async getKurals(page: number = 1): Promise<{ kurals: Kural[]; hasMore: boolean }> {
    const offset = (page - 1) * this.PAGE_SIZE;

    // Fetch one extra record to determine if there are more pages
    const results = await db
      .select()
      .from(kurals)
      .orderBy(kurals.number)
      .limit(this.PAGE_SIZE + 1)
      .offset(offset);

    const hasMore = results.length > this.PAGE_SIZE;
    const kuralsForPage = hasMore ? results.slice(0, -1) : results;

    return {
      kurals: kuralsForPage,
      hasMore
    };
  }

  async getKural(id: number): Promise<Kural | undefined> {
    const [kural] = await db.select().from(kurals).where(eq(kurals.id, id));
    return kural;
  }

  async createKural(insertKural: InsertKural): Promise<Kural> {
    const [kural] = await db
      .insert(kurals)
      .values({
        ...insertKural,
        backgroundImage: this.getRandomBackgroundImage(),
      })
      .returning();
    return kural;
  }

  async updateKuralInterpretation(id: number, interpretation: string): Promise<Kural> {
    const [updatedKural] = await db
      .update(kurals)
      .set({ aiInterpretation: interpretation })
      .where(eq(kurals.id, id))
      .returning();

    if (!updatedKural) {
      throw new Error("Kural not found");
    }

    return updatedKural;
  }

  async clearKurals(): Promise<void> {
    await db.delete(kurals);
  }
}

export const storage = new DatabaseStorage();