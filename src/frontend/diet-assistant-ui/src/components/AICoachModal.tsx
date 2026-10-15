import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  X, 
  Zap, 
  ChefHat, 
  Activity, 
  CheckCircle2,
  RotateCcw,
  Crown
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useMealLogs } from '../contexts/MealLogContext';
import { UpgradeProModal } from './UpgradeProModal';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isUpgradePrompt?: boolean;
  suggestionCard?: {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    reason: string;
  };
}

const SUGGESTED_PROMPTS = [
  { icon: Zap, label: "What should I eat for dinner with 45g protein goal remaining?" },
  { icon: Activity, label: "Analyze my magnesium and micronutrient balance today." },
  { icon: ChefHat, label: "Suggest a 15-min post-workout low-carb meal." },
  { icon: Sparkles, label: "Why did my energy dip at 3 PM and how do I prevent it tomorrow?" }
];

export function AICoachModal({ isOpen, onClose, initialPrompt = '' }: AICoachModalProps) {
  const { user, consumeQuota } = useUser();
  const { totalCaloriesToday } = useMealLogs();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = user?.displayName || 'Alex';
  const isPro = user?.subscriptionTier === 'pro';

  // Set initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `Hello ${userName}! I'm your NutriGen AI Coach. I'm actively analyzing your profile and today's ${totalCaloriesToday} kcal logged. How can I optimize your metabolic performance right now?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [userName, totalCaloriesToday, messages.length]);

  // Handle initial prompt passed from dashboard
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    // Check quota for Base plan
    const quota = await consumeQuota('aiCoach');
    if (!quota.allowed) {
      const quotaMsg: ChatMessage = {
        id: `quota_${Date.now()}`,
        sender: 'ai',
        text: `You have reached your daily free limit of 5 AI Coach interactions on the Base Plan. Upgrade to NutriGen Pro for unlimited real-time metabolic coaching, deep biomarker analysis, and wearable sync!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUpgradePrompt: true
      };
      setMessages(prev => [...prev, quotaMsg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Dynamic AI response generation based on context
    setTimeout(() => {
      let aiText = '';
      let cardData = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('dinner') || lower.includes('protein')) {
        aiText = `Based on your remaining macro quota (~45g protein required) and low inflammation goal, I recommend a Pan-Seared Salmon Fillet with Roasted Asparagus & Quinoa. Salmon is rich in Omega-3 EPA/DHA which aids nocturnal muscular repair.`;
        cardData = {
          title: "Pan-Seared Salmon & Quinoa Bowl",
          calories: 540,
          protein: 44,
          carbs: 28,
          fat: 22,
          reason: "Matches your remaining 45g protein target while maintaining low glycemic load."
        };
      } else if (lower.includes('magnesium') || lower.includes('micronutrient')) {
        aiText = `Your micronutrient diagnostic indicates your Magnesium intake is currently 23% below target (287mg vs 420mg target). Adding 2 cups of steamed spinach or 30g pumpkin seeds with your evening meal will bridge this gap and enhance your deep sleep index.`;
      } else if (lower.includes('workout') || lower.includes('post-workout') || lower.includes('15-min')) {
        aiText = `For immediate glycogen replenishment without insulin spikes, I've selected a Greek Yogurt & Whey Berry Power Bowl. Takes 5 minutes to assemble and delivers 32g fast-absorbing protein!`;
        cardData = {
          title: "Greek Yogurt Berry Power Bowl",
          calories: 320,
          protein: 32,
          carbs: 24,
          fat: 6,
          reason: "Fast leucine triggering for muscle protein synthesis."
        };
      } else if (lower.includes('energy') || lower.includes('dip')) {
        aiText = `Your 3 PM energy dip correlates with high-carbohydrate lunch intake without sufficient fiber padding. Moving forward, try adding 1 tbsp chia seeds or half an avocado to lunch to flatten the postprandial glucose spike by up to 34%.`;
      } else {
        aiText = `I've analyzed your query against your profile (${user?.userData?.activity_level || 'Moderate'} activity, ${user?.userData?.preferred_cuisine || 'Mediterranean'} preference). For optimal alignment, ensure your next meal prioritizes clean protein and complex greens.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestionCard: cardData
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl h-[85vh] max-h-[750px] bg-[#120D26] border border-[#CF6DFC]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#C1BFFF]/15 bg-[#171131]/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] flex items-center justify-center shadow-lg shadow-[#CF6DFC]/30">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-extrabold text-white tracking-tight">NutriGen AI Coach</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isPro 
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' 
                      : 'bg-[#CF6DFC]/20 text-[#CF6DFC] border border-[#CF6DFC]/30'
                  }`}>
                    {isPro ? '👑 Pro Unlimited' : `${user?.dailyQuotas?.aiCoachUsed || 0}/5 Daily Quota`}
                  </span>
                </div>
                <p className="text-xs text-purple-300/70 font-medium">Real-time metabolic & dietary intelligence</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Reset Chat"
                className="p-2 rounded-xl text-purple-300 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-purple-300 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#CF6DFC] to-[#8b31ea] flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[82%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#CF6DFC] to-[#a84df0] text-white font-semibold rounded-br-xs shadow-md'
                        : msg.isUpgradePrompt
                        ? 'bg-gradient-to-r from-amber-950/40 via-[#1D173A] to-purple-950/30 border border-amber-400/40 text-amber-100 font-medium rounded-bl-xs shadow-md'
                        : 'bg-[#1D173A] border border-[#C1BFFF]/20 text-purple-100 font-medium rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}

                    {/* Upgrade to Pro Action Box if Quota Exceeded */}
                    {msg.isUpgradePrompt && (
                      <div className="mt-3.5 pt-3 border-t border-amber-400/30">
                        <button
                          onClick={() => setIsUpgradeModalOpen(true)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition-all"
                        >
                          <Crown className="h-4 w-4 text-slate-950" />
                          <span>⚡ Upgrade to NutriGen Pro ($9.99/mo)</span>
                        </button>
                      </div>
                    )}

                    {/* Formatted Suggestion Card */}
                    {msg.suggestionCard && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-[#140F2B] border border-[#CF6DFC]/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                            <ChefHat className="h-4 w-4 text-[#CF6DFC]" /> {msg.suggestionCard.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDFBD4] text-purple-950">
                            {msg.suggestionCard.calories} kcal
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-300/80 italic">{msg.suggestionCard.reason}</p>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 bg-white/5 rounded-lg border border-white/5 font-bold">
                          <div><span className="text-[#CF6DFC]">{msg.suggestionCard.protein}g</span> P</div>
                          <div><span className="text-blue-400">{msg.suggestionCard.carbs}g</span> C</div>
                          <div><span className="text-amber-400">{msg.suggestionCard.fat}g</span> F</div>
                        </div>

                        <button className="w-full mt-2 py-2 rounded-xl bg-[#CF6DFC] hover:bg-[#b84fe5] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Apply to Today's Meal Plan</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-purple-400/60 mt-1 block text-right px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-purple-700 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 text-purple-300/70 text-xs font-semibold"
              >
                <div className="h-8 w-8 rounded-xl bg-[#CF6DFC]/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[#CF6DFC] animate-spin" />
                </div>
                <div className="flex space-x-1 bg-[#1D173A] px-4 py-3 rounded-2xl border border-[#C1BFFF]/20">
                  <div className="w-2 h-2 rounded-full bg-[#CF6DFC] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#CF6DFC] animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-[#CF6DFC] animate-bounce delay-200"></div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#161033]/90 border-t border-[#C1BFFF]/10 overflow-x-auto flex space-x-2 scrollbar-none">
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.label)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#CF6DFC]/20 border border-white/10 hover:border-[#CF6DFC]/40 text-purple-200 text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0"
                >
                  <Icon className="h-3.5 w-3.5 text-[#CF6DFC]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-5 bg-[#171131] border-t border-[#C1BFFF]/15 flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI Coach anything about your diet, macros, or energy..."
              className="flex-1 bg-[#0E0921] border border-[#C1BFFF]/20 focus:border-[#CF6DFC] rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-[#CF6DFC]/30 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-all shadow-md shadow-[#CF6DFC]/30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <UpgradeProModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </div>
    </AnimatePresence>
  );
}
