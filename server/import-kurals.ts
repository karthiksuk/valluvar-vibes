import { thirukkuralData } from "../shared/thirukkural-data";
import { storage } from "./storage";
import { insertKuralSchema } from "@shared/schema";

async function importKurals() {
  console.log("Starting Thirukkural import...");
  let imported = 0;

  try {
    // First clear existing kurals to avoid duplicates
    await storage.clearKurals();

    for (const kural of thirukkuralData) {
      try {
        const parsedKural = insertKuralSchema.parse({
          ...kural,
          explanation: "",  // Can be added later if needed
          backgroundImage: "https://images.unsplash.com/photo-1471666875520-c75081f42081" // Using a default background for now
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