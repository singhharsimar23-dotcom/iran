import React from "react";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Clock } from "lucide-react";
import { GeoEvent } from "../types";

export const EscalationFeed: React.FC = () => {
  const { events, isLoading } = useStore();

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center p-12 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
      <Activity className="w-4 h-4 animate-pulse mr-2" />
      Analyzing Intelligence...
    </div>
  );

  return (
    <section className="flex-1 overflow-y-auto bg-navy-950 p-4 space-y-2 custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Escalation Feed <span className="text-navy-800 ml-2">|</span> <span className="text-emerald-500 ml-2">Compressed</span>
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {events.map((event, idx) => (
          <EscalationCard key={event.id} event={event} index={idx} />
        ))}
      </AnimatePresence>
    </section>
  );
};

const EscalationCard: React.FC<{ event: GeoEvent; index: number }> = ({ event, index }) => {
  const { selectedEvent, setSelectedEvent } = useStore();
  const isSelected = selectedEvent?.id === event.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-emerald-500";
      case "Developing": return "text-amber-500";
      default: return "text-slate-500";
    }
  };

  return (
    <motion.div
      id={`event-${event.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-3 bg-navy-900/30 border border-navy-800/50 hover:border-emerald-500/30 transition-all cursor-pointer rounded-sm`}
      onClick={() => setSelectedEvent(event)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-slate-100 uppercase tracking-tight">
            {event.headline} — <span className={getStatusColor(event.status)}>{event.status.toUpperCase()}</span>
          </h3>
          <span className="text-[9px] font-mono text-slate-600">
            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Oil since event</span>
            <span className={`text-[11px] font-black tabular-nums ${event.oil1hReaction >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {event.oil1hReaction > 0 ? "+" : ""}{event.oil1hReaction.toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Historical Average</span>
            <span className="text-[10px] font-black text-slate-400 tabular-nums">
              Last {event.historicalStats.sampleSize} similar events → <span className="text-emerald-500">+{event.historicalStats.oil4hAvg}% avg in 4h</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
