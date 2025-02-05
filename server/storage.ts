import { kurals, type Kural, type InsertKural } from "@shared/schema";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1471666875520-c75081f42081",
  "https://images.unsplash.com/photo-1459908676235-d5f02a50184b",
  "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6",
  "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
  "https://images.unsplash.com/photo-1503455637927-730bce583c0",
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
      },
      {
        number: 6,
        tamil: "பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க\nநெறிநின்றார் நீடுவாழ் வார்",
        english: "Those who walk the path of His true rules, who controls the five senses, shall long endure above the worlds of the gods.",
        backgroundImage: BACKGROUND_IMAGES[5]
      },
      {
        number: 7,
        tamil: "தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க் கல்லால்\nமனக்கவலை மாற்றல் அரிது",
        english: "Anxiety of mind cannot be removed, except from those who are united to the feet of Him who is incomparable.",
        backgroundImage: BACKGROUND_IMAGES[0]
      },
      {
        number: 8,
        tamil: "அறவாழி அந்தணன் தாள்சேர்ந்தார்க் கல்லால்\nபிறவாழி நீந்தல் அரிது",
        english: "None can swim the sea of vice, but those who are united to the feet of that gracious Being who is a sea of virtue.",
        backgroundImage: BACKGROUND_IMAGES[1]
      },
      {
        number: 9,
        tamil: "கோளில் பொறியின் குணமிலவே எண்குணத்தான்\nதாளை வணங்காத் தலை",
        english: "The head that worships not the feet of Him who is possessed of eight attributes, is as useless as a sense without the power of sensation.",
        backgroundImage: BACKGROUND_IMAGES[2]
      },
      {
        number: 10,
        tamil: "பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்\nஇறைவன் அடிசேரா தார்",
        english: "None can swim the great sea of births but those who are united to the feet of God.",
        backgroundImage: BACKGROUND_IMAGES[3]
      },
      // Chapter 2: The Excellence of Rain
      {
        number: 11,
        tamil: "வான்நின்று உலகம் வழங்கி வருதலால்\nதான்அமிழ்தம் என்றுணரற் பாற்று",
        english: "The rain cloud, drawing from the sea, gives rain; thereby it provides food and is itself food for men.",
        backgroundImage: BACKGROUND_IMAGES[4]
      },
      {
        number: 12,
        tamil: "துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத்\nதுப்பாய தூஉம் மழை",
        english: "Rain produces good food for the eaters, and is itself their food.",
        backgroundImage: BACKGROUND_IMAGES[5]
      },
      // Chapter 3: The Greatness of Ascetics
      {
        number: 21,
        tamil: "ஒழுக்காறாக் கொள்க ஒருவன்தன் நெஞ்சத்து\nஅழுக்காறு இலாத இயல்பு",
        english: "Let him who would learn the virtue of the ascetic life keep his soul from the evil of envy.",
        backgroundImage: BACKGROUND_IMAGES[0]
      },
      {
        number: 22,
        tamil: "செயற்கரிய செய்வார் பெரியர் சிறியர்\nசெயற்கரிய செய்கலா தார்",
        english: "The great do mighty deeds; the mean cannot.",
        backgroundImage: BACKGROUND_IMAGES[1]
      },
      // Chapter 4: Virtue
      {
        number: 31,
        tamil: "சிறப்பீனும் செல்வம் பெறினும் பிறர்க்கின்னா\nசெய்யாமை மாசற்றார் கோள்",
        english: "The spotless are they who, though they prosper, grieve not others, though they could.",
        backgroundImage: BACKGROUND_IMAGES[2]
      },
      {
        number: 32,
        tamil: "அருள்செல்வம் செல்வத்துள் செல்வம் பொருள்செல்வம்\nபூரியார் கண்ணும் உள",
        english: "Mercy is true wealth; material wealth may be found even with those who are destitute of virtue.",
        backgroundImage: BACKGROUND_IMAGES[3]
      },
      // Chapter 5: Domestic Life
      {
        number: 41,
        tamil: "இல்வாழ்வான் என்பான் இயல்புடைய மூவர்க்கும்\nநல்லாற்றின் நின்ற துணை",
        english: "He who lives the domestic life supports the ascetic, the seeker of wisdom and those who cannot support themselves.",
        backgroundImage: BACKGROUND_IMAGES[4]
      },
      {
        number: 42,
        tamil: "துறந்தார்க்கும் துவ்வா தவர்க்கும் இறந்தார்க்கும்\nஇல்வாழ்வான் என்பான் துணை",
        english: "The householder supports ascetics, the poor and the dead (by performing their rites).",
        backgroundImage: BACKGROUND_IMAGES[5]
      },
      // Chapter 6: The Good Wife
      {
        number: 51,
        tamil: "மனைத்தக்க மாண்புடையள் ஆகித்தற் கொண்டான்\nவளத்தக்காள் வாழ்க்கைத் துணை",
        english: "She who has the qualities proper to a wife, helps to lead a praiseworthy life in the home.",
        backgroundImage: BACKGROUND_IMAGES[0]
      },
      {
        number: 52,
        tamil: "மனைமாட்சி இல்லாள்கண் இல்லாயின் வாழ்க்கை\nஎனைமாட்சித் தாயினும் இல்",
        english: "If the wife lacks excellence, domestic life, however prosperous, is empty.",
        backgroundImage: BACKGROUND_IMAGES[1]
      },
      // Chapter 7: Children
      {
        number: 61,
        tamil: "பெறுமவற்றுள் யாமறிவ தில்லை அறிவறிந்த\nமக்கட்பேறு அல்ல பிற",
        english: "Among all that men may acquire, we know not of any better than having learned children.",
        backgroundImage: BACKGROUND_IMAGES[2]
      },
      {
        number: 62,
        tamil: "எழுபிறப்பும் தீயவை தீண்டா பழிபிறங்காப்\nபண்புடை மக்கட் பெறின்",
        english: "Those who are blessed with good children will not be touched by evil through seven births.",
        backgroundImage: BACKGROUND_IMAGES[3]
      },
      // Chapter 8: Love
      {
        number: 71,
        tamil: "அன்பிற்கும் உண்டோ அடைக்குந்தாழ் ஆர்வலர்\nபுன்கணீர் பூசல் தரும்",
        english: "Is there a bolt to shut in love? The tears of the affectionate will publish the love that is within.",
        backgroundImage: BACKGROUND_IMAGES[4]
      },
      {
        number: 72,
        tamil: "அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார்\nஎன்பும் உரியர் பிறர்க்கு",
        english: "The loveless belong only to themselves; the loving belong to others to their very bones.",
        backgroundImage: BACKGROUND_IMAGES[5]
      },
      // Chapter 9: Hospitality
      {
        number: 81,
        tamil: "விருந்து புறத்ததாத் தானுண்டல் சாவா\nமருந்தெனினும் வேண்டற்பாற் றன்று",
        english: "To eat after keeping out a guest is not good, even if one were to eat the food of immortality.",
        backgroundImage: BACKGROUND_IMAGES[0]
      },
      {
        number: 82,
        tamil: "செல்விருந்து ஓம்பி வருவிருந்து பார்த்திருப்பான்\nநல்விருந்து வானத் தவர்க்கு",
        english: "He who, having entertained the guests that have come, looks out for others who may yet come, will be a welcome guest to the inhabitants of heaven.",
        backgroundImage: BACKGROUND_IMAGES[1]
      },
      // Chapter 10: Pleasant Words
      {
        number: 91,
        tamil: "இன்சொலால் ஈரம் அளைஇப் படிறிலவாம்\nசெம்பொருள் கண்டார்வாய்ச் சொல்",
        english: "The words of the wise are like words of healing, born of kindness and free from deceit.",
        backgroundImage: BACKGROUND_IMAGES[2]
      },
      {
        number: 92,
        tamil: "அகன்அமர்ந்து ஈதலின் நன்றே முகனமர்ந்து\nஇன்சொலன் ஆகப் பெறின்",
        english: "Better than giving with a joyous heart is speaking with a joyous face.",
        backgroundImage: BACKGROUND_IMAGES[3]
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