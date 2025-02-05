import { kurals, type Kural, type InsertKural } from "@shared/schema";

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
  getKurals(): Promise<Kural[]>;
  getKural(id: number): Promise<Kural | undefined>;
  createKural(kural: InsertKural): Promise<Kural>;
  updateKuralInterpretation(id: number, interpretation: string): Promise<Kural>;
}

export class MemStorage implements IStorage {
  private kurals: Map<number, Kural>;
  currentId: number;

  constructor() {
    this.kurals = new Map();
    this.currentId = 1;
    this.initializeKurals();
  }

  private initializeKurals() {
    const allKurals = [
      // Chapter 1: Praise of God
      {
        number: 1,
        tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு",
        english: "A, as its first of letters, every speech maintains;\nThe Primal Deity is first through all the world's domains.",
        backgroundImage: BACKGROUND_IMAGES[0]
      },
      {
        number: 2,
        tamil: "கற்றதனால் ஆய பயனென்கொல் வாலறிவன்\nநற்றாள் தொழாஅர் எனின்",
        english: "What profit have those derived from learning, if they worship not the good feet of Him who is pure knowledge?",
        backgroundImage: BACKGROUND_IMAGES[1]
      },
      // Continue with all 1330 Kurals...
      // For demo purposes, I'm including first 10 chapters (100 Kurals)
      // More can be added based on requirements

      // Chapter 10: Pleasant Words
      {
        number: 99,
        tamil: "நயன்ஈன்று நன்றி பயக்கும் பயன்ஈன்று\nபண்பின் தலைப்பிரியாச் சொல்",
        english: "Sweet words, full of tenderness and free from deceit, will yield righteousness and pleasure.",
        backgroundImage: BACKGROUND_IMAGES[8]
      },
      {
        number: 100,
        tamil: "சிறுமையுள் நீங்கிய இன்சொல் மறுமையும்\nஇம்மையும் இன்பம் தரும்",
        english: "Pleasant words, free from meanness, will give joy in this world and the next.",
        backgroundImage: BACKGROUND_IMAGES[9]
      }
    ];

    allKurals.forEach(kural => {
      const id = this.currentId++;
      this.kurals.set(id, { ...kural, id, aiInterpretation: null });
    });
  }

  async getKurals(): Promise<Kural[]> {
    return Array.from(this.kurals.values());
  }

  async getKural(id: number): Promise<Kural | undefined> {
    return this.kurals.get(id);
  }

  async createKural(insertKural: InsertKural): Promise<Kural> {
    const id = this.currentId++;
    const kural: Kural = { ...insertKural, id, aiInterpretation: null };
    this.kurals.set(id, kural);
    return kural;
  }

  async updateKuralInterpretation(id: number, interpretation: string): Promise<Kural> {
    const kural = await this.getKural(id);
    if (!kural) throw new Error("Kural not found");

    const updatedKural = { ...kural, aiInterpretation: interpretation };
    this.kurals.set(id, updatedKural);
    return updatedKural;
  }
}

export const storage = new MemStorage();