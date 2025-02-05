import thirukkuralDataset from "./thirukkural.json";
import detailData from "./detail.json";

function findMetadata(number: number, details: any) {
  for (const section of details.section.detail) {
    for (const chapterGroup of section.chapterGroup.detail) {
      for (const chapter of chapterGroup.chapters.detail) {
        if (number >= chapter.start && number <= chapter.end) {
          return {
            section: section.name,
            chapterGroup: chapterGroup.name,
            chapter: chapter.name
          };
        }
      }
    }
  }
  return null;
}

// Transform the raw data into our expected format
const kuralsArray = Array.isArray(thirukkuralDataset) ? thirukkuralDataset : thirukkuralDataset.kural || [];
export const thirukkuralData = kuralsArray.map(kural => {
  const number = kural.Number || kural.number;
  const metadata = findMetadata(number, detailData[0]);

  return {
    number,
    tamil: kural.Line1 && kural.Line2 ? `${kural.Line1}\n${kural.Line2}` : kural.tamil,
    english: kural.Translation || kural.english,
    section: metadata?.section || "",
    chapter: metadata?.chapter || "",
    chapterGroup: metadata?.chapterGroup || "",
    explanation: kural.explanation || kural.mv || "",
  };
}).sort((a, b) => a.number - b.number);