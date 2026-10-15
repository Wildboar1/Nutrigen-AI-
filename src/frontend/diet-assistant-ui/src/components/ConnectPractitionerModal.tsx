import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Unlink, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { API_BASE_URL } from '../config';

interface ConnectPractitionerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectPractitionerModal({ isOpen, onClose }: ConnectPractitionerModalProps) {
  const { user, connectPractitioner, disconnectPractitioner } = useUser();
  const [code, setCode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [practitionerPreview, setPractitionerPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isLinked = user?.accountMode === 'practitioner_linked' && Boolean(user?.practitionerInfo);
  const currentPractitioner = user?.practitionerInfo;

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setPractitionerPreview(null);
      setCode('');
    }
  }, [isOpen]);

  const handleLookup = async (inputCode: string) => {
    const cleanCode = inputCode.trim().toUpperCase();
    setCode(cleanCode);
    setError(null);
    setPractitionerPreview(null);

    if (cleanCode.length >= 4) {
      setIsLookingUp(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/practitioner/lookup-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: cleanCode })
        });
        const data = await response.json();
        if (response.ok && data.found) {
          setPractitionerPreview(data.practitioner);
        } else {
          setError(data.error || 'No practitioner found with this code.');
        }
      } catch (err) {
        setError('Network error searching for practitioner.');
      } finally {
        setIsLookingUp(false);
      }
    }
  };

  const handleConnect = async () => {
    if (!code) return;
    setIsConnecting(true);
    setError(null);
    try {
      const res = await connectPractitioner(code);
      setSuccessMessage(res.message || 'Connected successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to connect. Please verify code.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect from your practitioner? Your account will revert to Solo mode.')) {
      setIsConnecting(true);
      await disconnectPractitioner();
      setIsConnecting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative bg-[#130E29] text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-purple-300/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#CF6DFC] to-[#8b35c9] flex items-center justify-center shadow-lg shadow-[#CF6DFC]/30">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#CF6DFC] block">
              Professional Integration
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {isLinked ? 'Linked Practitioner' : 'Connect Your Nutritionist or Doctor'}
            </h2>
          </div>
        </div>

        {/* Already Linked View */}
        {isLinked && currentPractitioner ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Active Clinical Oversight
                </span>
                <span className="text-[11px] text-emerald-200/80">
                  Linked {new Date(currentPractitioner.linkedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white">{currentPractitioner.name}</h3>
              <p className="text-xs text-purple-200/90 font-medium">
                {currentPractitioner.role} • {currentPractitioner.organization}
              </p>
              <div className="pt-1 text-[11px] text-purple-300/80 font-mono">
                License: {currentPractitioner.licenseId}
              </div>
            </div>

            {currentPractitioner.notes && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[#CF6DFC] block mb-1">
                  Practitioner Instructions
                </span>
                <p className="text-purple-200">{currentPractitioner.notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleDisconnect}
                disabled={isConnecting}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/15 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <Unlink className="h-4 w-4" />
                <span>Disconnect Practitioner</span>
              </button>
              <button
                onClick={onClose}
                className="btn-glass px-5 py-2.5 rounded-xl text-xs font-bold text-purple-200"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Connect New Practitioner View */
          <div className="space-y-4">
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Working with a registered dietitian, nutritionist, or doctor? Enter their <strong>6-character Clinical Invite Code</strong> to grant them visibility over your food logs and receive custom prescribed targets.
            </p>

            <div>
              <label className="text-xs font-bold text-purple-300/80 mb-1.5 block">
                Practitioner Clinical Code (e.g. CLIN-XXXX)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => handleLookup(e.target.value)}
                  placeholder="Enter code (e.g. CLIN-DEMO)"
                  className="input-modern w-full font-mono text-sm tracking-widest uppercase pl-4 pr-10"
                  maxLength={12}
                />
                {isLookingUp && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#CF6DFC] animate-pulse font-bold">
                    Looking up...
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Practitioner Preview Card */}
            {practitionerPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-[#1F143D] to-purple-900/40 border border-[#CF6DFC]/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#CF6DFC]/20 text-[#CF6DFC] text-[10px] font-extrabold border border-[#CF6DFC]/30">
                    Verified Healthcare Professional
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-base font-extrabold text-white">{practitionerPreview.name}</div>
                <div className="text-xs text-purple-200 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-[#CF6DFC]" />
                  <span>{practitionerPreview.organization} • {practitionerPreview.role}</span>
                </div>
                <div className="text-[11px] text-purple-300/60 font-mono">
                  License: {practitionerPreview.licenseId}
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                onClick={handleConnect}
                disabled={!practitionerPreview || isConnecting}
                className="w-full py-3.5 btn-lavender rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#CF6DFC]/30 disabled:opacity-50"
              >
                <span>{isConnecting ? 'Linking Clinical Relationship...' : 'Confirm & Connect to Practitioner'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[11px] text-center text-purple-300/50 pt-1">
              Your existing food logs, streaks, and personal progress will remain 100% intact.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
