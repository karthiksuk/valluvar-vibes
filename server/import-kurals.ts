import { storage } from "./storage";
import { insertKuralSchema, type ThirukkuralDetail } from "@shared/schema";
import thirukkuralDataset from "../shared/thirukkural.json";
import detailData from "../shared/detail.json";

function findMetadata(number: number, details: ThirukkuralDetail) {
  // Find the section, chapter group, and chapter for a given kural number
  for (const section of details.section.detail) {
    for (const chapterGroup of section.chapterGroup.detail) {
      for (const chapter of chapterGroup.chapters.detail) {
        if (number >= chapter.start && number <= chapter.end) {
          return {
            section: section.name,
            chapterGroup: chapterGroup.name,
            chapter: chapter.name,
            translation: chapter.translation,
            transliteration: chapter.transliteration
          };
        }
      }
    }
  }
  return null;
}

async function importKurals() {
  console.log("Starting Thirukkural import...");
  let imported = 0;

  try {
    // First clear existing kurals to avoid duplicates
    await storage.clearKurals();

    // Generate all 1330 kurals
    for (let number = 1; number <= 1330; number++) {
      try {
        const metadata = findMetadata(number, detailData[0]);
        if (!metadata) {
          console.error(`No metadata found for kural ${number}`);
          continue;
        }

        // Get random background image
        const backgroundImages = [
          "https://images.unsplash.com/photo-1471666875520-c75081f42081",
          "https://images.unsplash.com/photo-1459908676235-d5f02a50184b",
          "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6",
          "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
          "https://images.unsplash.com/photo-1503455637927-730bce583c0",
          "https://images.unsplash.com/photo-1487088678257-3a541e6e3922"
        ];
        const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

        const kural = {
          number,
          tamil: `Tamil text for kural ${number}`, // We'll replace this with actual text later
          english: `English translation for kural ${number}`, // We'll replace this with actual translation later
          section: metadata.section,
          chapter: metadata.chapter,
          chapterGroup: metadata.chapterGroup,
          backgroundImage: randomImage,
          transliteration: metadata.transliteration,
          translation: metadata.translation,
          explanation: ""
        };

        const parsedKural = insertKuralSchema.parse(kural);
        await storage.createKural(parsedKural);
        imported++;

        if (imported % 100 === 0) {
          console.log(`Imported ${imported} kurals...`);
        }
      } catch (error) {
        console.error(`Failed to import kural ${number}:`, error);
      }
    }
  } catch (error) {
    console.error("Import failed:", error);
  }

  console.log(`Import completed. Total kurals imported: ${imported}`);
}

// Run the import
importKurals().catch(console.error);