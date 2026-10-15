import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Pill, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Zap,
  RotateCcw,
  Bell
} from 'lucide-react';
import { CircularProgress } from './CircularProgress';

export function WaterSupplementTracking() {
  const [activeTab, setActiveTab] = useState<'water' | 'supplements'>('water');
  const [waterIntake, setWaterIntake] = useState(1850); // ml
  const waterGoal = 2500; // ml

  const [supplements, setSupplements] = useState([
    { id: 1, name: 'Magnesium Glycinate', dose: '400mg', time: '8:30 PM', taken: true, category: 'Sleep & Muscle' },
    { id: 2, name: 'Omega-3 Fish Oil (EPA/DHA)', dose: '2000mg', time: '12:30 PM', taken: true, category: 'Anti-Inflammatory' },
    { id: 3, name: 'Vitamin D3 + K2', dose: '5000 IU', time: '8:00 AM', taken: true, category: 'Immune & Bone' },
    { id: 4, name: 'Creatine Monohydrate', dose: '5g', time: '7:30 AM', taken: false, category: 'Performance' },
    { id: 5, name: 'L-Theanine', dose: '200mg', time: '3:00 PM', taken: false, category: 'Focus & Stress' }
  ]);

  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => Math.min(4000, prev + amount));
  };

  const toggleSupplement = (id: number) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Bio-Hydration & Micronutrient Stack
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Hydration & Supplement Tracking</h1>
            <p className="text-purple-300/70 text-xs sm:text-sm font-semibold">Monitor cellular hydration and daily micronutrient stack compliance</p>
          </div>

          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('water')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTab === 'water'
                  ? 'bg-[#CF6DFC] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <Droplets className="h-4 w-4" />
              <span>Hydration Log</span>
            </button>
            <button
              onClick={() => setActiveTab('supplements')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                activeTab === 'supplements'
                  ? 'bg-[#CF6DFC] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <Pill className="h-4 w-4" />
              <span>Supplement Stack</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Water Hydration View */}
      {activeTab === 'water' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Circular Progress Gauge */}
          <div className="glass-panel p-8 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-purple-300/70 mb-4">
              Daily Fluid Intake
            </h3>
            <CircularProgress
              value={waterIntake}
              max={waterGoal}
              size={180}
              strokeWidth={14}
              gradientId="waterIntakeGradient"
              gradientColors={['#38bdf8', '#0284c7']}
              label="Hydration Level"
              unit=" ml"
              subtext={`Target: ${waterGoal} ml`}
              icon={Droplets}
            />

            <div className="mt-6 flex items-center gap-2 text-xs font-extrabold text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-2xl border border-cyan-500/30">
              <Zap className="h-4 w-4" />
              <span>Optimal Cellular Hydration Active</span>
            </div>
          </div>

          {/* Quick Increment Actions */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-[#C1BFFF]/20 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-lg font-extrabold text-white">Quick Add Fluid Log</h3>
                <button
                  onClick={() => setWaterIntake(0)}
                  className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset Hydration Log"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: '+250 ml', amount: 250, desc: 'Small Glass' },
                  { label: '+500 ml', amount: 500, desc: 'Standard Bottle' },
                  { label: '+750 ml', amount: 750, desc: 'Sports Shaker' },
                  { label: '+1000 ml', amount: 1000, desc: 'Large Jug' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddWater(item.amount)}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-[#CF6DFC]/20 border border-white/10 hover:border-[#CF6DFC]/40 transition-all text-center group flex flex-col items-center justify-center space-y-1"
                  >
                    <Droplets className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-white text-base block">{item.label}</span>
                    <span className="text-[10px] text-purple-300/60 font-semibold block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-purple-200 leading-relaxed font-medium">
              <span className="font-extrabold text-white block mb-1">💡 Hydration Intelligence:</span>
              Drinking 500ml water upon waking flushes overnight metabolic byproducts and elevates morning resting metabolic rate by 24% for 60 minutes.
            </div>
          </div>
        </div>
      )}

      {/* Supplements View */}
      {activeTab === 'supplements' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C1BFFF]/20 space-y-6 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-extrabold text-white">Daily Micronutrient & Nootropic Stack</h2>
              <p className="text-xs text-purple-300/60 font-semibold">Track daily supplement dosages and timing compliance</p>
            </div>
            <button className="btn-lavender px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1 shadow-md">
              <Plus className="h-4 w-4" />
              <span>Add Supplement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplements.map((supp) => (
              <div
                key={supp.id}
                onClick={() => toggleSupplement(supp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  supp.taken
                    ? 'bg-[#CF6DFC]/15 border-[#CF6DFC]/40'
                    : 'bg-white/5 border-white/10 hover:border-[#CF6DFC]/30'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${
                    supp.taken ? 'bg-[#CF6DFC] text-white' : 'border border-purple-400/40 text-transparent'
                  }`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className={`font-extrabold text-sm ${supp.taken ? 'text-white line-through opacity-80' : 'text-white'}`}>
                      {supp.name} <span className="text-purple-300/60 font-normal">({supp.dose})</span>
                    </h3>
                    <div className="text-[10px] font-semibold text-purple-300/60 mt-0.5">
                      {supp.category} • Scheduled: {supp.time}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  supp.taken 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {supp.taken ? 'Taken' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}