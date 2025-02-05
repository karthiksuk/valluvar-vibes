import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateKuralInterpretation } from "./openai";

export function registerRoutes(app: Express): Server {
  app.get("/api/kurals", async (_req, res) => {
    try {
      const kurals = await storage.getKurals();
      res.json(kurals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch kurals" });
    }
  });

  app.get("/api/kurals/:id/interpretation", async (req, res) => {
    try {
      const kural = await storage.getKural(parseInt(req.params.id));
      if (!kural) {
        return res.status(404).json({ message: "Kural not found" });
      }

      if (kural.aiInterpretation) {
        return res.json({ interpretation: kural.aiInterpretation });
      }

      const interpretation = await generateKuralInterpretation(
        kural.tamil,
        kural.english
      );

      const updatedKural = await storage.updateKuralInterpretation(
        kural.id,
        interpretation
      );

      res.json({ interpretation: updatedKural.aiInterpretation });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate interpretation" });
    }
  });

  return createServer(app);
}
