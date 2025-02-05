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

    for (const kural of thirukkuralDataset) {
      try {
        const metadata = findMetadata(kural.number, detailData[0]);
        if (!metadata) {
          console.error(`No metadata found for kural ${kural.number}`);
          continue;
        }

        const parsedKural = insertKuralSchema.parse({
          ...kural,
          section: metadata.section,
          chapter: metadata.chapter,
          chapterGroup: metadata.chapterGroup,
          explanation: kural.explanation || "",
          transliteration: metadata.transliteration,
          translation: metadata.translation,
          backgroundImage: kural.backgroundImage || "https://images.unsplash.com/photo-1471666875520-c75081f42081"
        });

        await storage.createKural(parsedKural);
        imported++;

        if (imported % 100 === 0) {
          console.log(`Imported ${imported} kurals...`);
        }
      } catch (error) {
        console.error(`Failed to import kural ${kural.number}:`, error);
      }
    }
  } catch (error) {
    console.error("Import failed:", error);
  }

  console.log(`Import completed. Total kurals imported: ${imported}`);
}

importKurals().catch(console.error);