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

  private getRandomBackgroundImage(): string {
    return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private initializeKurals() {
    const kuralsData = [
      {
        number: 1,
        tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு",
        english: "A, as its first of letters, every speech maintains;\nThe Primal Deity is first through all the world's domains."
      },
      {
        number: 325,
        tamil: "அருளல்லது யாதெனின் கொல்லாமை கோறல்\nபொருளல்லது அவ்வூன் தினல்",
        english: "What is kindness? It is not killing. What is not kindness? It is killing and eating the flesh of what you killed."
      },
      {
        number: 37,
        tamil: "அன்புடைமை ஆன்ற குடிப்பிறத்தல் வேந்தவாம்\nபண்புடைமை தூதுரைப்பான் பண்பு",
        english: "Love, noble birth, grace - these are the qualities of a true messenger."
      },
      {
        number: 746,
        tamil: "அறிவினான் ஆகுவ துண்டோ பிறிதினோய்\nதன்னோய்போல் போற்றாக் கடை",
        english: "What good is wisdom if one does not treat others' pain as one's own?"
      },
      {
        number: 1200,
        tamil: "கண்ணின் துனித்தே கலங்கினாள் பூப்பின்\nவெண்ணீர் கலுழ்ந்தனள் அழுது",
        english: "Her eyes welled up with tears of joy at the sight of the first flowers blooming."
      },
      // Add more Kurals representing different themes and chapters
      {
        number: 961,
        tamil: "தெய்வத்தான் ஆகா தெனினும் முயற்சிதன்\nமெய்வருத்தக் கூலி தரும்",
        english: "Though fate-divine should make your labour vain;\nEffort its labour's sure reward will gain."
      }
    ];

    // Shuffle the Kurals array
    const shuffledKurals = this.shuffle(kuralsData);

    // Add shuffled Kurals to the map with random background images
    shuffledKurals.forEach(kural => {
      const id = this.currentId++;
      this.kurals.set(id, {
        ...kural,
        id,
        aiInterpretation: null,
        backgroundImage: this.getRandomBackgroundImage()
      });
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
    const kural: Kural = {
      ...insertKural,
      id,
      aiInterpretation: null,
      backgroundImage: this.getRandomBackgroundImage()
    };
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