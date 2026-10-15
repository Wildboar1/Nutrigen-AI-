import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ArrowRight, 
  Lock, 
  Mail,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

import { useUser } from '../contexts/UserContext';

interface LoginProps {
  onLogin: (userType: 'individual' | 'professional' | 'admin') => void;
  onSignup: () => void;
  onBack: () => void;
  onPasswordReset: () => void;
}

export function Login({ onLogin, onSignup, onBack, onPasswordReset }: LoginProps) {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'individual' | 'professional'>('individual');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const authUser = await login(email, password);
      // Determine account type directly from server-verified account
      const resolvedType = authUser.accountType || userType;
      
      // Warn if logging into a different portal tab than registered
      if (authUser.accountType && authUser.accountType !== userType) {
        console.info(`User registered as ${authUser.accountType}, redirecting to appropriate portal.`);
      }
      onLogin(resolvedType);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0814] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CF6DFC]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative z-10 bg-[#120D26]/90"
      >
        <div className="text-center space-y-3 mb-6 flex flex-col items-center">
          <img src="/newlogofull.png" alt="NutriGen AI" className="h-[75px] sm:h-[100px] w-auto object-contain mx-auto drop-shadow-lg" />
          <p className="text-xs text-purple-300/70 font-semibold mt-1">
            {userType === 'individual' 
              ? 'Sign in to your personal nutrition & metabolic hub' 
              : 'Sign in to the clinical practitioner & patient management portal'}
          </p>
        </div>

        {/* Dedicated Portal Selector Tabs */}
        <div className="space-y-1.5 mb-6">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/60 block px-1">
            Account Portal
          </label>
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => { setUserType('individual'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
                userType === 'individual'
                  ? 'bg-gradient-to-r from-[#CF6DFC] to-[#a84df0] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Individual</span>
            </button>
            <button
              type="button"
              onClick={() => { setUserType('professional'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
                userType === 'professional'
                  ? 'bg-gradient-to-r from-[#CF6DFC] to-[#a84df0] text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Professional</span>
            </button>
          </div>
          
          <div className="px-2 pt-1 text-[11px] text-purple-300/60 flex items-center gap-1.5">
            {userType === 'individual' ? (
              <>
                <Sparkles className="h-3 w-3 text-[#CF6DFC] shrink-0" />
                <span>Personal diet plans, macro tracking, & food scanning</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Practitioner roster, patient charts, & clinical blueprints</span>
              </>
            )}
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-purple-300/80 mb-1 block">
              {userType === 'individual' ? 'Email Address' : 'Professional Work Email'}
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={userType === 'individual' ? 'alex@example.com' : 'dr.smith@clinic.org'}
                className="input-modern w-full pl-11 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-purple-300/80">Password</label>
              <button
                type="button"
                onClick={onPasswordReset}
                className="text-[11px] font-extrabold text-[#CF6DFC] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-modern w-full pl-11 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 btn-lavender rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#CF6DFC]/30 mt-6 disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Signing In...' : userType === 'individual' ? 'Sign In to Individual Hub' : 'Sign In to Clinical Portal'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-white/10">
          <p className="text-xs text-purple-300/70 font-semibold">
            Don't have an account?{' '}
            <button onClick={onSignup} className="text-[#CF6DFC] font-extrabold hover:underline">
              Create {userType === 'individual' ? 'Individual' : 'Professional'} Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
