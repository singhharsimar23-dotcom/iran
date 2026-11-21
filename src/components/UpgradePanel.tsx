import React from "react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";
import { Zap, Bell, Shield, TrendingUp, Send, Mail, FileDown } from "lucide-react";

export const UpgradePanel: React.FC = () => {
  const { user } = useStore();

  if (user?.role === "pro") return null;

  const features = [
    { icon: Send, label: "Instant Telegram Alerts", desc: "Oil moves >1% within 60m of confirmed strike" },
    { icon: Bell, label: "Threshold Notifications", desc: "VIX expands >2 points or Index crosses 65" },
    { icon: Shield, label: "High-Impact Confirmation", desc: "Naval activity classified HIGH impact" },
    { icon: FileDown, label: "CSV Export", desc: "Full historical reaction panel for backtesting" },
  ];

  return (
    <section id="upgrade" className="w-full bg-navy-900 border-t border-navy-800 p-8 flex flex-col items-center text-center space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4 max-w-2xl"
      >
        <div className="flex items-center justify-center gap-2 text-emerald-500 uppercase tracking-[0.3em] text-[10px] font-black">
          <Zap className="w-4 h-4" />
          Professional Grade Triggers
        </div>
        
        <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest leading-tight">
          Upgrade to Pro Access
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
          <div className="flex items-start gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            Oil moves &gt;1% within 60m of strike
          </div>
          <div className="flex items-start gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            VIX expands &gt;2 points
          </div>
          <div className="flex items-start gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            Naval activity classified HIGH impact
          </div>
          <div className="flex items-start gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            Volatility Index crosses 65
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feature, idx) => (
          <div key={idx} className="p-6 bg-navy-950 border border-navy-800 rounded-sm space-y-3 text-left hover:border-navy-700 transition-all group">
            <feature.icon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{feature.label}</h4>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider leading-tight">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex flex-col items-center space-y-4">
        <button className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black uppercase tracking-[0.2em] transition-all rounded shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95">
          Upgrade Now — $29/Month
        </button>
        <div className="flex items-center gap-6 text-[9px] text-slate-600 uppercase font-bold tracking-widest">
          <span>Cancel Anytime</span>
          <span className="w-1 h-1 bg-navy-800 rounded-full" />
          <span>Secure Stripe Checkout</span>
          <span className="w-1 h-1 bg-navy-800 rounded-full" />
          <span>Instant Activation</span>
        </div>
      </div>
    </section>
  );
};
