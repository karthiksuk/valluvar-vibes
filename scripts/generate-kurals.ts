// This script generates a full dataset of 1330 kurals
const kurals: Array<{
  number: number;
  tamil: string;
  english: string;
  section: string;
  chapter: string;
  chapterGroup: string;
}> = [];

// Section 1: அறத்துப்பால் (1-380)
for (let i = 1; i <= 380; i++) {
  kurals.push({
    number: i,
    tamil: `Tamil text for kural ${i}`, // We'll need to replace with actual Tamil text
    english: `English translation for kural ${i}`, // We'll need to replace with actual translation
    section: "அறத்துப்பால்",
    chapter: "Chapter for kural " + i,
    chapterGroup: i <= 40 ? "பாயிரவியல்" : "இல்லறவியல்"
  });
}

// Section 2: பொருட்பால் (381-1080)
for (let i = 381; i <= 1080; i++) {
  kurals.push({
    number: i,
    tamil: `Tamil text for kural ${i}`,
    english: `English translation for kural ${i}`,
    section: "பொருட்பால்",
    chapter: "Chapter for kural " + i,
    chapterGroup: "அரசியல்"
  });
}

// Section 3: காமத்துப்பால் (1081-1330)
for (let i = 1081; i <= 1330; i++) {
  kurals.push({
    number: i,
    tamil: `Tamil text for kural ${i}`,
    english: `English translation for kural ${i}`,
    section: "காமத்துப்பால்",
    chapter: "Chapter for kural " + i,
    chapterGroup: "களவியல்"
  });
}

console.log(JSON.stringify(kurals, null, 2));