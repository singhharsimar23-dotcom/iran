import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GeoEvent } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data: Iran War Volatility Signals
  const events: GeoEvent[] = [
    {
      id: "sig-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      headline: "NAVAL ESCALATION",
      source: "Reuters",
      region: "Hormuz",
      category: "Naval",
      credibility: "High",
      impactLevel: "Major",
      oil1hReaction: 0.9,
      oil4hReaction: 1.45,
      vixReaction: 1.2,
      llmSummary: "IRGC fast-attack craft reported within 500m of commercial tanker.",
      historicalStats: {
        oil1hAvg: 0.75,
        oil4hAvg: 2.1,
        vixAvg: 1.1,
        etfOutperformance: 68,
        sampleSize: 6
      },
      oilProbability4h: 71,
      currentOilMove: 0.9,
      status: "Confirmed",
      credibilityScore: 90,
      isSignal: true,
      isIranInvolved: true,
      isMarketSensitive: true
    },
    {
      id: "sig-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      headline: "INFRASTRUCTURE STRIKE",
      source: "Local OSINT",
      region: "Isfahan",
      category: "Infrastructure",
      credibility: "Medium",
      impactLevel: "Moderate",
      oil1hReaction: 1.20,
      oil4hReaction: 2.10,
      vixReaction: 1.8,
      llmSummary: "Unconfirmed drone strike near logistics hub tied to oil distribution.",
      historicalStats: {
        oil1hAvg: 1.2,
        oil4hAvg: 2.4,
        vixAvg: 1.4,
        etfOutperformance: 73,
        sampleSize: 4
      },
      oilProbability4h: 84,
      currentOilMove: 1.20,
      status: "Developing",
      credibilityScore: 75,
      isSignal: true,
      isIranInvolved: true,
      isMarketSensitive: true
    },
    {
      id: "raw-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      headline: "Diplomatic Statement from EU",
      source: "AFP",
      region: "Brussels",
      category: "Political",
      credibility: "High",
      impactLevel: "Minor",
      oil1hReaction: 0.05,
      oil4hReaction: 0.1,
      vixReaction: 0.1,
      llmSummary: "EU calls for restraint in the region.",
      historicalStats: {
        oil1hAvg: 0.05,
        oil4hAvg: 0.1,
        vixAvg: 0.1,
        etfOutperformance: 10,
        sampleSize: 50
      },
      oilProbability4h: 5,
      currentOilMove: 0.05,
      status: "Confirmed",
      credibilityScore: 95,
      isSignal: false,
      isIranInvolved: false,
      isMarketSensitive: false
    },
    {
      id: "raw-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      headline: "Minor Border Skirmish",
      source: "Local News",
      region: "Levant",
      category: "Strike",
      credibility: "Medium",
      impactLevel: "Minor",
      oil1hReaction: 0.1,
      oil4hReaction: 0.2,
      vixReaction: 0.1,
      llmSummary: "Small arms fire reported at border crossing.",
      historicalStats: {
        oil1hAvg: 0.1,
        oil4hAvg: 0.2,
        vixAvg: 0.1,
        etfOutperformance: 15,
        sampleSize: 30
      },
      oilProbability4h: 10,
      currentOilMove: 0.1,
      status: "Developing",
      credibilityScore: 60,
      isSignal: false,
      isIranInvolved: false,
      isMarketSensitive: false
    },
    {
      id: "sig-003",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      headline: "CYBER ATTACK ON PORT",
      source: "AP",
      region: "Global",
      category: "Infrastructure",
      credibility: "Low",
      impactLevel: "Minor",
      oil1hReaction: 0.15,
      oil4hReaction: 0.35,
      vixReaction: 0.2,
      llmSummary: "Reports of network outages at Bandar Abbas terminal.",
      historicalStats: {
        oil1hAvg: 0.1,
        oil4hAvg: 0.5,
        vixAvg: 0.3,
        etfOutperformance: 45,
        sampleSize: 10
      },
      oilProbability4h: 32,
      currentOilMove: 0.15,
      status: "Unconfirmed",
      credibilityScore: 95,
      isSignal: true,
      isIranInvolved: true,
      isMarketSensitive: true
    }
  ];

interface TimelineNode {
  time: string;
  label: string;
  type: "event" | "market";
  value?: string;
}

const timeline: TimelineNode[] = [
    { time: "09:15", label: "Naval Patrol Increased", type: "event" },
    { time: "10:40", label: "Drone Strike Reported", type: "event" },
    { time: "11:05", label: "Oil Reaction", type: "market", value: "+1.2%" },
    { time: "11:20", label: "VIX Expansion", type: "market", value: "+1.1" },
  ];

  // API Routes
  app.get("/api/events", (req, res) => {
    const userRole = req.headers["x-user-role"] || "free";
    
    let filteredEvents = [...events];
    
    if (userRole === "free") {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      filteredEvents = filteredEvents.map((e) => {
        const isTooNew = new Date(e.timestamp) > tenMinsAgo;
        return { ...e, isLocked: isTooNew };
      });
      filteredEvents = filteredEvents.slice(0, 3);
    }

    const sortedEvents = filteredEvents.sort((a, b) => {
      const scoreA = (a.credibilityScore * 0.5) + (a.oilProbability4h * 0.5);
      const scoreB = (b.credibilityScore * 0.5) + (b.oilProbability4h * 0.5);
      return scoreB - scoreA;
    });
    res.json(sortedEvents);
  });

  app.get("/api/timeline", (req, res) => {
    res.json(timeline);
  });

  app.get("/api/market-data", (req, res) => {
    res.json({
      oil: { 
        price: 82.45, 
        change: 1.45, 
        change1h: 0.85, 
        change4h: 2.10, 
        isAboveNormal: true,
        history: [81.2, 81.5, 81.1, 81.8, 82.1, 82.45] 
      },
      vix: { 
        price: 18.25, 
        change: 5.10, 
        change1h: 2.30, 
        change4h: 4.50, 
        isAboveNormal: true,
        history: [16.5, 16.8, 17.2, 17.5, 17.8, 18.25] 
      },
      gold: { 
        price: 2155.20, 
        change: 0.32, 
        change1h: 0.12, 
        change4h: 0.45, 
        isAboveNormal: false,
        history: [2140, 2145, 2148, 2150, 2152, 2155.2] 
      },
      defense: { 
        price: 124.12, 
        change: 0.85, 
        change1h: 0.35, 
        change4h: 1.10, 
        isAboveNormal: false,
        history: [122.5, 123.1, 123.4, 123.8, 124.0, 124.12] 
      }
    });
  });

  // Stripe Placeholder
  app.post("/api/create-checkout-session", (req, res) => {
    const { planId } = req.body;
    res.json({ url: "https://checkout.stripe.com/pay/placeholder", sessionId: "cs_test_123" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
