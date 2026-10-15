import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Heart, 
  ShoppingCart,
  Camera,
  Utensils,
  Star,
  ChefHat,
  Zap,
  Search,
  Sparkles,
  CheckCircle2,
  Plus,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useMealLogs } from '../contexts/MealLogContext';
import { API_BASE_URL } from '../config';

interface MealPlanningProps {
  onScanFood?: () => void;
  onRecipeBrowser?: () => void;
  onOpenAICoach?: (prompt?: string) => void;
}

const WEEK_DAYS = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MealPlanning({ onScanFood, onRecipeBrowser, onOpenAICoach }: MealPlanningProps) {
  const { user } = useUser();
  const { mealLogs } = useMealLogs();

  // Pull the backend-generated diet plan from context
  const { dietPlan } = useUser();
  const hasUserInput = Boolean(user?.userData && user.userData.age && user.userData.weight);
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState<'suggestions' | 'recipes' | 'shopping'>('suggestions');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState('');
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeResults, setRecipeResults] = useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<any[]>([]);

  const profile = user?.userData;

  const defaultMealSuggestions = [
    {
      id: 1,
      type: 'Breakfast',
      time: '8:00 AM',
      title: 'Protein-Rich Overnight Oats & Chia',
      description: 'Optimized for morning glucose stability & sustained focus',
      calories: 420,
      protein: 24,
      carbs: 45,
      fat: 12,
      matchScore: 96,
      prepTime: 5,
      cost: 3.50,
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&h=350&fit=crop',
      benefits: ['Stable Glucose', 'High Fiber', 'Quick Prep'],
      ingredients: ['Rolled oats', 'Greek yogurt', 'Chia seeds', 'Blueberries', 'Almond butter']
    },
    {
      id: 2,
      type: 'Lunch',
      time: '12:30 PM',
      title: 'Mediterranean Salmon & Quinoa Bowl',
      description: 'Balanced macronutrients for sustained afternoon physical & cognitive energy',
      calories: 520,
      protein: 42,
      carbs: 38,
      fat: 22,
      matchScore: 94,
      prepTime: 15,
      cost: 8.75,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop',
      benefits: ['Anti-Inflammatory', 'Heart Healthy', 'High Omega-3'],
      ingredients: ['Wild Salmon', 'Quinoa', 'Chickpeas', 'Cucumber', 'Feta cheese', 'Extra virgin olive oil']
    },
    {
      id: 3,
      type: 'Dinner',
      time: '7:00 PM',
      title: 'Herb-Crusted Salmon & Roasted Greens',
      description: 'Omega-3 rich for nocturnal muscle repair and restorative sleep cycles',
      calories: 640,
      protein: 48,
      carbs: 25,
      fat: 28,
      matchScore: 92,
      prepTime: 25,
      cost: 12.50,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=350&fit=crop',
      benefits: ['Sleep Support', 'Muscle Repair', 'Low Glycemic Load'],
      ingredients: ['Salmon fillet', 'Sweet potato', 'Asparagus', 'Fresh herbs', 'Lemon', 'Olive oil']
    }
  ];

  const latestMeal = mealLogs[0];
  const dynamicMealSuggestions = mealLogs.length > 0
    ? defaultMealSuggestions.map((meal, index) =>
        index === 0
          ? {
              ...meal,
              title: `Recovery Pairing for ${latestMeal.name}`,
              description: `Balanced follow-up meal generated from your latest log (${latestMeal.calories} kcal).`,
              protein: Math.max(meal.protein, latestMeal.protein),
              carbs: Math.max(meal.carbs, latestMeal.carbs - 5),
              fat: Math.max(meal.fat, latestMeal.fat - 2),
            }
          : meal
      )
    : defaultMealSuggestions;

  // If there are no AI Gemini suggestions but we have a backend diet plan, use its meals
  const backendMealSuggestions = useMemo(() => {
    if (!dietPlan?.diet_plan?.length) return [];
    return dietPlan.diet_plan.slice(0, 3).map((meal, idx) => ({
      id: `backend-${idx}`,
      type: idx === 0 ? 'Breakfast' : idx === 1 ? 'Lunch' : 'Dinner',
      time: idx === 0 ? '8:00 AM' : idx === 1 ? '12:30 PM' : '7:00 PM',
      title: meal.name || `Meal ${idx + 1}`,
      description: meal.ai_suggestion
        ? String(meal.ai_suggestion).split('\n')[0]
        : `${Math.round(meal.protein)}g protein · ${Math.round(meal.carbs)}g carbs · ${Math.round(meal.fat)}g fat`,
      calories: Math.round(meal.calories),
      protein: Math.round(meal.protein),
      carbs: Math.round(meal.carbs),
      fat: Math.round(meal.fat),
      matchScore: 90,
      prepTime: 20,
      cost: 7.5,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=350&fit=crop',
      benefits: [
        ...( (meal.health_warnings || []).length > 0
          ? [`⚠️ ${meal.health_warnings![0].condition} note`]
          : ['Personalised plan']
        ),
        'USDA-verified nutrition',
      ],
      ingredients: [],
    }));
  }, [dietPlan]);

  const displayedMealSuggestions =
    aiSuggestions.length > 0
      ? aiSuggestions
      : backendMealSuggestions.length > 0
        ? backendMealSuggestions
        : dynamicMealSuggestions;

  const autoShoppingList = useMemo(() => {
    if (selectedRecipes.length === 0) return [];
    const ingredientCounts: Record<string, number> = {};
    selectedRecipes.forEach(recipe => {
      (recipe.ingredients || []).forEach((item: string) => {
        const key = String(item).trim();
        if (!key) return;
        ingredientCounts[key] = (ingredientCounts[key] || 0) + 1;
      });
    });

    return [
      {
        category: 'Selected Recipe Ingredients',
        items: Object.entries(ingredientCounts).map(([name, count]) =>
          count > 1 ? `${name} (x${count})` : name
        )
      }
    ];
  }, [selectedRecipes]);

  const fetchAiSuggestions = useCallback(async () => {
    if (!profile) {
      setAiSuggestions([]);
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-meal-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealLogs: mealLogs.slice(0, 20),
          userProfile: {
            age: profile.age,
            gender: profile.gender,
            weight: profile.weight,
            height: profile.height,
            activity_level: profile.activity_level,
            dietary_restrictions: profile.dietary_restrictions || [],
            health_conditions: profile.health_conditions || [],
            preferred_cuisine: profile.preferred_cuisine,
            current_mood: profile.current_mood,
            calorieGoal: profile.calorieGoal,
            proteinGoal: profile.proteinGoal,
            carbsGoal: profile.carbsGoal,
            fatGoal: profile.fatGoal,
          },
          targetDay: WEEK_DAYS[selectedDay]
        })
      });
      const data = await response.json();
      setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setAiSuggestions([]);
    } finally {
      setIsAiLoading(false);
    }
  }, [mealLogs, profile, selectedDay]);

  const fetchRecipes = useCallback(async (query: string) => {
    setIsRecipeLoading(true);
    try {
      const url = `${API_BASE_URL}/api/recipes/search?query=${encodeURIComponent(query)}&limit=24`;
      const response = await fetch(url);
      const data = await response.json();
      setRecipeResults(Array.isArray(data.recipes) ? data.recipes : []);
    } catch {
      setRecipeResults([]);
    } finally {
      setIsRecipeLoading(false);
    }
  }, []);

  const toggleRecipeSelection = (recipe: any) => {
    setSelectedRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id);
      if (exists) return prev.filter(r => r.id !== recipe.id);
      return [...prev, recipe];
    });
  };

  useEffect(() => {
    if (hasUserInput) fetchAiSuggestions();
  }, [hasUserInput, fetchAiSuggestions]);

  useEffect(() => {
    if (hasUserInput) {
      const defaultQuery = [
        user?.userData?.preferred_cuisine,
        ...(user?.userData?.dietary_restrictions || []).slice(0, 1)
      ].filter(Boolean).join(' ').trim();
      fetchRecipes(defaultQuery);
    }
  }, [hasUserInput, user?.userData?.preferred_cuisine, user?.userData?.dietary_restrictions, fetchRecipes]);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* Header Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Meal Planning</h1>
            <p className="text-purple-300/70 text-xs sm:text-sm font-semibold">Personalized nutrition tailored to your metabolic blueprint</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onScanFood}
              className="btn-lavender px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 shrink-0 shadow-md"
            >
              <Camera className="h-4 w-4" />
              <span>Scan Meal Plate</span>
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {WEEK_DAYS.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedDay === index
                  ? 'bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] text-white shadow-md shadow-[#CF6DFC]/30'
                  : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/5'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* View Mode Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'suggestions', label: 'AI Meal Suggestions', icon: Zap },
            { id: 'recipes', label: 'Recipe Browser', icon: ChefHat },
            { id: 'shopping', label: 'Smart Shopping List', icon: ShoppingCart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
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

      {/* AI Suggestions View */}
      {viewMode === 'suggestions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Main Visually Rich Cards List */}
          <div className="lg:col-span-2 space-y-5">
            {/* Diet Explanation from Backend LLM */}
            {dietPlan?.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-5 rounded-3xl border border-[#CF6DFC]/25"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-4 w-4 text-[#CF6DFC]" />
                  <h3 className="text-sm font-extrabold text-white">Your Personalised Diet Plan Explanation</h3>
                </div>
                <p className="text-xs text-purple-200/80 font-medium leading-relaxed">
                  {dietPlan.explanation}
                </p>
              </motion.div>
            )}

            {/* Source badge when showing backend-generated meals */}
            {aiSuggestions.length === 0 && backendMealSuggestions.length > 0 && (
              <div className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-wider text-purple-400/60">
                <Sparkles className="h-3 w-3" />
                <span>Showing your AI-generated diet plan meals — powered by USDA nutrition data</span>
              </div>
            )}

            {isAiLoading && (
              <div className="glass-panel p-8 rounded-3xl border border-[#C1BFFF]/20 text-center text-purple-300 text-sm font-semibold">
                Generating personalized AI meal suggestions...
              </div>
            )}

            {displayedMealSuggestions.map((meal, idx) => (
              <motion.div 
                key={meal.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-3xl border border-[#C1BFFF]/20 overflow-hidden glass-panel-hover"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-52 h-52 sm:h-auto shrink-0 overflow-hidden">
                    <img 
                      src={meal.image} 
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold uppercase text-[#CF6DFC] border border-white/10">
                      {meal.type} • {meal.time}
                    </div>
                  </div>

                  <div className="p-6 flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">{meal.title}</h3>
                          <p className="text-xs text-purple-200/70 mt-1 font-medium leading-relaxed">{meal.description}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FDFBD4]/20 text-[#FDFBD4] text-xs font-extrabold border border-[#FDFBD4]/40 shrink-0 shadow-xs">
                          {meal.matchScore || 94}% AI Match
                        </span>
                      </div>

                      {/* Macronutrient breakdown progress bars */}
                      <div className="grid grid-cols-4 gap-2 bg-black/40 p-3 rounded-2xl my-3 border border-white/10 text-center">
                        <div>
                          <div className="text-xs font-extrabold text-white">{meal.calories}</div>
                          <div className="text-[10px] font-semibold text-purple-400">kcal</div>
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-[#CF6DFC]">{meal.protein}g</div>
                          <div className="text-[10px] font-semibold text-purple-400">protein</div>
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-blue-400">{meal.carbs}g</div>
                          <div className="text-[10px] font-semibold text-purple-400">carbs</div>
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-amber-400">{meal.fat}g</div>
                          <div className="text-[10px] font-semibold text-purple-400">fat</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <div className="flex items-center space-x-4 text-xs font-semibold text-purple-300/70">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 text-purple-400" />
                          <span>{meal.prepTime} min prep</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-3.5 w-3.5 text-purple-400" />
                          <span>${meal.cost}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onOpenAICoach && onOpenAICoach(`How to prepare ${meal.title}?`)}
                          className="btn-glass px-3 py-2 rounded-xl text-xs font-bold text-purple-300"
                        >
                          Ask AI
                        </button>
                        <button className="btn-lavender px-4 py-2 rounded-xl text-xs font-extrabold shadow-md">
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contextual Recommendations Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20 space-y-4">
              <h3 className="font-extrabold text-white text-sm">Smart Context Adjustments</h3>
              <div className="space-y-3">
                {[
                  { icon: MapPin, title: 'Local Organic Sourcing', text: 'Whole Foods Market • 0.8 miles away', action: 'View Grocery Stock' },
                  { icon: Clock, title: 'Time Efficient Prep', text: 'Busy afternoon scheduled (2 meetings)', action: '15-min Meal Filters' },
                  { icon: DollarSign, title: 'Budget Optimized', text: '$21.50 estimated daily meal expense', action: 'Savings Breakdown' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="h-4 w-4 text-[#CF6DFC]" />
                        <span className="font-extrabold text-white text-xs">{item.title}</span>
                      </div>
                      <p className="text-xs text-purple-300/80 mb-2 font-medium">{item.text}</p>
                      <button className="text-xs text-[#CF6DFC] font-extrabold hover:underline">
                        {item.action} →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-[#CF6DFC]/30 bg-gradient-to-br from-purple-950/80 via-slate-900 to-purple-950/80">
              <h3 className="font-extrabold text-sm mb-3 text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#CF6DFC]" /> Metabolic Priorities
              </h3>
              <div className="space-y-2.5 text-xs text-purple-200/90 font-medium">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-[#CF6DFC] shrink-0" />
                  <span>Prioritize Omega-3 fatty acids for recovery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-[#C1BFFF] shrink-0" />
                  <span>Include magnesium-dense greens at lunch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-[#FDFBD4] shrink-0" />
                  <span>Maintain consistent 3-hour protein spacing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Browser View */}
      {viewMode === 'recipes' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Recipe Database</h2>
              <p className="text-xs text-purple-300/70 font-semibold">Search healthy recipes matching your dietary blueprint</p>
            </div>
            <button
              onClick={onRecipeBrowser}
              className="px-4 py-2 text-xs font-bold bg-[#FDFBD4]/20 text-[#FDFBD4] rounded-xl border border-[#FDFBD4]/30 hover:bg-[#FDFBD4]/30 transition-colors"
            >
              Full Recipe Manager
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={recipeQuery}
                onChange={(e) => setRecipeQuery(e.target.value)}
                placeholder="Search recipes by name, ingredient, or cuisine..."
                className="input-modern w-full pl-11 text-xs"
              />
            </div>
            <button
              onClick={() => fetchRecipes(recipeQuery)}
              className="btn-lavender px-5 py-2 rounded-2xl text-xs font-extrabold shadow-md"
            >
              Search
            </button>
          </div>

          {isRecipeLoading ? (
            <div className="text-xs text-purple-300 font-semibold py-8 text-center">Loading recipes...</div>
          ) : recipeResults.length === 0 ? (
            <div className="text-xs text-purple-300/70 font-semibold py-8 text-center">No recipes found matching your query.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {recipeResults.map((recipe) => {
                const selected = selectedRecipes.some(r => r.id === recipe.id);
                return (
                  <div key={recipe.id} className="glass-panel p-4 rounded-3xl border border-white/10 hover:border-[#CF6DFC]/50 transition-all bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-extrabold text-white text-sm">{recipe.name}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-[#FDFBD4]/20 text-[#FDFBD4] uppercase border border-[#FDFBD4]/30">
                        {recipe.category || 'Recipe'}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/70 line-clamp-2 mb-3 font-medium">{recipe.description}</p>
                    <div className="text-xs font-extrabold text-white mb-3">
                      {Math.round(recipe.calories || 0)} kcal • <span className="text-[#CF6DFC]">{Math.round(recipe.protein || 0)}g protein</span>
                    </div>
                    <button
                      onClick={() => toggleRecipeSelection(recipe)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        selected 
                          ? 'bg-[#CF6DFC] text-white shadow-md' 
                          : 'btn-glass'
                      }`}
                    >
                      {selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      <span>{selected ? 'Added to Shopping List' : 'Add to Shopping List'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Smart Shopping List View */}
      {viewMode === 'shopping' && (
        <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Smart Shopping List</h2>
              <p className="text-xs text-purple-300/70 font-semibold">Auto-generated ingredient checklist from your selected recipes</p>
            </div>
            <button className="btn-lavender px-4 py-2 rounded-2xl text-xs font-extrabold shadow-md">
              Find Local Stores
            </button>
          </div>

          {autoShoppingList.length === 0 ? (
            <div className="text-xs text-purple-300/70 p-12 border border-dashed border-white/20 rounded-3xl text-center font-medium">
              Select recipes from the <span className="font-extrabold text-white">Recipe Browser</span> tab to automatically populate your smart grocery checklist.
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {autoShoppingList.map((category, index) => (
                <div key={index} className="glass-panel p-5 rounded-3xl border border-white/10">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">{category.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {category.items.map((item, itemIndex) => (
                      <label key={itemIndex} className="flex items-center space-x-3 cursor-pointer p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CF6DFC]/40 transition-all">
                        <input
                          type="checkbox"
                          className="rounded border-purple-500/50 text-[#CF6DFC] focus:ring-[#CF6DFC]"
                        />
                        <span className="text-xs font-semibold text-purple-100">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}