import React from "react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";
import { Clock, MapPin, ChevronRight } from "lucide-react";

export const IntelSidebar: React.FC = () => {
  const { events, triggers, setSelectedEvent } = useStore();

  return (
    <aside className="w-80 border-l border-navy-800 bg-navy-950 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-navy-800 bg-navy-900/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Recent Triggers
          </h2>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-4">
          {triggers.map((trigger, idx) => (
            <motion.div 
              key={trigger.id} 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 group"
            >
              <span className="text-[9px] font-mono text-slate-600 pt-0.5">
                {new Date(trigger.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] font-black uppercase tracking-tight leading-none ${trigger.type === 'market' ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {trigger.label}
                </span>
                {trigger.type === 'market' && (
                  <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Market Threshold Breach</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-navy-800">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Middle East Intel Stream
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {events.map((event, idx) => (
          <motion.button
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedEvent(event)}
            className="w-full text-left p-4 border-b border-navy-900 hover:bg-navy-900 transition-colors group relative"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-[8px] font-mono text-slate-600 uppercase">
                <Clock className="w-2.5 h-2.5" />
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                <MapPin className="w-2.5 h-2.5" />
                {event.region}
              </div>
            </div>
            
            <h4 className="text-[11px] font-bold text-slate-300 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-tight">
              {event.headline}
            </h4>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[8px] px-1.5 py-0.5 bg-navy-800 rounded text-slate-500 font-black uppercase tracking-tighter">
                {event.category}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-emerald-500 transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>
    </aside>
  );
};
