import React from "react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";
import { Activity, Zap, Info } from "lucide-react";

export const VolatilityHero: React.FC = () => {
  const { volatilityIndex, marketData, events } = useStore();

  if (!volatilityIndex || !marketData) return null;

  const getLabelColor = (label: string, value: number) => {
    if (value > 65) return "text-red-500 border-red-500/30 bg-red-500/10";
    if (value > 40) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-slate-500 border-slate-500/30 bg-slate-500/10";
  };

  const getStatusText = (value: number) => {
    if (value > 40) return "🔥 VOLATILITY ACTIVE";
    return "Below escalation threshold — monitoring";
  };

  const shareStatus = () => {
    const oilMove = marketData.oil.change1h || 0;
    const text = `🚨 Iran Strike Confirmed\nOil ${oilMove > 0 ? '+' : ''}${oilMove}% in 38 mins\nVolatility Index: ${volatilityIndex.value} (${volatilityIndex.label})\nLive tracker: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Alert formatted for X copied to clipboard.");
  };

  // Regime Logic
  const oilChange = marketData.oil.change1h || 0;
  const hasConfirmedEscalation = events.some(e => e.status === 'Confirmed');
  const baseline = 0.63;

  let regime = "Normal";
  let regimeColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";

  if (oilChange > baseline * 1.5 && hasConfirmedEscalation) {
    regime = "Escalation-Driven";
    regimeColor = "text-red-500 bg-red-500/10 border-red-500/30";
  } else if (oilChange > baseline) {
    regime = "Elevated";
    regimeColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
  }

  return (
    <section className="w-full py-8 px-4 border-b border-navy-800 bg-navy-950/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-10 blur-[100px] pointer-events-none ${volatilityIndex.value > 40 ? 'bg-red-500' : 'bg-emerald-500'}`} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 space-y-6 w-full max-w-2xl"
      >
        {/* Top Badge: Market Regime */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${regimeColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${regime === 'Escalation-Driven' ? 'bg-red-500 animate-pulse' : regime === 'Elevated' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Market Regime: {regime}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black">
          <Activity className="w-3 h-3 animate-pulse text-emerald-500" />
          Escalation Reaction Feed
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-navy-800" />
            <div className={`px-3 py-1 border rounded text-[9px] font-black tracking-widest uppercase ${getLabelColor(volatilityIndex.label, volatilityIndex.value)}`}>
              {getStatusText(volatilityIndex.value)}
            </div>
            <div className="h-px w-12 bg-navy-800" />
          </div>
        </div>

        <div className="flex flex-col items-center relative group cursor-help">
          <div className="flex items-start gap-2">
            <span className={`text-9xl font-black tabular-nums tracking-tighter leading-none ${volatilityIndex.value > 65 ? 'text-red-500' : 'text-slate-100'}`}>
              {volatilityIndex.value}
            </span>
            <Info className="w-4 h-4 text-slate-600 opacity-50 mt-4" />
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Current Index Value</span>
          
          {/* Tooltip */}
          <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-navy-800 p-3 rounded shadow-xl w-64 z-50 pointer-events-none">
            <p className="text-[10px] text-slate-400 leading-relaxed text-left">
              Composite index weighting oil velocity, VIX spikes, and confirmed escalation events. >65 indicates critical market dislocation.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={shareStatus}
            className="flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 border border-navy-800 rounded text-[10px] font-black text-slate-100 uppercase tracking-widest transition-all group shadow-xl"
          >
            <Zap className="w-3 h-3 text-emerald-500 group-hover:scale-125 transition-transform" />
            Generate Alert for X
          </button>
          
          {/* Historical Anchor */}
          <div className="text-[9px] text-slate-600 font-mono mt-2">
            Largest 4h oil reaction this year after escalation: <span className="text-slate-400">+3.8%</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
