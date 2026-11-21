import React from "react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";
import { Activity, Zap } from "lucide-react";

export const EscalationTimeline: React.FC = () => {
  const { timeline } = useStore();

  if (!timeline.length) return null;

  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 p-6 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-3 h-3 text-slate-500" />
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Escalation Timeline</h3>
      </div>

      <div className="flex items-start gap-0 min-w-max px-4">
        {timeline.map((node, idx) => (
          <div key={idx} className="flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center gap-2 relative"
            >
              <div className={`w-3 h-3 rounded-full border-2 ${node.type === 'event' ? 'bg-emerald-500 border-emerald-400' : 'bg-navy-900 border-slate-500'}`} />
              <div className="flex flex-col items-center text-center">
                <span className="text-[9px] font-mono text-slate-600">{node.time}</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter whitespace-nowrap">{node.label}</span>
                {node.value && (
                  <span className="text-[10px] font-black text-emerald-500 tabular-nums">{node.value}</span>
                )}
              </div>
            </motion.div>
            
            {idx < timeline.length - 1 && (
              <div className="w-24 h-px bg-navy-800 mt-1.5 mx-2" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
