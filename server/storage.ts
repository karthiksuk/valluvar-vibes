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
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e",
  // Reuse images for remaining kurals in a rotating pattern
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

  private getBackgroundImage(index: number): string {
    return BACKGROUND_IMAGES[index % BACKGROUND_IMAGES.length];
  }

  private initializeKurals() {
    const allKurals = [
      // Chapter 1: Praise of God
      {
        number: 1,
        tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு",
        english: "A, as its first of letters, every speech maintains;\nThe Primal Deity is first through all the world's domains.",
        backgroundImage: this.getBackgroundImage(0)
      },
      {
        number: 2,
        tamil: "கற்றதனால் ஆய பயனென்கொல் வாலறிவன்\nநற்றாள் தொழாஅர் எனின்",
        english: "What profit have those derived from learning, if they worship not the good feet of Him who is pure knowledge?",
        backgroundImage: this.getBackgroundImage(1)
      },
      {
        number: 3,
        tamil: "மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்\nநிலமிசை நீடுவாழ் வார்",
        english: "Long live they on earth who reach the feet of Him who walks upon the flower of the mind.",
        backgroundImage: this.getBackgroundImage(2)
      },
      // Add all 1330 Kurals here
      // Chapter 133: The Realization of Truth
      {
        number: 1330,
        tamil: "தாம்வீழ்வார் மென்தோள் துயிலின் இனிதுகொல்\nதாமரைக் கண்ணான் உலகு",
        english: "Sweeter than rest in sleep in the arms of one you love is union with the Lord of the lotus eyes.",
        backgroundImage: this.getBackgroundImage(1329)
      }
    ];

    // Load all kurals with rotating background images
    const totalKurals = 1330;
    for (let i = 1; i <= totalKurals; i++) {
      const kuralData = allKurals.find(k => k.number === i) || {
        number: i,
        tamil: `Kural ${i} Tamil text`, // Placeholder
        english: `Kural ${i} English translation`, // Placeholder
        backgroundImage: this.getBackgroundImage(i - 1)
      };

      const id = this.currentId++;
      this.kurals.set(id, { ...kuralData, id, aiInterpretation: null });
    }
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