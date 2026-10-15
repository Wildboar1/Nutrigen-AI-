import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Sparkles,
  Save
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UserProfileProps {
  userType?: 'individual' | 'professional';
}

export function UserProfile({ userType = 'individual' }: UserProfileProps) {
  const { user, updateUserData } = useUser();
  const [isSaved, setIsSaved] = useState(false);

  const [calorieGoal, setCalorieGoal] = useState(user?.userData?.calorieGoal || 2100);
  const [proteinGoal, setProteinGoal] = useState(user?.userData?.proteinGoal || 130);
  const [carbsGoal, setCarbsGoal] = useState(user?.userData?.carbsGoal || 220);
  const [fatGoal, setFatGoal] = useState(user?.userData?.fatGoal || 70);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserData({
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-5xl mx-auto">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-[#CF6DFC]/30">
            {user?.displayName?.[0] || 'A'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-0.5">
              <Sparkles className="h-3.5 w-3.5" /> Bio-Profile & Macro Target Calibrator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {user?.displayName || 'Health Optimizer'} Profile
            </h1>
            <p className="text-xs text-purple-300/70 font-semibold">{user?.email || 'user@nutrigen.ai'}</p>
          </div>
        </div>
      </motion.div>

      {/* Target Sliders Form */}
      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#C1BFFF]/20 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Daily Metabolic Targets</h2>
            <p className="text-xs text-purple-300/60 font-semibold">Adjust target calories and macro ratios</p>
          </div>
          {isSaved && (
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
        </div>

        <div className="space-y-5">
          {/* Calorie Goal */}
          <div>
            <div className="flex justify-between text-xs font-extrabold mb-1">
              <span className="text-white">Daily Calorie Target</span>
              <span className="text-[#CF6DFC]">{calorieGoal} kcal</span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              className="w-full accent-[#CF6DFC]"
            />
          </div>

          {/* Protein Goal */}
          <div>
            <div className="flex justify-between text-xs font-extrabold mb-1">
              <span className="text-white">Protein Target</span>
              <span className="text-[#CF6DFC]">{proteinGoal}g</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="5"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(Number(e.target.value))}
              className="w-full accent-[#CF6DFC]"
            />
          </div>

          {/* Carbs Goal */}
          <div>
            <div className="flex justify-between text-xs font-extrabold mb-1">
              <span className="text-white">Carbohydrate Target</span>
              <span className="text-blue-400">{carbsGoal}g</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="5"
              value={carbsGoal}
              onChange={(e) => setCarbsGoal(Number(e.target.value))}
              className="w-full accent-blue-400"
            />
          </div>

          {/* Fat Goal */}
          <div>
            <div className="flex justify-between text-xs font-extrabold mb-1">
              <span className="text-white">Healthy Fats Target</span>
              <span className="text-amber-400">{fatGoal}g</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={fatGoal}
              onChange={(e) => setFatGoal(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-lavender w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg mt-6"
        >
          <Save className="h-4 w-4" />
          <span>Save Metabolic Blueprint</span>
        </button>
      </form>
    </div>
  );
}
