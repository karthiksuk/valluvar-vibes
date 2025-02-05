import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateKuralInterpretation } from "./openai";

export function registerRoutes(app: Express): Server {
  app.get("/api/kurals", async (req, res) => {
    try {
      const kurals = await storage.getKurals();
      res.json({ kurals });
    } catch (error) {
      console.error("Failed to fetch kurals:", error);
      res.status(500).json({ message: "Failed to fetch kurals" });
    }
  });

  app.get("/api/kurals/:id/interpretation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kural = await storage.getKural(id);

      if (!kural) {
        return res.status(404).json({ message: "Kural not found" });
      }

      const interpretation = await generateKuralInterpretation(
        kural.tamil,
        kural.english
      );

      const updatedKural = await storage.updateKuralInterpretation(id, interpretation);
      res.json({ interpretation });
    } catch (error) {
      console.error("Failed to generate interpretation:", error);
      res.status(500).json({ message: "Failed to generate interpretation" });
    }
  });

  return createServer(app);
}