import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Smartphone, 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to NutriGen AI",
    subtitle: "Next-Gen Nutrition Intelligence Platform",
    description: "Experience an AI-first health operating system tailored to your unique metabolic blueprint, glucose dynamics, and physiological signals.",
    icon: Brain,
    features: [
      "Real-Time Bio-Engine Analysis",
      "Adaptive Macro Targets",
      "Continuous Glucose Predictive Nudges"
    ]
  },
  {
    title: "Multi-Modal Health Integration",
    subtitle: "Seamless Telemetry & Wearables Sync",
    description: "Connect Apple Health, Google Fit, Oura, or Continuous Glucose Monitors to generate an integrated biological data stream.",
    icon: Smartphone,
    features: [
      "Apple Health & Google Fit Telemetry",
      "Continuous Glucose Monitoring",
      "Sleep Recovery & Biomarker Sync"
    ]
  },
  {
    title: "Interactive AI Nutrition Coach",
    subtitle: "Conversational Metabolic Intelligence",
    description: "Ask your AI Coach for meal recommendations, custom recipe adjustments, or instant energy stabilization advice anytime.",
    icon: Sparkles,
    features: [
      "ChatGPT-Style Conversational Coach",
      "Instant Food Plate Computer Vision",
      "Personalized Grocery & Shopping Lists"
    ]
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const stepData = onboardingSteps[currentStep];
  const Icon = stepData.icon;

  return (
    <div className="min-h-screen bg-[#0b0814] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CF6DFC]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative z-10 bg-[#120D26]/90 flex flex-col justify-between min-h-[500px]"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-gradient-to-tr from-[#CF6DFC] to-[#a84df0] rounded-2xl flex items-center justify-center shadow-lg shadow-[#CF6DFC]/40">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">NutriGen AI</span>
          </div>

          <div className="flex space-x-1.5">
            {onboardingSteps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx ? 'w-8 bg-[#CF6DFC]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 flex-1 flex flex-col justify-center my-4"
          >
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-[#CF6DFC]/20 to-purple-900/40 border border-[#CF6DFC]/40 flex items-center justify-center shadow-xl">
              <Icon className="h-8 w-8 text-[#CF6DFC]" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] block mb-1">
                {stepData.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stepData.title}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 font-medium leading-relaxed mt-2">
                {stepData.description}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {stepData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs text-purple-100 font-semibold p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-[#CF6DFC] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="btn-glass px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-300 flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="btn-lavender px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-[#CF6DFC]/30"
          >
            <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started Now' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
