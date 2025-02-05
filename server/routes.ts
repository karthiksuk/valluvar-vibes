import type { Express } from "express";
import { createServer, type Server } from "http";
import { thirukkuralData } from "../shared/thirukkural-data";
import { generateKuralInterpretation } from "./openai";

export function registerRoutes(app: Express): Server {
  app.get("/api/kurals", async (req, res) => {
    try {
      // Map the data to include background images
      const kurals = thirukkuralData.map(kural => ({
        id: kural.number,
        ...kural,
        backgroundImage: "https://images.unsplash.com/photo-1471666875520-c75081f42081"
      }));

      res.json({ kurals });
    } catch (error) {
      console.error("Failed to fetch kurals:", error);
      res.status(500).json({ message: "Failed to fetch kurals" });
    }
  });

  app.get("/api/kurals/:number/interpretation", async (req, res) => {
    try {
      const number = parseInt(req.params.number);
      console.log(`Received interpretation request for Kural #${number}`);

      const kural = thirukkuralData.find(k => k.number === number);

      if (!kural) {
        console.error(`Kural not found for number: ${number}`);
        return res.status(404).json({ message: "Kural not found" });
      }

      console.log(`Found Kural #${number}, generating interpretation...`);
      console.log("Kural content:", {
        tamil: kural.tamil,
        english: kural.english,
      });

      const interpretation = await generateKuralInterpretation(
        kural.tamil,
        kural.english
      );

      if (!interpretation) {
        throw new Error("No interpretation generated");
      }

      console.log(`Successfully generated interpretation for Kural #${number}`);
      res.json({ interpretation });
    } catch (error: any) {
      console.error("Failed to generate interpretation:", {
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ 
        message: "Failed to generate interpretation",
        error: error.message 
      });
    }
  });

  return createServer(app);
}