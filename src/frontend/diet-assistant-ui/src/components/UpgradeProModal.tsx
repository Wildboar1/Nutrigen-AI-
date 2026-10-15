import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  X, 
  Crown, 
  Zap, 
  Activity, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonPrompt?: string;
}

export function UpgradeProModal({ isOpen, onClose, reasonPrompt }: UpgradeProModalProps) {
  const { user, upgradeSubscription } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const isPro = user?.subscriptionTier === 'pro';

  const handleUpgrade = async (tier: 'base' | 'pro') => {
    setIsProcessing(true);
    try {
      await upgradeSubscription(tier);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Upgrade error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/40 shadow-2xl relative bg-[#120D26] text-white my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-purple-300/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold mb-1 shadow-xs">
            <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>NUTRIGEN PRO SUBSCRIPTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Personal AI Nutrition Operating System
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 font-medium max-w-lg mx-auto">
            {reasonPrompt || 'Unlock unlimited AI vision plate scanning, 24/7 metabolic coach, real-time Dexcom CGM telemetry, and predictive glucose curves.'}
          </p>
        </div>

        {/* Billing Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10 text-xs font-extrabold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#CF6DFC] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              Monthly ($9.99/mo)
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#CF6DFC] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <span>Annual ($6.66/mo)</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-black text-[9px] font-black uppercase">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Feature Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Base Plan Summary */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-purple-300">Base Plan</span>
                <div className="text-lg font-black text-white">$0 <span className="text-xs text-purple-400 font-normal">/ forever</span></div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-purple-200 text-[10px] font-bold">
                Self-Guided
              </span>
            </div>
            <p className="text-[11px] text-purple-300/70">
              Essential habit tracking for users who want to manage their own diet.
            </p>
            <div className="space-y-1.5 text-xs text-purple-200/90 pt-1">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited manual meal logging</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>USDA 7,000+ food database search</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs font-bold">3/day</span>
                <span>AI Plate Computer Vision Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs font-bold">5/day</span>
                <span>AI Coach questions</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400/50">
                <X className="h-3.5 w-3.5 text-purple-500/50 shrink-0" />
                <span>No Continuous Glucose / Wearables</span>
              </div>
            </div>
          </div>

          {/* Pro Plan Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#CF6DFC]/20 via-purple-900/30 to-[#181132] border border-[#CF6DFC]/50 shadow-xl relative space-y-3">
            <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#CF6DFC]">NutriGen Pro</span>
                <div className="text-lg font-black text-white">
                  {billingCycle === 'annual' ? '$79.99' : '$9.99'} <span className="text-xs text-purple-400 font-normal">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                </div>
              </div>
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-[11px] text-purple-200">
              NutriGen actively optimizes your metabolic health 24/7.
            </p>
            <div className="space-y-1.5 text-xs text-white pt-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#CF6DFC] shrink-0" />
                <span className="font-semibold"><strong>Unlimited</strong> AI Plate Photo Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#CF6DFC] shrink-0" />
                <span className="font-semibold"><strong>Unlimited</strong> AI Nutrition Coach</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Live Dexcom CGM & Apple Watch sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Predictive glucose spike warnings</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Full lifetime metabolic analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {isPro ? (
            <div className="flex gap-3">
              <div className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>You are on NutriGen Pro</span>
              </div>
              <button
                onClick={() => handleUpgrade('base')}
                disabled={isProcessing}
                className="px-4 py-3 rounded-2xl border border-white/20 text-purple-300 hover:text-white text-xs font-bold hover:bg-white/5"
              >
                Switch to Base
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={isProcessing}
              className="w-full py-4 btn-lavender rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-[#CF6DFC]/30 disabled:opacity-50"
            >
              <span>{isProcessing ? 'Activating Pro Membership...' : success ? '✓ Membership Activated!' : `Start NutriGen Pro (${billingCycle === 'annual' ? '$79.99/yr' : '$9.99/mo'})`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <p className="text-[10px] text-center text-purple-300/50">
            Works seamlessly whether you are a Solo user or Practitioner-Linked. Cancel or switch anytime.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
