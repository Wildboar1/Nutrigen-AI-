import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Smartphone, 
  Sparkles
} from 'lucide-react';

export function UserSettings() {
  const [notifications, setNotifications] = useState(true);
  const [aiAutoSync, setAiAutoSync] = useState(true);
  const [appleHealthSync, setAppleHealthSync] = useState(true);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-0.5">
          <Settings className="h-3.5 w-3.5" /> App Preferences & Integrations
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-purple-300/70 font-semibold">Manage notification triggers, privacy, and bio-wearable data sync</p>
      </motion.div>

      {/* Preferences Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C1BFFF]/20 space-y-6">
        <h2 className="text-lg font-extrabold text-white pb-3 border-b border-white/10">Integrations & Devices</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-[#CF6DFC]" />
              <div>
                <div className="font-extrabold text-white text-sm">Apple Health / Google Fit Sync</div>
                <div className="text-xs text-purple-300/60 font-semibold">Continuous background step & sleep telemetry</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={appleHealthSync}
              onChange={(e) => setAppleHealthSync(e.target.checked)}
              className="h-5 w-5 rounded text-[#CF6DFC] focus:ring-[#CF6DFC]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-[#CF6DFC]" />
              <div>
                <div className="font-extrabold text-white text-sm">Autonomous AI Meal Recommendations</div>
                <div className="text-xs text-purple-300/60 font-semibold">Allow AI Coach to suggest dinner based on logged lunches</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiAutoSync}
              onChange={(e) => setAiAutoSync(e.target.checked)}
              className="h-5 w-5 rounded text-[#CF6DFC] focus:ring-[#CF6DFC]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-[#CF6DFC]" />
              <div>
                <div className="font-extrabold text-white text-sm">Smart Push Notifications</div>
                <div className="text-xs text-purple-300/60 font-semibold">Hydration and meal timing alerts</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-5 rounded text-[#CF6DFC] focus:ring-[#CF6DFC]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
