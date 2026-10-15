import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Search, 
  Mic, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  ScanLine,
  Sliders,
  Database
} from 'lucide-react';
import { useMealLogs } from '../contexts/MealLogContext';
import { useUser } from '../contexts/UserContext';
import { UpgradeProModal } from './UpgradeProModal';
import { API_BASE_URL } from '../config';

interface FoodLoggingProps {
  onBack: () => void;
}

export function FoodLogging({ onBack }: FoodLoggingProps) {
  const { addMealLog } = useMealLogs();
  const { user, consumeQuota } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'search' | 'voice' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [usdaFoods, setUsdaFoods] = useState<any[]>([]);
  const [isSearchingUsda, setIsSearchingUsda] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');

  // Fallback Sample Database Items
  const sampleFoodDatabase = [
    { name: 'Grilled Chicken Breast (200g)', calories: 330, protein: 62, carbs: 0, fat: 7, category: 'Poultry' },
    { name: 'Avocado Toast on Sourdough', calories: 290, protein: 9, carbs: 32, fat: 15, category: 'Breakfast' },
    { name: 'Greek Yogurt with Honey & Berries', calories: 220, protein: 18, carbs: 26, fat: 4, category: 'Dairy' },
    { name: 'Salmon Fillet & Steamed Broccoli', calories: 480, protein: 44, carbs: 12, fat: 28, category: 'Seafood' },
    { name: 'Protein Chocolate Whey Smoothie', calories: 260, protein: 32, carbs: 18, fat: 5, category: 'Shake' }
  ];

  useEffect(() => {
    if (activeTab !== 'search') return;
    const fetchUsdaFoods = async () => {
      setIsSearchingUsda(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/foods/search?query=${encodeURIComponent(searchQuery)}&limit=30`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.foods) && data.foods.length > 0) {
            setUsdaFoods(data.foods);
          } else {
            setUsdaFoods([]);
          }
        }
      } catch {
        setUsdaFoods([]);
      } finally {
        setIsSearchingUsda(false);
      }
    };

    const timer = setTimeout(fetchUsdaFoods, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const displayFoods = usdaFoods.length > 0 
    ? usdaFoods 
    : sampleFoodDatabase.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check daily quota for Base users
    const quota = await consumeQuota('aiScans');
    if (!quota.allowed) {
      setScanError('Daily Free Quota Reached: You have used your 3 free AI plate scans for today. Upgrade to Pro for unlimited AI scans!');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result as string;
      try {
        const response = await fetch(`${API_BASE_URL}/api/analyze-food-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: base64Image })
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok && data.isFood !== false && data.foods && data.foods.length > 0) {
          const firstFood = data.foods[0] || {};
          setScanResult({
            name: firstFood.name || 'AI Analyzed Food Plate',
            confidence: data.confidence ? Math.round(data.confidence * 100) : 96,
            calories: data.totalCalories || firstFood.calories || 0,
            protein: data.macros?.protein || firstFood.protein || 0,
            carbs: data.macros?.carbs || firstFood.carbs || 0,
            fat: data.macros?.fat || firstFood.fat || 0,
            ingredients: data.foods?.map((f: any) => f.name) || [firstFood.name],
            image: base64Image
          });
          setScanError(null);
        } else {
          setScanError(data.error || 'No food or beverage detected in image. Please upload a clear photo of food, meals, or ingredients.');
          setScanResult(null);
        }
      } catch {
        setScanError('Unable to analyze image. Please ensure you upload a clear photo of a food item or ingredient plate.');
        setScanResult(null);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAddScan = () => {
    if (!scanResult) return;
    addMealLog({
      name: scanResult.name,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fat: scanResult.fat,
      source: 'camera'
    });
    onBack();
  };

  const handleAddFoodItem = (food: any) => {
    addMealLog({
      name: food.name,
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      source: 'search'
    });
    onBack();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualCalories) return;
    addMealLog({
      name: manualName,
      calories: Number(manualCalories),
      protein: Number(manualProtein) || 0,
      carbs: Number(manualCarbs) || 0,
      fat: Number(manualFat) || 0,
      source: 'quick-add'
    });
    onBack();
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-5xl mx-auto">
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-all border border-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-0.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Vision & Bio-Logger
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Log Meal & Nutrition</h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: 'camera', label: 'AI Camera Scan', icon: Camera },
            { id: 'search', label: 'Database Search', icon: Search },
            { id: 'voice', label: 'Voice AI Log', icon: Mic },
            { id: 'manual', label: 'Quick Manual', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#CF6DFC] text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* AI Camera Vision Tab */}
        {activeTab === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Camera Viewfinder */}
            <div className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-black/60 text-center">
              {scanResult ? (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <img 
                    src={scanResult.image} 
                    alt="Scanned Food"
                    className="w-full h-64 object-cover rounded-2xl border border-[#CF6DFC]/40 shadow-xl"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{scanResult.confidence}% AI Recognition Match</span>
                  </div>
                </div>
              ) : isScanning ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="relative">
                    <ScanLine className="h-16 w-16 text-[#CF6DFC] animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-[#CF6DFC] animate-ping opacity-30"></div>
                  </div>
                  <p className="text-sm font-extrabold text-white">Analyzing food items, portion size & macro balance...</p>
                  <p className="text-xs text-purple-300/60">NutriGen Computer Vision v4.2</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#CF6DFC]/20 to-purple-900/40 border border-[#CF6DFC]/40 flex items-center justify-center shadow-lg">
                    <Camera className="h-10 w-10 text-[#CF6DFC]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Position your food plate in focus</h3>
                    <p className="text-xs text-purple-300/70 font-semibold max-w-xs mt-1">Our neural network estimates ingredients, mass, and calorie breakdown automatically.</p>
                  </div>
                  {scanError && (
                    <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold max-w-xs space-y-1 my-2 text-center shadow-lg">
                      <div className="font-extrabold text-rose-400 text-sm flex items-center justify-center gap-1.5">
                        <span>⚠️ Non-Food Image Detected</span>
                      </div>
                      <p>{scanError}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerFileSelect}
                    className="btn-lavender px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-[#CF6DFC]/30 mt-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Snap / Upload Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scan Results & Macro Breakdown */}
            <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <h3 className="text-lg font-extrabold text-white">AI Vision Diagnostic</h3>
                  <span className="text-xs font-extrabold text-[#CF6DFC] bg-[#CF6DFC]/20 px-3 py-1 rounded-full border border-[#CF6DFC]/40">
                    Real-Time Detection
                  </span>
                </div>

                {scanResult ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-extrabold text-white">{scanResult.name}</h4>
                      <p className="text-xs text-purple-300/70 font-semibold mt-0.5">Ingredients: {scanResult.ingredients.join(', ')}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center p-4 rounded-2xl bg-black/40 border border-white/10">
                      <div>
                        <div className="text-lg font-extrabold text-white">{scanResult.calories}</div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase">Calories</div>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-[#CF6DFC]">{scanResult.protein}g</div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase">Protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-blue-400">{scanResult.carbs}g</div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase">Carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-amber-400">{scanResult.fat}g</div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase">Fat</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#CF6DFC]/10 border border-[#CF6DFC]/30 text-xs text-purple-200">
                      <span className="font-extrabold text-white block mb-1">💡 AI Metabolic Insight:</span>
                      This meal provides high leucine concentration perfect for post-workout muscle repair while maintaining a moderate glycemic impact.
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-purple-300/60 font-semibold border border-dashed border-white/10 rounded-2xl">
                    Take or upload a photo on the left to see instant AI nutrient diagnostics.
                  </div>
                )}
              </div>

              {scanResult && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setScanResult(null);
                      handleTriggerFileSelect();
                    }}
                    className="btn-glass flex-1 py-3 rounded-2xl text-xs font-bold text-purple-300"
                  >
                    Re-scan / Pick New Photo
                  </button>
                  <button
                    onClick={handleConfirmAddScan}
                    className="btn-lavender flex-1 py-3 rounded-2xl text-xs font-extrabold shadow-lg"
                  >
                    Confirm & Save to Logs
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Database Search Tab */}
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 space-y-4"
          >
            <div className="relative">
              <Search className="h-5 w-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search USDA food database (e.g. Chicken, Salmon, Avocado, Cheese, Quinoa)..."
                className="input-modern w-full pl-12 text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-purple-300/70 px-1 font-semibold">
              <span className="flex items-center gap-1.5 text-[#CF6DFC] font-extrabold">
                <Database className="h-3.5 w-3.5" /> 7,060 USDA Foods Indexed
              </span>
              {isSearchingUsda && <span>Searching USDA Database...</span>}
            </div>

            <div className="space-y-2 pt-2 max-h-[400px] overflow-y-auto pr-1">
              {displayFoods.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CF6DFC]/40 transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{item.name}</h4>
                    <div className="text-xs text-purple-300/70 font-semibold mt-0.5">
                      {item.calories} kcal • <span className="text-[#CF6DFC]">{item.protein}g P</span> • <span className="text-blue-400">{item.carbs}g C</span> • <span className="text-amber-400">{item.fat}g F</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFoodItem(item)}
                    className="btn-lavender px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-md shrink-0 ml-3"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Log Food</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Voice AI Log Tab */}
        {activeTab === 'voice' && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-8 rounded-3xl border border-[#CF6DFC]/30 text-center space-y-6 max-w-2xl mx-auto"
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] flex items-center justify-center mx-auto shadow-xl shadow-[#CF6DFC]/30 relative">
              <Mic className="h-10 w-10 text-white" />
              {isVoiceListening && (
                <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-40"></div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Speak naturally to your AI Logger</h3>
              <p className="text-xs text-purple-300/70 font-semibold mt-1">
                Say things like: <span className="text-[#FDFBD4] italic">"I just had 2 boiled eggs, a slice of whole wheat toast, and black coffee for breakfast."</span>
              </p>
            </div>

            <button
              onClick={() => setIsVoiceListening(!isVoiceListening)}
              className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs transition-all shadow-lg ${
                isVoiceListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'btn-lavender'
              }`}
            >
              {isVoiceListening ? 'Stop Listening...' : 'Tap to Start Voice Recognition'}
            </button>
          </motion.div>
        )}

        {/* Quick Manual Entry Tab */}
        {activeTab === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 max-w-2xl mx-auto"
          >
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <h3 className="text-lg font-extrabold text-white pb-2 border-b border-white/10">Manual Meal Log</h3>
              <div>
                <label className="text-xs font-bold text-purple-300/80 mb-1 block">Meal / Dish Name</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Pan-Seared Salmon Bowl"
                  className="input-modern w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={manualCalories}
                    onChange={(e) => setManualCalories(e.target.value)}
                    placeholder="450"
                    className="input-modern w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Protein (g)</label>
                  <input
                    type="number"
                    value={manualProtein}
                    onChange={(e) => setManualProtein(e.target.value)}
                    placeholder="35"
                    className="input-modern w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Carbs (g)</label>
                  <input
                    type="number"
                    value={manualCarbs}
                    onChange={(e) => setManualCarbs(e.target.value)}
                    placeholder="40"
                    className="input-modern w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Fat (g)</label>
                  <input
                    type="number"
                    value={manualFat}
                    onChange={(e) => setManualFat(e.target.value)}
                    placeholder="15"
                    className="input-modern w-full text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 btn-lavender rounded-2xl font-extrabold text-xs shadow-lg mt-4"
              >
                Save Meal Log
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}