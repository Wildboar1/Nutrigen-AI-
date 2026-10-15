import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, FileText, CheckCircle2, Lock, Building2, Stethoscope, AlertTriangle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface ProfessionalVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProfessionalVerificationModal({ isOpen, onClose, onSuccess }: ProfessionalVerificationModalProps) {
  const { verifyProfessional, user } = useUser();
  const [role, setRole] = useState('Certified Medical Doctor (M.D. / D.O.)');
  const [organization, setOrganization] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [workEmail, setWorkEmail] = useState(user?.email || '');
  const [fileName, setFileName] = useState('Medical_License_Verification.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!organization.trim() || !licenseId.trim()) {
      setError('Hospital/Clinic Name and License/NPI ID are required for professional accreditation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyProfessional({
        role,
        organization,
        licenseId,
        workEmail,
        credentialDocumentName: fileName
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-2xl relative bg-[#120D26]/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-[#CF6DFC]/20 text-[#CF6DFC] border border-[#CF6DFC]/30">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Professional Credential Verification</h3>
                <p className="text-xs text-purple-300/70 font-semibold">Accreditation required for Clinical & Professional Portal access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-purple-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-purple-300/80 mb-1 block">Professional Role / Designation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-modern w-full text-xs bg-[#100C1E]"
              >
                <option value="Certified Medical Doctor (M.D. / D.O.)">Certified Medical Doctor (M.D. / D.O.)</option>
                <option value="Registered Clinical Dietitian (R.D. / R.D.N.)">Registered Clinical Dietitian (R.D. / R.D.N.)</option>
                <option value="Hospital Clinical Specialist">Hospital Clinical Specialist</option>
                <option value="Clinic & Wellness Center Administrator">Clinic & Wellness Center Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300/80 mb-1 block">Hospital, Clinic or Health Organization *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
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
                  value={licenseId}
                  onChange={(e) => setLicenseId(e.target.value)}
                  placeholder="e.g. NPI-849201938"
                  className="input-modern w-full text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-300/80 mb-1 block">Official Work Email</label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="input-modern w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300/80 mb-1 block">Credential Document / License Scan</label>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-[#CF6DFC]" />
                  <span className="text-xs text-purple-200 font-medium truncate max-w-[220px]">
                    {fileName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </div>
            </div>

            <div className="pt-3 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-glass flex-1 py-3 rounded-2xl text-xs font-bold text-purple-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lavender flex-1 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#CF6DFC]/30"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isSubmitting ? 'Verifying...' : 'Verify & Access Portal'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
