import type { Express } from "express";
import { createServer, type Server } from "http";
import { thirukkuralData } from "../shared/thirukkural-data";
import { generateKuralInterpretation } from "./openai";

const PAGE_SIZE = 100;

export function registerRoutes(app: Express): Server {
  app.get("/api/kurals", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      const kurals = thirukkuralData.slice(start, end).map(kural => ({
        id: kural.number,
        ...kural,
        backgroundImage: "https://images.unsplash.com/photo-1471666875520-c75081f42081",
        aiInterpretation: null
      }));

      res.json({ 
        kurals,
        hasMore: end < thirukkuralData.length
      });
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