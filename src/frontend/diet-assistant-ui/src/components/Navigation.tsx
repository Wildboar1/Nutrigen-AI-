import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Stethoscope,
  ChevronRight,
  Settings,
  Sparkles,
  Flame,
  Activity,
  Zap,
  Target,
  Droplets,
  Users,
  ShieldCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'meals' | 'professional' | 'profile' | 'settings' | 'admin') => void;
  userType: 'individual' | 'professional' | 'admin';
  isMobile?: boolean;
}

export function Navigation({ currentView, onViewChange, userType, isMobile = false }: NavigationProps) {

  const individualNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & daily health score' },
    { id: 'meals', label: 'AI Meal Planning', icon: UtensilsCrossed, description: 'Smart suggestions & recipes' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Account & preferences' }
  ];

  const professionalNavItems = [
    { id: 'professional', label: 'Clinical Hub', icon: Stethoscope, description: 'Patient roster & compliance' },
    { id: 'settings', label: 'Practitioner Settings', icon: Settings, description: 'Clinic profile & credentials' }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Console', icon: Cpu, description: 'Platform switchboard & users' },
    { id: 'dashboard', label: 'Individual View', icon: LayoutDashboard, description: 'Preview patient dashboard' },
    { id: 'professional', label: 'Clinical View', icon: Stethoscope, description: 'Preview practitioner hub' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Account settings' }
  ];

  const navItems = userType === 'admin' ? adminNavItems : userType === 'individual' ? individualNavItems : professionalNavItems;

  return (
    <nav className={`w-72 glass-panel border-r border-[#C1BFFF]/15 shadow-2xl ${isMobile ? 'h-full bg-[#0F0B21]' : 'h-[calc(100vh-6.5rem)] rounded-3xl my-2 ml-4 mr-2'
      }`}>
      <div className="p-3.5 sm:p-4 flex flex-col h-full justify-between overflow-y-auto">
        <div>
          {isMobile && (
            <div className="mb-4 pb-3 border-b border-[#C1BFFF]/15">
              <div className="flex items-center">
                <img src="/newlogofull.png" alt="NutriGen AI" className="h-[80px] w-auto object-contain" />
              </div>
            </div>
          )}

          {/* Role-Specific Top Banner */}
          {userType === 'individual' ? (
            <div className="mb-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-900/30 to-amber-500/15 border border-amber-500/30 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-200 block">7 Day Streak!</span>
                  <span className="text-[10px] text-amber-300/70 font-semibold">Metabolic consistency</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Active
              </span>
            </div>
          ) : (
            <div className="mb-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-purple-900/30 to-emerald-500/15 border border-emerald-500/30 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-200 block">Accredited Hub</span>
                  <span className="text-[10px] text-emerald-300/70 font-semibold">Clinical Practitioner</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                Verified
              </span>
            </div>
          )}

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/50 px-2 mb-2">
            {userType === 'individual' ? 'Personal Navigation' : 'Clinical Navigation'}
          </div>

          <div className="space-y-1 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 group relative ${isActive
                      ? 'text-white font-extrabold shadow-md'
                      : 'text-purple-300/70 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {/* Active Framer Motion Sliding Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-[#CF6DFC]/25 via-purple-900/40 to-[#CF6DFC]/15 rounded-2xl border border-[#CF6DFC]/40 shadow-lg shadow-[#CF6DFC]/10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center space-x-2.5 min-w-0 z-10">
                    <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] text-white shadow-md shadow-[#CF6DFC]/30'
                        : 'bg-white/5 text-purple-300 group-hover:bg-white/10 group-hover:text-white'
                      }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className={`text-xs sm:text-sm truncate ${isActive ? 'font-extrabold text-white' : 'font-semibold text-purple-200/80'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-purple-300/50 truncate font-medium">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 z-10 transition-transform ${isActive ? 'text-[#CF6DFC] translate-x-0.5' : 'text-purple-500/40 group-hover:text-purple-300'
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Role-Tailored Bottom Widget */}
        {userType === 'individual' ? (
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-[#181132]/90 via-[#120B27]/80 to-[#1C123B]/90 border border-[#CF6DFC]/25 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#CF6DFC]/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-lg bg-[#CF6DFC]/20 text-[#CF6DFC]">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-extrabold text-[#C1BFFF] uppercase tracking-wider">
                  Daily Targets
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#CF6DFC]/20 text-[#CF6DFC] border border-[#CF6DFC]/30">
                Live
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-purple-200/90 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Zap className="h-3 w-3 text-amber-400" /> Calories
                  </span>
                  <span className="text-white font-bold">1,850 <span className="text-purple-400 font-normal text-[9px]">/ 2,100</span></span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-full rounded-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-purple-200/90 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Target className="h-3 w-3 text-purple-400" /> Protein
                  </span>
                  <span className="text-white font-bold">112g <span className="text-purple-400 font-normal text-[9px]">/ 140g</span></span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-[#CF6DFC] to-[#a84df0] h-full rounded-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-purple-200/90 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Droplets className="h-3 w-3 text-cyan-400" /> Water
                  </span>
                  <span className="text-white font-bold">1.8L <span className="text-purple-400 font-normal text-[9px]">/ 2.5L</span></span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full w-[72%]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewChange('meals')}
              className="w-full mt-2.5 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-[#CF6DFC]/20 border border-[#CF6DFC]/30 text-purple-200 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Sparkles className="h-3 w-3 text-[#CF6DFC]" />
              <span>Smart Meal Plan</span>
            </button>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-[#101b2b]/90 via-[#0d1527]/80 to-[#141e33]/90 border border-emerald-500/25 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider">
                  Clinical Overview
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                <span className="text-purple-200/80 font-semibold text-[11px]">Active Patients</span>
                <span className="text-white font-extrabold">42</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                <span className="text-purple-200/80 font-semibold text-[11px]">Avg Compliance</span>
                <span className="text-emerald-400 font-extrabold">91.4%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                <span className="text-purple-200/80 font-semibold text-[11px]">Pending Reviews</span>
                <span className="text-amber-400 font-extrabold">3 alerts</span>
              </div>
            </div>

            <button
              onClick={() => onViewChange('professional')}
              className="w-full mt-2.5 py-1.5 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Review Patient Charts</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}