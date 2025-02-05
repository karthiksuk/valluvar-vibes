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

  app.get("/api/kurals/:id/interpretation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kural = thirukkuralData.find(k => k.number === id);

      if (!kural) {
        return res.status(404).json({ message: "Kural not found" });
      }

      console.log(`Generating interpretation for Kural #${id}`);
      const interpretation = await generateKuralInterpretation(
        kural.tamil,
        kural.english
      );

      if (!interpretation) {
        throw new Error("No interpretation generated");
      }

      res.json({ interpretation });
    } catch (error) {
      console.error("Failed to generate interpretation:", error);
      res.status(500).json({ 
        message: "Failed to generate interpretation",
        error: error.message 
      });
    }
  });

  return createServer(app);
}