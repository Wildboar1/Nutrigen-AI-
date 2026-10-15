import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Settings, 
  Camera, 
  Droplets, 
  X,
  ChevronRight,
  Cpu
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: any) => void;
  onOpenLogFood: () => void;
  onOpenAICoach: (prompt?: string) => void;
  userType?: 'individual' | 'professional' | 'admin';
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectView,
  onOpenLogFood,
  onOpenAICoach,
  userType,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions: Array<{
    id: string;
    label: string;
    category: string;
    icon: any;
    action: () => void;
  }> = [
    {
      id: 'ai-coach',
      label: 'Ask AI Coach a custom nutrition query',
      category: 'AI Assistant',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenAICoach(query || 'What should I eat to hit my protein target today?');
      }
    },
    {
      id: 'log-food',
      label: 'Log Food / Scan Meal Plate with Camera',
      category: 'Quick Log',
      icon: Camera,
      action: () => {
        onClose();
        onOpenLogFood();
      }
    },
    {
      id: 'log-water',
      label: 'Log Water Intake (+500ml)',
      category: 'Quick Log',
      icon: Droplets,
      action: () => {
        onClose();
        // Trigger quick water log logic
      }
    },
    {
      id: 'view-dashboard',
      label: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        onClose();
        onSelectView('dashboard');
      }
    },
    {
      id: 'view-meals',
      label: 'Go to AI Meal Planning & Recipe Browser',
      category: 'Navigation',
      icon: UtensilsCrossed,
      action: () => {
        onClose();
        onSelectView('meals');
      }
    },
    ...(userType === 'admin' ? [{
      id: 'view-admin',
      label: 'Open Admin Command Console (Telemetry, Users, Flags)',
      category: 'System & Admin',
      icon: Cpu,
      action: () => {
        onClose();
        onSelectView('admin');
      }
    }] : []),
    {
      id: 'view-settings',
      label: 'Go to Profile & Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        onClose();
        onSelectView('settings');
      }
    }
  ];

  const filteredActions = actions.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl bg-[#130E29] border border-[#CF6DFC]/30 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Input Bar */}
          <div className="p-4 border-b border-[#C1BFFF]/15 flex items-center space-x-3 bg-[#191336]">
            <Search className="h-5 w-5 text-[#CF6DFC] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, ask AI, or search navigation (Cmd + K)..."
              className="w-full bg-transparent text-white placeholder-purple-300/40 text-sm font-semibold focus:outline-none"
            />
            <button onClick={onClose} className="p-1 rounded-lg text-purple-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-purple-300/60 font-semibold">
                No matching commands found. Press Enter to ask AI Coach.
              </div>
            ) : (
              filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-gradient-to-r hover:from-[#CF6DFC]/20 hover:to-purple-900/30 transition-all group text-left border border-transparent hover:border-[#CF6DFC]/30"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-xl bg-purple-950/60 text-[#CF6DFC] group-hover:bg-[#CF6DFC] group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-[#FDFBD4] truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] font-medium text-purple-300/60">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-purple-400/40 group-hover:text-[#CF6DFC] group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-3 bg-[#0F0B21] border-t border-[#C1BFFF]/10 flex items-center justify-between text-[11px] text-purple-300/60 font-semibold">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">ESC</kbd> Close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
