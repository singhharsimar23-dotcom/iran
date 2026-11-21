import React from "react";
import { motion } from "motion/react";
import { History, TrendingUp, Activity } from "lucide-react";

export const ProofLayer: React.FC = () => {
  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-3 h-3 text-slate-500" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Reaction Case Study</h3>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-navy-900/30 border border-navy-800 p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-600 uppercase">Jan 12, 2026</span>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Naval Strike - Red Sea Corridor</h4>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Oil Reaction</span>
              <div className="flex items-center gap-1 text-emerald-500 font-black text-sm tabular-nums">
                <TrendingUp className="w-3 h-3" />
                +2.3% <span className="text-[9px] opacity-60 ml-1">in 3h</span>
              </div>
            </div>

            <div className="w-px h-8 bg-navy-800" />

            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">VIX Expansion</span>
              <div className="flex items-center gap-1 text-emerald-500 font-black text-sm tabular-nums">
                <Activity className="w-3 h-3" />
                +1.8 <span className="text-[9px] opacity-60 ml-1">points</span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] font-black text-emerald-500 uppercase tracking-widest">
            Logic Verified
          </div>
        </motion.div>
      </div>
    </section>
  );
};
