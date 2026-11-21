import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Zap, AlertCircle, Globe, Filter, ArrowLeft } from "lucide-react";
import { GeoEvent } from "../types";

interface SignalFeedViewProps {
  onBack: () => void;
}

export const SignalFeedView: React.FC<SignalFeedViewProps> = ({ onBack }) => {
  const { events } = useStore();
  const [isRawDrawerOpen, setIsRawDrawerOpen] = useState(false);

  // A) Signal Feed (Primary)
  // Only events that meet criteria:
  // Direct Iran involvement, Escalation category, Market-sensitive type, Credibility threshold
  const signalEvents = events.filter(e => e.isSignal);

  // B) Raw News Drawer (Secondary, Optional)
  // Everything else
  const rawEvents = events.filter(e => !e.isSignal);

  return (
    <div className="flex-1 flex flex-col bg-navy-950 min-h-screen">
      {/* Header */}
      <header className="h-14 border-b border-navy-800 bg-navy-900/50 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-navy-800 rounded-full transition-colors text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-100 flex items-center gap-2">
              <Zap className="w-3 h-3 text-emerald-500" />
              Signal Feed
            </h1>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Filtered Intelligence Stream
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
          </div>
          <button className="p-2 hover:bg-navy-800 rounded transition-colors text-slate-500">
            <Filter className="w-3 h-3" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
        {/* Signal Feed Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-navy-900 pb-2">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Primary Signals
            </h2>
            <span className="text-[9px] font-mono text-slate-600">{signalEvents.length} Events Detected</span>
          </div>

          <div className="space-y-4">
            {signalEvents.length > 0 ? (
              signalEvents.map((event) => (
                <SignalCard key={event.id} event={event} />
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-navy-800 rounded-lg">
                <p className="text-xs text-slate-600 font-mono uppercase tracking-widest">No critical signals in current window</p>
              </div>
            )}
          </div>
        </section>

        {/* Raw News Drawer */}
        <section className="pt-8 border-t border-navy-900">
          <button 
            onClick={() => setIsRawDrawerOpen(!isRawDrawerOpen)}
            className="w-full flex items-center justify-between p-4 bg-navy-900/30 border border-navy-800 rounded hover:bg-navy-900/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                View Full Middle East Stream
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-slate-600">{rawEvents.length} items</span>
              {isRawDrawerOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
            </div>
          </button>

          <AnimatePresence>
            {isRawDrawerOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-4 space-y-px bg-navy-900/10 rounded-b border-x border-b border-navy-900">
                  {rawEvents.map((event) => (
                    <div key={event.id} className="p-3 flex items-center justify-between hover:bg-navy-900/50 transition-colors border-b border-navy-900/50 last:border-0">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-mono text-slate-600 tabular-nums">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[400px]">
                          {event.headline}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter border border-navy-800 px-1 rounded">
                          {event.source}
                        </span>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                          {event.region}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

const SignalCard: React.FC<{ event: GeoEvent }> = ({ event }) => {
  return (
    <div className="bg-navy-900/40 border border-navy-800 rounded-lg overflow-hidden hover:border-emerald-500/30 transition-all group">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {event.category}
              </span>
              <span className="text-slate-800">•</span>
              <span className="text-[9px] font-mono text-slate-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">
              {event.headline}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${
              event.status === 'Confirmed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
              event.status === 'Developing' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
              'bg-slate-500/10 border-slate-500/30 text-slate-500'
            }`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-3 border-y border-navy-800/50">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Oil Reaction</span>
            <span className="text-xs font-black text-slate-200 tabular-nums">
              {event.oil1hReaction > 0 ? "+" : ""}{event.oil1hReaction.toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Credibility</span>
            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
              {event.credibility}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Region</span>
            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
              {event.region}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Source:</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{event.source}</span>
          </div>
          <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">
            View Intelligence Brief →
          </button>
        </div>
      </div>
    </div>
  );
};
