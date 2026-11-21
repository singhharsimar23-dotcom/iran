import React from "react";
import { useStore } from "../store/useStore";

interface ReactionBoardProps {
  onNavigateToSignalFeed?: () => void;
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 30},${12 - ((d - min) / range) * 12}`).join(" ");
  
  return (
    <svg width="30" height="12" className="overflow-visible fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points} className={color} />
    </svg>
  );
};

export const ReactionBoard: React.FC<ReactionBoardProps> = ({ onNavigateToSignalFeed }) => {
  const { marketData } = useStore();

  if (!marketData) return null;

  const tiles = [
    { label: "Oil", data: marketData.oil },
    { label: "VIX", data: marketData.vix },
    { label: "Gold", data: marketData.gold },
    { label: "Defense ETF", data: marketData.defense },
  ];

  return (
    <section className="bg-navy-950 border-b border-navy-800">
      <div className="px-4 py-2 border-b border-navy-900 flex items-center justify-between">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          IRAN ESCALATION → LIVE MARKET REACTION
        </h2>
        <button 
          onClick={onNavigateToSignalFeed}
          className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors flex items-center gap-1.5"
        >
          View Signal Feed →
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-800">
        {tiles.map((tile, idx) => (
          <div key={idx} className="bg-navy-950 p-4 flex flex-col justify-between min-h-[90px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tile.label}</span>
                <Sparkline data={tile.data.history} color={tile.data.change1h >= 0 ? 'stroke-emerald-500' : 'stroke-red-500'} />
              </div>
              {tile.data.isAboveNormal && (
                <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[8px] font-black text-red-500 uppercase tracking-tighter">
                  Above Baseline
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-100 tabular-nums">
                  {tile.data.change > 0 ? "+" : ""}{tile.data.change.toFixed(2)}%
                </span>
                <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Current</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-sm font-black tabular-nums ${tile.data.change1h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tile.data.change1h > 0 ? "+" : ""}{tile.data.change1h.toFixed(2)}%
                </span>
                <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">1h</span>
              </div>
            </div>

            {tile.label === "Oil" && (
              <div className="mt-3 pt-3 border-t border-navy-800/50">
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 mb-1">
                  <span>Baseline 30d: 0.63%</span>
                  <span className="text-emerald-500">Current: {tile.data.change1h.toFixed(2)}%</span>
                </div>
                <div className="h-1 w-full bg-navy-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-600" style={{ width: '30%' }} />
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (tile.data.change1h / 0.63) * 30)}%` }} />
                </div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-right">
                  Volatility Multiplier: {(tile.data.change1h / 0.63).toFixed(1)}x
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
