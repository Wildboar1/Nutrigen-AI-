import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#0b0814] flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
      {/* Background Aura Glowing Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#CF6DFC]/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative z-10 max-w-sm w-full bg-[#120D26]/90 flex flex-col items-center justify-center space-y-6"
      >
        {/* Brand Logo Hero */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.img 
            src="/newlogofull.png" 
            alt="NutriGen AI" 
            className="h-[90px] sm:h-[112px] w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(207,109,252,0.4)]"
            animate={{ 
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <p className="text-xs text-purple-300/70 font-semibold">
            Personalized Nutrition Operating System
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2 pt-2">
          <div className="bg-black/50 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              className="bg-gradient-to-r from-[#CF6DFC] via-[#a84df0] to-[#C1BFFF] h-full rounded-full shadow-xs"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[11px] font-extrabold text-purple-300/70">
            <span>Calibrating Neural Engine...</span>
            <span className="text-[#FDFBD4]">{progress}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
