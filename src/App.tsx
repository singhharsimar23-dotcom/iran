import React, { useEffect } from "react";
import { VolatilityHero } from "./components/VolatilityHero";
import { ReactionBoard } from "./components/ReactionBoard";
import { EscalationFeed } from "./components/EscalationFeed";
import { UpgradePanel } from "./components/UpgradePanel";
import { ProofLayer } from "./components/ProofLayer";
import { IntelSidebar } from "./components/IntelSidebar";
import { EscalationTimeline } from "./components/EscalationTimeline";
import { SignalFeedView } from "./components/SignalFeedView";
import { useStore } from "./store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Zap, AlertTriangle, Activity, Lock } from "lucide-react";

export default function App() {
  const { fetchEvents, fetchMarketData, fetchTimeline, error, user } = useStore();
  const [view, setView] = React.useState<"dashboard" | "signal-feed">("dashboard");

  useEffect(() => {
    fetchEvents();
    fetchMarketData();
    fetchTimeline();

    // Poll for updates every 60 seconds
    const interval = setInterval(() => {
      fetchEvents();
      fetchMarketData();
      fetchTimeline();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchEvents, fetchMarketData, fetchTimeline]);

  const scrollToUpgrade = () => {
    const element = document.getElementById('upgrade');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-950 text-red-500 font-mono p-8 text-center">
        <div className="max-w-md border border-red-900/50 bg-red-900/10 p-6 rounded">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-widest">System Failure</h2>
          <p className="text-sm opacity-80 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 transition-colors rounded text-xs font-bold uppercase"
          >
            Re-initialize System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 selection:bg-emerald-500/30 font-sans pb-20 md:pb-0 flex flex-col">
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1"
          >
            {/* Header / Nav */}
            <nav className="h-14 border-b border-navy-800 bg-navy-950 flex items-center justify-between px-6 sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-100">
                  Iran War <span className="text-emerald-500">Volatility</span>
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Intel Active
                  </div>
                </div>
                <button 
                  onClick={scrollToUpgrade}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Upgrade
                </button>
              </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
              {/* Main Content Area */}
              <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                {/* Section 1: Live Reaction Board */}
                <ReactionBoard onNavigateToSignalFeed={() => setView("signal-feed")} />

                {/* Section 2: War Volatility Index (Hero) */}
                <VolatilityHero />

                {/* Section 3: Escalation Timeline */}
                <EscalationTimeline />

                {/* Section 4: Escalation Feed */}
                <EscalationFeed />

                {/* Section 5: Proof Layer */}
                <ProofLayer />

                {/* Section 4: Alert Upgrade Panel */}
                <UpgradePanel />

                {/* Global Status Bar */}
                <footer className="py-4 bg-navy-950 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between px-8 text-[9px] font-mono text-slate-600 uppercase tracking-widest gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      <span>Encrypted Connection Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Region: Middle East (CENTCOM)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span>System Time: {new Date().toISOString()}</span>
                    <span className="text-navy-800">v2.1.0-PROD</span>
                  </div>
                </footer>
              </main>

              {/* Sidebar: Middle East Intelligence Stream (New) */}
              <div className="hidden lg:block">
                <IntelSidebar />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="signal-feed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-1"
          >
            <SignalFeedView onBack={() => setView("dashboard")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {user?.role === "free" && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-navy-950/80 backdrop-blur-lg border-t border-navy-800 md:hidden"
          >
            <button 
              onClick={scrollToUpgrade}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.2em] transition-all rounded shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-3 h-3" />
              Unlock Real-Time Alerts — $29
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
