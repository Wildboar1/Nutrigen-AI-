import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Search, 
  Clock, 
  DollarSign, 
  Plus, 
  ArrowLeft, 
  BookOpen
} from 'lucide-react';

interface RecipeManagementProps {
  onBack: () => void;
}

export function RecipeManagement({ onBack }: RecipeManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const recipes = [
    {
      id: 1,
      title: 'Pan-Seared Salmon & Quinoa Bowl',
      category: 'Lunch',
      calories: 520,
      protein: 42,
      carbs: 38,
      fat: 22,
      prepTime: 15,
      cost: 8.75,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop',
      ingredients: ['200g Wild Salmon', '1/2 cup Quinoa', '1/2 Avocado', '1 cup Steamed Broccoli', '1 tbsp Extra Virgin Olive Oil'],
      instructions: [
        'Season salmon with sea salt, black pepper, and fresh lemon juice.',
        'Heat olive oil in a skillet over medium-high heat. Sear salmon skin-side down for 4 minutes.',
        'Flip salmon and sear for an additional 3 minutes until golden.',
        'Fluff cooked quinoa and serve alongside salmon, sliced avocado, and broccoli.'
      ]
    },
    {
      id: 2,
      title: 'Greek Yogurt Berry Protein Power',
      category: 'Breakfast',
      calories: 320,
      protein: 32,
      carbs: 24,
      fat: 6,
      prepTime: 5,
      cost: 3.20,
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&h=350&fit=crop',
      ingredients: ['1 cup Plain Greek Yogurt (0% Fat)', '1 scoop Vanilla Whey Protein', '1/2 cup Organic Blueberries', '1 tbsp Chia Seeds'],
      instructions: [
        'Whisk Greek yogurt and whey protein powder until smooth.',
        'Top with fresh blueberries and chia seeds.',
        'Serve immediately chilled.'
      ]
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-all border border-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-0.5">
                <ChefHat className="h-3.5 w-3.5" /> Bio-Recipe Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Recipe Database & Cooking Studio</h1>
            </div>
          </div>
          <button className="btn-lavender px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shrink-0">
            <Plus className="h-4 w-4" />
            <span>Create Custom Recipe</span>
          </button>
        </div>
      </motion.div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="h-5 w-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes by name or ingredient..."
          className="input-modern w-full pl-12 text-sm"
        />
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {recipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl border border-[#C1BFFF]/20 overflow-hidden flex flex-col justify-between glass-panel-hover"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold uppercase text-[#CF6DFC] border border-white/10">
                  {recipe.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-white text-lg mb-1">{recipe.title}</h3>
                <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-black/40 border border-white/10 text-xs my-3">
                  <div><span className="font-extrabold text-white">{recipe.calories}</span> <span className="text-[10px] text-purple-400">kcal</span></div>
                  <div><span className="font-extrabold text-[#CF6DFC]">{recipe.protein}g</span> <span className="text-[10px] text-purple-400">P</span></div>
                  <div><span className="font-extrabold text-blue-400">{recipe.carbs}g</span> <span className="text-[10px] text-purple-400">C</span></div>
                  <div><span className="font-extrabold text-amber-400">{recipe.fat}g</span> <span className="text-[10px] text-purple-400">F</span></div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-white/10">
              <div className="text-xs text-purple-300/70 font-semibold flex items-center space-x-3">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {recipe.prepTime} min</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${recipe.cost}</span>
              </div>
              <button 
                onClick={() => setSelectedRecipe(recipe)}
                className="btn-lavender px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-md"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>View Cooking Guide</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cooking Mode Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-[#120D26]">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <h2 className="text-xl font-extrabold text-white">{selectedRecipe.title}</h2>
              <button onClick={() => setSelectedRecipe(null)} className="text-purple-300 hover:text-white text-sm font-bold">✕ Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-[#CF6DFC] mb-2">Ingredients Checklist</h4>
                <ul className="space-y-1 text-xs text-purple-200">
                  {selectedRecipe.ingredients.map((ing: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="text-[#CF6DFC]">✓</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-[#CF6DFC] mb-2">Step-by-Step Preparation</h4>
                <ol className="space-y-2 text-xs text-purple-200">
                  {selectedRecipe.instructions.map((step: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="font-extrabold text-white mr-2">Step {idx + 1}:</span> {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}