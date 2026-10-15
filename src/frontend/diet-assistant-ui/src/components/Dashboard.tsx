import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Camera, 
  Plus,
  ChevronRight,
  Droplets,
  Moon,
  Activity,
  Sparkles,
  Bot,
  Flame,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Utensils,
  AlertTriangle,
  RefreshCw,
  Stethoscope,
  Crown
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useMealLogs } from '../contexts/MealLogContext';
import { CircularProgress } from './CircularProgress';
import { ConnectPractitionerModal } from './ConnectPractitionerModal';
import { UpgradeProModal } from './UpgradeProModal';

interface DashboardProps {
  onLogFood?: () => void;
  onOpenAICoach?: (prompt?: string) => void;
  onNavigateMealPlan?: () => void;
}

export function Dashboard({ onLogFood, onOpenAICoach, onNavigateMealPlan }: DashboardProps) {
  const { user, dietPlan, generateDietPlan } = useUser();
  const { mealLogs, totalCaloriesToday } = useMealLogs();
  const [quickWater, setQuickWater] = useState(2.1);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPro = user?.subscriptionTier === 'pro';
  const isLinked = user?.accountMode === 'practitioner_linked' && Boolean(user?.practitionerInfo);
  const practitioner = user?.practitionerInfo;
  const customTargets = practitioner?.customTargets;

  const handleRegeneratePlan = async () => {
    if (!user?.userData || isRegenerating) return;
    setIsRegenerating(true);
    await generateDietPlan(user.userData).catch(console.warn);
    setIsRegenerating(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Health Optimizer';
  const lastMeal = mealLogs[0];

  // Calculated macros from logs
  const totalProteinLogged = mealLogs.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const totalCarbsLogged = mealLogs.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const totalFatLogged = mealLogs.reduce((sum, m) => sum + (Number(m.fat) || 0), 0);

  // Targets automatically respect custom practitioner prescription if set
  const targetCalories = customTargets?.calorieGoal || user?.userData?.calorieGoal || 2100;
  const targetProtein = customTargets?.proteinGoal || user?.userData?.proteinGoal || 130;
  const targetCarbs = customTargets?.carbsGoal || user?.userData?.carbsGoal || 220;
  const targetFat = customTargets?.fatGoal || user?.userData?.fatGoal || 70;

  // Overall Nutrition Score Calculation
  const calorieScore = Math.min(100, Math.round((totalCaloriesToday / targetCalories) * 100));
  const proteinScore = Math.min(100, Math.round((totalProteinLogged / targetProtein) * 100));
  const overallNutritionScore = Math.min(100, Math.max(65, Math.round((calorieScore * 0.4) + (proteinScore * 0.4) + 15)));

  const todaysGuidance = [
    {
      priority: 'high',
      title: mealLogs.length > 0 ? 'Postprandial Response Analyzed' : 'Start Daily Tracking',
      description: mealLogs.length > 0
        ? `Latest log: ${lastMeal?.name} (${lastMeal?.calories} kcal, ${lastMeal?.protein}g P). Keep logging to refine AI glucose predictions.`
        : 'Log your first meal to activate real-time metabolic alignment and macro predictions.',
      action: mealLogs.length > 0 ? 'Log Next Meal' : 'Log First Meal',
      actionFn: onLogFood,
      icon: Zap,
      gradient: 'from-[#CF6DFC]/20 to-purple-900/30',
      border: 'border-[#CF6DFC]/40'
    },
    {
      priority: 'medium',
      title: 'Magnesium & Sleep Optimization',
      description: 'Your estimated intake is 23% below target. Adding dark leafy greens or pumpkin seeds to dinner improves deep sleep metrics.',
      action: 'Ask AI Coach',
      actionFn: () => onOpenAICoach && onOpenAICoach("How can I optimize magnesium in my dinner?"),
      icon: Moon,
      gradient: 'from-blue-500/20 to-purple-900/30',
      border: 'border-blue-400/40'
    },
    {
      priority: 'low',
      title: 'Circadian Peak Window',
      description: 'Optimal glucose insulin sensitivity window active until 2:30 PM. Ideal timing for complex carbs.',
      action: 'View Timing',
      actionFn: () => onNavigateMealPlan && onNavigateMealPlan(),
      icon: Clock,
      gradient: 'from-[#FDFBD4]/15 to-amber-900/20',
      border: 'border-amber-400/40'
    }
  ];

  const upcomingMeals = [
    {
      time: '12:30 PM',
      meal: 'Lunch',
      title: 'Mediterranean Salmon & Quinoa Bowl',
      calories: '520 kcal',
      protein: '42g P',
      match: '96% AI Match',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&h=160&fit=crop'
    },
    {
      time: '3:30 PM',
      meal: 'Snack',
      title: 'Almond & Dark Chocolate Crunch',
      calories: '180 kcal',
      protein: '12g P',
      match: '91% AI Match',
      image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=160&h=160&fit=crop'
    },
    {
      time: '7:00 PM',
      meal: 'Dinner',
      title: 'Herb-Crusted Wild Salmon & Greens',
      calories: '640 kcal',
      protein: '48g P',
      match: '94% AI Match',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&h=160&fit=crop'
    }
  ];

  const recentInsights = [
    {
      title: 'Protein Spacing Discovery',
      text: 'Distributing 30g+ protein across 3 meals improved afternoon energy stability by 22%.',
      icon: Flame
    },
    {
      title: 'Hydration Recovery Link',
      text: 'Hitting >2.2L water daily reduced post-exercise muscle soreness scores.',
      icon: Droplets
    },
    {
      title: 'Glycemic Cushion Effect',
      text: 'Pairing healthy fats with evening carbs reduced overnight glucose variability.',
      icon: ShieldCheck
    }
  ];

  const handleQuickWaterAdd = () => {
    setQuickWater(prev => Math.min(3.5, Number((prev + 0.3).toFixed(1))));
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim() && onOpenAICoach) {
      onOpenAICoach(customPrompt);
      setCustomPrompt('');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* AI Hero Banner with Glowing Mesh Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel animated-mesh-bg rounded-3xl p-6 sm:p-8 border border-[#CF6DFC]/30 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#CF6DFC]/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#CF6DFC]/20 text-[#CF6DFC] border border-[#CF6DFC]/40 flex items-center gap-1.5 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CF6DFC] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CF6DFC]"></span>
                </span>
                AI Bio-Engine Active & Syncing
              </span>
              <span className="text-xs text-purple-300/60 font-semibold hidden sm:inline">{currentDate} • {currentTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {greeting}, <span className="text-gradient-primary">{userName}</span>! ✨
            </h1>

            <p className="text-sm sm:text-base text-purple-200/80 font-medium leading-relaxed">
              Your metabolic alignment score is <span className="text-[#FDFBD4] font-extrabold">{overallNutritionScore}%</span> today. 
              {mealLogs.length > 0 
                ? ` ${mealLogs.length} meal(s) logged (${totalCaloriesToday} kcal). High-protein lunch recommended for post-workout recovery.`
                : ' Log your first meal to activate real-time macro predictions.'
              }
            </p>

            {/* Quick Actions Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onLogFood}
                className="btn-lavender px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 shadow-lg shadow-[#CF6DFC]/30"
              >
                <Camera className="h-4 w-4" />
                <span>Log Meal / Scan Food</span>
              </button>

              <button
                onClick={() => onOpenAICoach && onOpenAICoach()}
                className="btn-glass px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center space-x-2 shadow-md"
              >
                <Bot className="h-4 w-4 text-[#CF6DFC]" />
                <span>Ask AI Coach</span>
              </button>

              <button
                onClick={handleQuickWaterAdd}
                className="btn-glass px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 hover:text-cyan-300"
              >
                <Droplets className="h-4 w-4 text-cyan-400" />
                <span>+300ml Water</span>
              </button>
            </div>
          </div>

          {/* Nutrition Score Gauge Card */}
          <div className="glass-panel p-5 rounded-3xl border border-[#CF6DFC]/30 flex flex-col items-center justify-center shrink-0 w-full lg:w-64 text-center bg-black/40">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/70 mb-1">
              Nutrition Health Index
            </span>
            <CircularProgress
              value={overallNutritionScore}
              max={100}
              size={120}
              strokeWidth={10}
              gradientId="heroScoreGradient"
              gradientColors={['#CF6DFC', '#a84df0']}
              label="Optimal Status"
              unit="%"
            />
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Metabolic Peak Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Mode & Subscription Status Bar (2x2 Matrix) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Account Mode Card (Solo vs Practitioner-Linked) */}
        <div className={`glass-panel p-4 sm:p-5 rounded-3xl border transition-all ${
          isLinked 
            ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-[#140E2A] to-purple-950/20' 
            : 'border-[#CF6DFC]/30 bg-gradient-to-r from-[#140E2A] to-purple-950/30'
        } flex items-center justify-between gap-3 shadow-lg`}>
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isLinked 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white' 
                : 'bg-gradient-to-tr from-purple-700 to-indigo-700 text-purple-200'
            }`}>
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isLinked 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-white/10 text-purple-200 border border-white/10'
                }`}>
                  {isLinked ? '🩺 Practitioner-Linked' : '🧍 Solo Mode'}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-sm truncate mt-1">
                {isLinked 
                  ? `Guided by ${practitioner?.name}`
                  : 'Managing Nutrition Independently'
                }
              </h3>
              <p className="text-[11px] text-purple-300/70 truncate font-medium">
                {isLinked 
                  ? (practitioner?.organization || practitioner?.role || 'Clinical Dietitian Guidance')
                  : 'Connect with your dietitian or doctor with their 6-digit code'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all shadow-md ${
              isLinked
                ? 'bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-500/30'
                : 'btn-lavender text-xs'
            }`}
          >
            {isLinked ? 'Manage Link' : 'Connect Code'}
          </button>
        </div>

        {/* Subscription Tier Card (Base vs Pro) */}
        <div className={`glass-panel p-4 sm:p-5 rounded-3xl border transition-all ${
          isPro 
            ? 'border-amber-400/40 bg-gradient-to-r from-amber-950/30 via-[#140E2A] to-purple-950/20' 
            : 'border-[#C1BFFF]/20 bg-gradient-to-r from-[#140E2A] to-purple-950/30'
        } flex items-center justify-between gap-3 shadow-lg`}>
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isPro 
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-600 text-slate-950' 
                : 'bg-white/10 text-purple-300'
            }`}>
              <Crown className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isPro 
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {isPro ? '👑 NutriGen Pro Member' : '🟢 Base Plan (Free)'}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-sm truncate mt-1">
                {isPro 
                  ? 'Unlimited AI Vision, Wearables & CGM' 
                  : `${user?.dailyQuotas?.aiScansUsed || 0}/3 AI Scans · ${user?.dailyQuotas?.aiCoachUsed || 0}/5 AI Coach`
                }
              </h3>
              <p className="text-[11px] text-purple-300/70 truncate font-medium">
                {isPro 
                  ? 'Active subscription with real-time biometric intelligence' 
                  : 'Upgrade for unlimited AI plate recognition & live wearable sync'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all shadow-md ${
              isPro
                ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40'
                : 'btn-lavender text-xs'
            }`}
          >
            {isPro ? 'Manage Tier' : '⚡ Upgrade to Pro'}
          </button>
        </div>
      </motion.div>

      {/* Practitioner Prescription Guidance Banner (if Linked) */}
      {isLinked && customTargets?.practitionerNotes && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#CF6DFC]/15 via-purple-900/30 to-indigo-900/20 border border-[#CF6DFC]/40 backdrop-blur-md flex items-start space-x-3.5 shadow-xl"
        >
          <div className="p-2.5 rounded-2xl bg-[#CF6DFC]/20 text-[#CF6DFC] shrink-0 mt-0.5 shadow-md">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] flex items-center gap-1.5">
                <span>Prescribed Clinical Directive</span>
                <span className="text-purple-300/60 font-semibold">• Dr./RD {practitioner?.name}</span>
              </h4>
              <span className="text-[10px] font-extrabold text-[#FDFBD4] bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                Prescribed Targets: {targetCalories} kcal · {targetProtein}g Protein · {targetCarbs}g Carbs · {targetFat}g Fat
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-1.5 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5">
              "{customTargets.practitionerNotes}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Redesigned Metrics Grid with Animated SVG Radial Progress Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        {/* Calories Progress Ring */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={totalCaloriesToday}
            max={targetCalories}
            size={96}
            strokeWidth={8}
            gradientId="caloriesRing"
            gradientColors={['#CF6DFC', '#a84df0']}
            label="Calories"
            unit=" kcal"
            subtext={`Goal: ${targetCalories}`}
            icon={Zap}
          />
        </motion.div>

        {/* Protein Ring */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={totalProteinLogged}
            max={targetProtein}
            size={96}
            strokeWidth={8}
            gradientId="proteinRing"
            gradientColors={['#CF6DFC', '#ec4899']}
            label="Protein"
            unit="g"
            subtext={`Target: ${targetProtein}g`}
            icon={Target}
          />
        </motion.div>

        {/* Carbs Ring */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={totalCarbsLogged}
            max={targetCarbs}
            size={96}
            strokeWidth={8}
            gradientId="carbsRing"
            gradientColors={['#60a5fa', '#3b82f6']}
            label="Carbohydrates"
            unit="g"
            subtext={`Target: ${targetCarbs}g`}
            icon={TrendingUp}
          />
        </motion.div>

        {/* Fats Ring */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={totalFatLogged}
            max={targetFat}
            size={96}
            strokeWidth={8}
            gradientId="fatRing"
            gradientColors={['#f59e0b', '#fbbf24']}
            label="Healthy Fats"
            unit="g"
            subtext={`Target: ${targetFat}g`}
            icon={Activity}
          />
        </motion.div>

        {/* Hydration Ring */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={Math.round((quickWater / 2.5) * 100)}
            max={100}
            size={96}
            strokeWidth={8}
            gradientId="hydrationRing"
            gradientColors={['#38bdf8', '#0284c7']}
            label="Hydration"
            unit="%"
            subtext={`${quickWater}L / 2.5L`}
            icon={Droplets}
          />
        </motion.div>

        {/* Sleep & Recovery Index */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-3xl border border-[#C1BFFF]/20 flex flex-col items-center justify-center glass-panel-hover"
        >
          <CircularProgress
            value={88}
            max={100}
            size={96}
            strokeWidth={8}
            gradientId="recoveryRing"
            gradientColors={['#a855f7', '#6366f1']}
            label="Sleep Recovery"
            unit="%"
            subtext="Restorative"
            icon={Moon}
          />
        </motion.div>
      </div>

      {/* Embedded ChatGPT-style AI Coach Prompt Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-5 rounded-3xl border border-[#CF6DFC]/30 shadow-xl bg-[#140E2A]/90"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] flex items-center justify-center shadow-md">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">Interactive AI Coach</h3>
              <p className="text-[11px] text-purple-300/60 font-semibold">Ask anything or choose a suggested topic</p>
            </div>
          </div>
          <button
            onClick={() => onOpenAICoach && onOpenAICoach()}
            className="text-xs text-[#CF6DFC] hover:text-white font-extrabold flex items-center space-x-1"
          >
            <span>Full Chat Drawer</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handlePromptSubmit} className="flex gap-2 mb-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. What should I eat for dinner to optimize protein & sleep?"
            className="input-modern flex-1 text-xs"
          />
          <button
            type="submit"
            className="btn-lavender px-5 py-2.5 rounded-2xl text-xs font-extrabold shrink-0 shadow-md"
          >
            Ask AI
          </button>
        </form>

        {/* Quick Suggested Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            "⚡ High-protein dinner suggestion",
            "🌙 How to fix my magnesium deficit",
            "🥗 15-min post-workout low carb meal",
            "🔥 Analyze today's energy stability"
          ].map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => onOpenAICoach && onOpenAICoach(promptText)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#CF6DFC]/20 border border-white/10 text-purple-200 text-xs font-semibold transition-all hover:border-[#CF6DFC]/40"
            >
              {promptText}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Guidance & Upcoming Meals 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Today's AI Guidance */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Today's AI Guidance</h2>
              <p className="text-xs text-purple-300/60 font-semibold">Adaptive real-time recommendations</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#FDFBD4]/15 text-[#FDFBD4] border border-[#FDFBD4]/30 text-xs font-extrabold">
              Updated Live
            </span>
          </div>

          <div className="space-y-3.5">
            {todaysGuidance.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  whileHover={{ x: 3 }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${item.gradient} border ${item.border} backdrop-blur-md flex items-start space-x-3.5`}
                >
                  <div className="p-2.5 rounded-xl bg-black/30 text-[#CF6DFC] shrink-0 mt-0.5 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-white text-sm tracking-tight">{item.title}</h3>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-purple-200">
                        {item.priority} priority
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/80 leading-relaxed font-medium mb-2">{item.description}</p>
                    <button
                      onClick={item.actionFn}
                      className="text-xs text-[#CF6DFC] hover:text-white font-extrabold flex items-center space-x-1 transition-colors"
                    >
                      <span>{item.action}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Meals Cards */}
        <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-lg font-extrabold text-white tracking-tight">Upcoming Meals</h2>
              <button 
                onClick={onNavigateMealPlan}
                className="text-xs text-[#CF6DFC] font-extrabold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {upcomingMeals.map((meal, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#CF6DFC]/40 transition-all cursor-pointer group"
                >
                  <img 
                    src={meal.image} 
                    alt={meal.title}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-md border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-extrabold text-purple-300/60 uppercase">{meal.meal} • {meal.time}</span>
                      <span className="text-[10px] font-extrabold bg-[#FDFBD4]/20 text-[#FDFBD4] px-2 py-0.5 rounded border border-[#FDFBD4]/30">
                        {meal.match}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-white text-xs truncate group-hover:text-[#CF6DFC] transition-colors">{meal.title}</h3>
                    <div className="text-[11px] text-purple-300/70 font-bold mt-0.5">
                      {meal.calories} • <span className="text-[#CF6DFC]">{meal.protein}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onNavigateMealPlan}
            className="w-full mt-6 py-3 btn-lavender rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Customize AI Meal Plan</span>
          </button>
        </div>
      </div>

      {/* AI Pattern Discoveries */}
      <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 w-full">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-[#CF6DFC]" />
            <h2 className="text-base font-extrabold text-white tracking-tight">AI Pattern Discoveries</h2>
          </div>
          <span className="text-xs text-purple-300/60 font-semibold">Continuous Bio-Learning</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {recentInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CF6DFC]/40 transition-all">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="h-4 w-4 text-[#CF6DFC]" />
                  <h3 className="font-extrabold text-white text-xs">{insight.title}</h3>
                </div>
                <p className="text-xs text-purple-200/80 font-medium leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI-Generated Personalised Diet Plan */}
      {dietPlan && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 w-full"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Utensils className="h-4 w-4 text-[#CF6DFC]" />
              <h2 className="text-base font-extrabold text-white tracking-tight">Your AI Diet Plan</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#CF6DFC]/20 text-[#CF6DFC] border border-[#CF6DFC]/30">Personalised</span>
            </div>
            <button
              onClick={handleRegeneratePlan}
              disabled={isRegenerating}
              className="flex items-center space-x-1.5 text-xs text-purple-300/70 hover:text-[#CF6DFC] font-semibold transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating…' : 'Regenerate'}</span>
            </button>
          </div>

          {/* Recommendation badge */}
          {dietPlan.recommendation && (
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#CF6DFC]/10 to-purple-900/20 border border-[#CF6DFC]/20">
              <p className="text-xs text-purple-200/90 font-medium leading-relaxed">
                <span className="font-extrabold text-[#CF6DFC]">Recommendation: </span>
                {dietPlan.recommendation}
              </p>
            </div>
          )}

          {/* Nutrition totals */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Calories', value: `${Math.round(dietPlan.nutrition.calories)} kcal`, color: 'text-[#FDFBD4]' },
              { label: 'Protein',  value: `${Math.round(dietPlan.nutrition.protein)}g`,      color: 'text-green-300' },
              { label: 'Carbs',    value: `${Math.round(dietPlan.nutrition.carbs)}g`,         color: 'text-blue-300' },
              { label: 'Fat',      value: `${Math.round(dietPlan.nutrition.fat)}g`,           color: 'text-amber-300' },
            ].map((macro) => (
              <div key={macro.label} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className={`text-sm font-extrabold ${macro.color}`}>{macro.value}</div>
                <div className="text-[10px] text-purple-300/60 font-semibold mt-0.5">{macro.label}</div>
              </div>
            ))}
          </div>

          {/* Meal list */}
          <div className="space-y-3">
            {dietPlan.diet_plan.slice(0, 3).map((meal, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#CF6DFC]/30 transition-all">
                <div className="p-2 rounded-xl bg-[#CF6DFC]/15 shrink-0">
                  <Utensils className="h-4 w-4 text-[#CF6DFC]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-xs truncate">{meal.name || `Meal ${idx + 1}`}</h3>
                    <span className="text-[10px] text-[#FDFBD4] font-bold ml-2 shrink-0">{Math.round(meal.calories)} kcal</span>
                  </div>
                  <div className="text-[10px] text-purple-300/60 font-medium mt-0.5">
                    P: {Math.round(meal.protein)}g · C: {Math.round(meal.carbs)}g · F: {Math.round(meal.fat)}g
                  </div>
                  {/* Health warnings */}
                  {(meal.health_warnings || []).map((w, wi) => (
                    <div key={wi} className="flex items-start space-x-1 mt-1.5">
                      <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-300/80 font-medium leading-tight">{w.reason}</p>
                    </div>
                  ))}
                  {/* LLM suggestion snippet */}
                  {meal.ai_suggestion && (
                    <p className="text-[10px] text-purple-300/60 font-medium mt-1 line-clamp-1 italic">
                      {String(meal.ai_suggestion).split('\n')[0]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {dietPlan.generatedAt && (
            <p className="text-[10px] text-purple-400/40 font-medium mt-3 text-right">
              Generated: {new Date(dietPlan.generatedAt).toLocaleString()}
            </p>
          )}
        </motion.div>
      )}

      {/* Connect Practitioner & Upgrade Modals */}
      <ConnectPractitionerModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}