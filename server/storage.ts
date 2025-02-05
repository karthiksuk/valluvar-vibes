import { kurals, type Kural, type InsertKural } from "@shared/schema";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1471666875520-c75081f42081",
  "https://images.unsplash.com/photo-1459908676235-d5f02a50184b",
  "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6",
  "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
  "https://images.unsplash.com/photo-1503455637927-730bce8583c0",
  "https://images.unsplash.com/photo-1487088678257-3a541e6e3922"
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
    const sampleKurals = [
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
      {
        number: 3,
        tamil: "மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்\nநிலமிசை நீடுவாழ் வார்",
        english: "Long live they on earth who reach the feet of Him who walks upon the flower of the mind.",
        backgroundImage: BACKGROUND_IMAGES[2]
      },
      {
        number: 4,
        tamil: "வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு\nயாண்டும் இடும்பை இல",
        english: "To those who reach the feet of Him who is free from desire or dislike, there is no distress forever.",
        backgroundImage: BACKGROUND_IMAGES[3]
      },
      {
        number: 5,
        tamil: "இருள்சேர் இருவினையும் சேரா இறைவன்\nபொருள்சேர் புகழ்புரிந்தார் மாட்டு",
        english: "The two deeds that spring from darkness will not cling to those who delight in the true praise of God.",
        backgroundImage: BACKGROUND_IMAGES[4]
      }
    ];

    sampleKurals.forEach(kural => {
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