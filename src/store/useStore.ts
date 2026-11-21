import { create } from "zustand";
import { GeoEvent, MarketData, User, VolatilityIndex, TimelineNode, Trigger } from "../types";

interface VolatilityState {
  events: GeoEvent[];
  timeline: TimelineNode[];
  selectedEvent: GeoEvent | null;
  marketData: MarketData | null;
  volatilityIndex: VolatilityIndex | null;
  triggers: Trigger[];
  user: User | null;
  isLoading: boolean;
  error: string | null;

  setEvents: (events: GeoEvent[]) => void;
  setTimeline: (timeline: TimelineNode[]) => void;
  setSelectedEvent: (event: GeoEvent | null) => void;
  setMarketData: (data: MarketData) => void;
  setVolatilityIndex: (index: VolatilityIndex) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  fetchEvents: () => Promise<void>;
  fetchTimeline: () => Promise<void>;
  fetchMarketData: () => Promise<void>;
}

export const useStore = create<VolatilityState>((set) => ({
  events: [],
  timeline: [],
  selectedEvent: null,
  marketData: null,
  volatilityIndex: null,
  triggers: [],
  user: { email: "trader@example.com", role: "free" },
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setTimeline: (timeline) => set({ timeline }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
  setMarketData: (marketData) => set({ marketData }),
  setVolatilityIndex: (volatilityIndex) => set({ volatilityIndex }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const user = useStore.getState().user;
      const response = await fetch("/api/events", {
        headers: {
          "X-User-Role": user?.role || "free"
        }
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      
      const triggers: Trigger[] = data.slice(0, 3).map((e: any, i: number) => ({
        id: `trigger-${i}`,
        timestamp: new Date(new Date(e.timestamp).getTime() + i * 5 * 60000).toISOString(),
        label: i === 0 ? "Oil crossed +1%" : i === 1 ? "Escalation confirmed" : "VIX spike >2%",
        type: i === 0 || i === 2 ? "market" : "intel"
      }));

      set({ events: data, triggers, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchTimeline: async () => {
    try {
      const response = await fetch("/api/timeline");
      if (!response.ok) throw new Error("Failed to fetch timeline");
      const data = await response.json();
      set({ timeline: data });
    } catch (err) {
      console.error("Timeline fetch error:", err);
    }
  },

  fetchMarketData: async () => {
    try {
      const response = await fetch("/api/market-data");
      if (!response.ok) throw new Error("Failed to fetch market data");
      const data = await response.json();
      
      const events = useStore.getState().events;
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      const recentEscalations = events.filter(e => new Date(e.timestamp) > sixHoursAgo).length;
      
      const oilScore = Math.min(Math.abs(data.oil.change1h) * 10, 100) * 0.4;
      const vixScore = Math.min(Math.abs(data.vix.change1h) * 5, 100) * 0.3;
      const escalationScore = Math.min(recentEscalations * 20, 100) * 0.2;
      const defenseScore = Math.min(Math.abs(data.defense.change) * 10, 100) * 0.1;
      
      const totalValue = Math.round(oilScore + vixScore + escalationScore + defenseScore);
      const label = totalValue > 65 ? "HIGH" : totalValue > 40 ? "MODERATE" : "LOW";
      
      set({ 
        marketData: data,
        volatilityIndex: { value: totalValue, label: label as any }
      });
    } catch (err) {
      console.error("Market data fetch error:", err);
    }
  },
}));
