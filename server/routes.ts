import type { Express } from "express";
import { createServer, type Server } from "http";
import { thirukkuralData } from "../shared/thirukkural-data";
import { generateKuralInterpretation } from "./openai";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1471666875520-c75081f42081",
  "https://images.unsplash.com/photo-1459908676235-d5f02a50184b",
  "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6",
  "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
  "https://images.unsplash.com/photo-1503455637927-730bce583c0",
  "https://images.unsplash.com/photo-1487088678257-3a541e6e3922"
];

function getRandomBackgroundImage(): string {
  return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
}

export function registerRoutes(app: Express): Server {
  app.get("/api/kurals", async (req, res) => {
    try {
      // Map the data to include background images
      const kurals = thirukkuralData.map(kural => ({
        ...kural,
        id: kural.number,
        backgroundImage: getRandomBackgroundImage()
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

      const interpretation = await generateKuralInterpretation(
        kural.tamil,
        kural.english
      );

      res.json({ interpretation });
    } catch (error) {
      console.error("Failed to generate interpretation:", error);
      res.status(500).json({ message: "Failed to generate interpretation" });
    }
  });

  return createServer(app);
}