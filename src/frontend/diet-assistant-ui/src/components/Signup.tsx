import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  UserCircle, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SignupProps {
  onSignup: (userType: 'individual' | 'professional') => void;
  onLogin: () => void;
  onBack: () => void;
}

export function Signup({ onSignup, onLogin, onBack }: SignupProps) {
  const { register, updateUserData } = useUser();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'individual' | 'professional'>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '28',
    gender: 'female',
    weight: '68',
    height: '172',
    activityLevel: 'moderate',
    preferredCuisine: 'Mediterranean',
    calorieGoal: 2100,
    proteinGoal: 130,
    // Professional credentials state
    professionalRole: 'Certified Medical Doctor (M.D. / D.O.)',
    organizationName: '',
    licenseId: '',
    workEmail: '',
    credentialDocumentName: 'Medical_Credentials_Verified.pdf'
  });

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.displayName || !formData.email) {
        setError('Please fill in your name and email address.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      try {
        await register(
          formData.email, 
          formData.password, 
          formData.displayName,
          userType,
          userType === 'professional' ? {
            role: formData.professionalRole,
            organization: formData.organizationName || 'Metabolic Care Center',
            licenseId: formData.licenseId || 'NPI-849201938',
            workEmail: formData.workEmail || formData.email,
            credentialDocumentName: formData.credentialDocumentName
          } : undefined
        );
        setStep(3);
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try a different email.');
        return;
      }
    } else if (step === 3) {
      if (userType === 'professional') {
        if (!formData.organizationName || !formData.licenseId) {
          setError('Clinic/Hospital Name and Medical License/NPI ID are required for professional accreditation verification.');
          return;
        }
      }

      await updateUserData({
        age: Number(formData.age) || 28,
        gender: formData.gender,
        weight: Number(formData.weight) || 68,
        height: Number(formData.height) || 172,
        activity_level: formData.activityLevel,
        preferred_cuisine: formData.preferredCuisine,
        calorieGoal: formData.calorieGoal,
        proteinGoal: formData.proteinGoal,
        dietary_restrictions: [],
        health_conditions: [],
        current_mood: 'Energetic'
      });
      onSignup(userType);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0814] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CF6DFC]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative z-10 bg-[#120D26]/90"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-6 flex flex-col items-center">
          <img src="/newlogofull.png" alt="NutriGen AI" className="h-[75px] sm:h-[100px] w-auto object-contain mx-auto drop-shadow-lg" />
          <p className="text-xs text-purple-300/70 font-semibold mt-1">Join the futuristic AI nutrition operating system</p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-center max-w-xs mx-auto mb-6 px-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`h-9 w-9 rounded-2xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-all ${
                step === s
                  ? 'bg-[#CF6DFC] text-white shadow-lg shadow-[#CF6DFC]/40 scale-105'
                  : step > s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/5 text-purple-300/50 border border-white/10'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                  step > s ? 'bg-emerald-500/50' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* User Type Switcher */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-4">
                  <button
                    type="button"
                    onClick={() => setUserType('individual')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
                      userType === 'individual'
                        ? 'bg-[#CF6DFC] text-white shadow-md'
                        : 'text-purple-300/70 hover:text-white'
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Individual User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('professional')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
                      userType === 'professional'
                        ? 'bg-[#CF6DFC] text-white shadow-md'
                        : 'text-purple-300/70 hover:text-white'
                    }`}
                  >
                    <UserCircle className="h-3.5 w-3.5" />
                    <span>Dietitian / Doctor</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="input-modern w-full text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@nutrigen.ai"
                      className="input-modern w-full pl-11 text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Create Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="input-modern w-full pl-11 pr-11 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white z-10"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repeat password"
                      className="input-modern w-full pl-11 text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {userType === 'professional' ? (
                  <div className="space-y-3.5">
                    <div className="p-3 rounded-2xl bg-[#CF6DFC]/15 border border-[#CF6DFC]/30 text-[#C1BFFF] text-xs font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#CF6DFC] shrink-0" />
                      <span>Professional Accreditation & Credential Verification Required</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-300/80 mb-1 block">Professional Designation / Role</label>
                      <select
                        value={formData.professionalRole}
                        onChange={(e) => setFormData({ ...formData, professionalRole: e.target.value })}
                        className="input-modern w-full text-xs bg-[#100C1E]"
                      >
                        <option value="Certified Medical Doctor (M.D. / D.O.)">Certified Medical Doctor (M.D. / D.O.)</option>
                        <option value="Registered Clinical Dietitian (R.D. / R.D.N.)">Registered Clinical Dietitian (R.D. / R.D.N.)</option>
                        <option value="Hospital Clinical Specialist">Hospital Clinical Specialist</option>
                        <option value="Clinic & Wellness Center Administrator">Clinic & Wellness Center Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-300/80 mb-1 block">Clinic, Hospital & Organization Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. Mayo Clinic / City General Hospital"
                        className="input-modern w-full text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Medical License / NPI ID *</label>
                        <input
                          type="text"
                          required
                          value={formData.licenseId}
                          onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                          placeholder="e.g. NPI-948271038"
                          className="input-modern w-full text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Work Email</label>
                        <input
                          type="email"
                          value={formData.workEmail}
                          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                          placeholder="dr.smith@hospital.org"
                          className="input-modern w-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-300/80 mb-1 block">Work Credentials Document</label>
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-[#CF6DFC]" />
                          <span className="text-xs text-purple-200 font-medium truncate max-w-[200px]">
                            {formData.credentialDocumentName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                          Attached
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="input-modern w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="input-modern w-full text-xs bg-[#100C1E]"
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Weight (kg)</label>
                        <input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="input-modern w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-purple-300/80 mb-1 block">Height (cm)</label>
                        <input
                          type="number"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="input-modern w-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-300/80 mb-1 block">Preferred Cuisine</label>
                      <input
                        type="text"
                        value={formData.preferredCuisine}
                        onChange={(e) => setFormData({ ...formData, preferredCuisine: e.target.value })}
                        placeholder="e.g. Mediterranean, Asian, Low-Carb"
                        className="input-modern w-full text-xs"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex space-x-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-glass flex-1 py-3 rounded-2xl text-xs font-bold text-purple-300 flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <button
              type="submit"
              className="btn-lavender flex-1 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#CF6DFC]/30"
            >
              <span>{step === 3 ? 'Complete Setup & Launch' : 'Continue'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-white/10">
          <p className="text-xs text-purple-300/70 font-semibold">
            Already have an account?{' '}
            <button onClick={onLogin} className="text-[#CF6DFC] font-extrabold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
