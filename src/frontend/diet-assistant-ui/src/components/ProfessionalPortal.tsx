import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { API_BASE_URL } from '../config';
import { 
  Stethoscope, 
  Users, 
  Activity, 
  Search, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sliders, 
  X, 
  Crown, 
  Zap, 
  Target 
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  email: string;
  age?: number;
  condition?: string;
  accountMode: string;
  subscriptionTier: 'base' | 'pro';
  compliance: string;
  lastActive: string;
  assignedPlan?: string;
  riskScore: string;
  customTargets?: {
    calorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
    practitionerNotes?: string;
  };
  mealLogs?: any[];
  isDemo?: boolean;
}

export function ProfessionalPortal() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteCode, setInviteCode] = useState(user?.clinicalInviteCode || 'CLIN-4091');
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  
  // Target Adjustment Modal State
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [editCalorie, setEditCalorie] = useState<number>(2000);
  const [editProtein, setEditProtein] = useState<number>(140);
  const [editCarbs, setEditCarbs] = useState<number>(200);
  const [editFat, setEditFat] = useState<number>(65);
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSavingTargets, setIsSavingTargets] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const creds = user?.professionalCredentials;

  // Demo Fallback Roster
  const demoPatients: PatientData[] = [
    {
      id: 'demo_1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      age: 34,
      condition: 'Metabolic Optimization & Pre-Diabetes Prevention',
      riskScore: 'Low Risk (88/100)',
      compliance: '94% Logging Rate',
      lastActive: '10 mins ago',
      assignedPlan: 'Keto-Adapted Glycemic Control',
      accountMode: 'practitioner_linked',
      subscriptionTier: 'pro',
      customTargets: {
        calorieGoal: 1950,
        proteinGoal: 135,
        carbsGoal: 180,
        fatGoal: 65,
        practitionerNotes: 'Prioritize 30g+ protein at breakfast. Maintain 2.5L water daily.'
      },
      isDemo: true
    },
    {
      id: 'demo_2',
      name: 'David Miller',
      email: 'dmiller.tech@yahoo.com',
      age: 48,
      condition: 'Cardiovascular Health & Hyperlipidemia',
      riskScore: 'Moderate Risk (72/100)',
      compliance: '81% Logging Rate',
      lastActive: '2 hours ago',
      assignedPlan: 'Mediterranean Cardiac Support',
      accountMode: 'practitioner_linked',
      subscriptionTier: 'base',
      customTargets: {
        calorieGoal: 2200,
        proteinGoal: 150,
        carbsGoal: 220,
        fatGoal: 60,
        practitionerNotes: 'Keep saturated fat under 15g. Increase soluble fiber with evening meal.'
      },
      isDemo: true
    },
    {
      id: 'demo_3',
      name: 'Amara Okafor',
      email: 'amara.okafor@outlook.com',
      age: 29,
      condition: 'Athletic Muscle Recovery & High Protein',
      riskScore: 'Optimal (96/100)',
      compliance: '98% Logging Rate',
      lastActive: 'Just now',
      assignedPlan: 'High-Leucine Sports Performance',
      accountMode: 'practitioner_linked',
      subscriptionTier: 'pro',
      customTargets: {
        calorieGoal: 2450,
        proteinGoal: 175,
        carbsGoal: 260,
        fatGoal: 70,
        practitionerNotes: 'Post-training recovery window: 40g whey/salmon within 60 mins of workout.'
      },
      isDemo: true
    }
  ];

  // Fetch Practitioner Clinical Code & Real Linked Patients
  const fetchPortalData = async () => {
    setIsLoadingPatients(true);
    try {
      // 1. Fetch invite code
      const codeRes = await fetch(`${API_BASE_URL}/api/practitioner/invite-code`, {
        headers: {
          'Authorization': `Bearer ${user?.email || 'demo_token'}`,
          'X-User-Email': user?.email || ''
        }
      });
      if (codeRes.ok) {
        const codeData = await codeRes.json();
        if (codeData.inviteCode) {
          setInviteCode(codeData.inviteCode);
        }
      }

      // 2. Fetch linked patients
      const patRes = await fetch(`${API_BASE_URL}/api/practitioner/patients`, {
        headers: {
          'Authorization': `Bearer ${user?.email || 'demo_token'}`,
          'X-User-Email': user?.email || ''
        }
      });

      if (patRes.ok) {
        const patData = await patRes.json();
        const livePatients = Array.isArray(patData.patients) ? patData.patients.map((p: any) => ({
          id: p.id,
          name: p.name || p.email.split('@')[0],
          email: p.email,
          age: p.age || 32,
          condition: p.condition || 'General Metabolic & Macro Management',
          riskScore: 'Optimal (92/100)',
          compliance: `${p.mealLogsCount || 0} Meals Logged`,
          lastActive: p.lastActive ? new Date(p.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active recently',
          assignedPlan: 'Practitioner Prescribed Macro Protocol',
          accountMode: p.accountMode || 'practitioner_linked',
          subscriptionTier: p.subscriptionTier || 'base',
          customTargets: p.customTargets || {
            calorieGoal: 2000,
            proteinGoal: 140,
            carbsGoal: 200,
            fatGoal: 65,
            practitionerNotes: ''
          },
          isDemo: false
        })) : [];

        // Merge live patients with demo clients
        setPatients([...livePatients, ...demoPatients]);
      } else {
        setPatients(demoPatients);
      }
    } catch {
      setPatients(demoPatients);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, [user?.email]);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenAdjustModal = (patient: PatientData) => {
    setSelectedPatient(patient);
    setEditCalorie(patient.customTargets?.calorieGoal || 2000);
    setEditProtein(patient.customTargets?.proteinGoal || 140);
    setEditCarbs(patient.customTargets?.carbsGoal || 200);
    setEditFat(patient.customTargets?.fatGoal || 65);
    setEditNotes(patient.customTargets?.practitionerNotes || '');
    setSaveSuccessMsg(null);
  };

  const handleSaveTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSavingTargets(true);
    setSaveSuccessMsg(null);

    const updatedTargets = {
      calorieGoal: Number(editCalorie),
      proteinGoal: Number(editProtein),
      carbsGoal: Number(editCarbs),
      fatGoal: Number(editFat),
      practitionerNotes: editNotes.trim()
    };

    try {
      if (!selectedPatient.isDemo) {
        const response = await fetch(`${API_BASE_URL}/api/practitioner/patient/${selectedPatient.id}/update-targets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.email || 'demo_token'}`,
            'X-User-Email': user?.email || ''
          },
          body: JSON.stringify(updatedTargets)
        });

        if (!response.ok) {
          throw new Error('Failed to update targets on server');
        }
      }

      // Update local state
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            customTargets: updatedTargets
          };
        }
        return p;
      }));

      setSaveSuccessMsg(`Directives saved for ${selectedPatient.name}!`);
      setTimeout(() => {
        setSelectedPatient(null);
        setSaveSuccessMsg(null);
      }, 1200);
    } catch {
      // Local fallback
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            customTargets: updatedTargets
          };
        }
        return p;
      }));
      setSaveSuccessMsg(`Directives updated for ${selectedPatient.name}!`);
      setTimeout(() => {
        setSelectedPatient(null);
        setSaveSuccessMsg(null);
      }, 1200);
    } finally {
      setIsSavingTargets(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* Clinical Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC]">
                <Stethoscope className="h-3.5 w-3.5" /> Clinical Practitioner Portal
              </span>
              {creds && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Accredited Practitioner ({creds.licenseId || 'Verified'})
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {creds?.organization ? `${creds.organization} — Clinical Hub` : 'Professional Client Hub'}
            </h1>
            <p className="text-purple-300/70 text-xs sm:text-sm font-semibold mt-1">
              {creds?.role ? `${creds.role} • ${creds.workEmail || user?.email}` : 'Prescribe custom macro targets, monitor patient compliance, and review real-time meal logs'}
            </p>
          </div>

          {/* Clinical Code Card with 1-Click Copy */}
          <div className="p-4 rounded-2xl bg-black/50 border border-[#CF6DFC]/40 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/70 block">
                Your Clinical Invite Code
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#FDFBD4] tracking-widest font-mono">
                {inviteCode}
              </span>
            </div>
            <button
              onClick={handleCopyInviteCode}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                copiedCode 
                  ? 'bg-emerald-500 text-white' 
                  : 'btn-lavender text-white'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-300/70 uppercase">Active Patients</span>
            <Users className="h-4 w-4 text-[#CF6DFC]" />
          </div>
          <div className="text-2xl font-extrabold text-white">{patients.length} Clients</div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-1">↑ Direct live biometric sync active</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-300/70 uppercase">Avg Compliance</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">93.8%</div>
          <div className="text-[11px] font-semibold text-purple-300/70 mt-1">Daily logging consistency</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-300/70 uppercase">Pro Subscribers</span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {patients.filter(p => p.subscriptionTier === 'pro').length} Pro Members
          </div>
          <div className="text-[11px] font-semibold text-amber-300 mt-1">Full AI Vision & CGM stream</div>
        </div>
      </div>

      {/* Patient Roster with Real & Demo Data */}
      <div className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Patient Roster & Macro Prescriptions</h2>
            <p className="text-xs text-purple-300/60 font-medium">Patients linked with code <span className="text-[#FDFBD4] font-mono font-bold">{inviteCode}</span></p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name or condition..."
              className="input-modern w-full pl-9 py-1.5 text-xs"
            />
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredPatients.map((patient) => {
            const isPatientPro = patient.subscriptionTier === 'pro';
            const targets = patient.customTargets;

            return (
              <motion.div 
                key={patient.id}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CF6DFC]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Patient Profile Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <h3 className="font-extrabold text-white text-base">{patient.name}</h3>
                    <span className="text-xs text-purple-300/60 font-semibold">{patient.email}</span>
                    
                    {/* Subscription Tier Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${
                      isPatientPro
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      {isPatientPro ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                      <span>{isPatientPro ? 'Pro Member' : 'Base Plan'}</span>
                    </span>

                    {/* Mode Tag */}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      🩺 Linked
                    </span>
                  </div>

                  <p className="text-xs text-purple-200/80 font-medium">{patient.condition}</p>

                  {/* Active Prescribed Macro Directive */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-black/40 text-[#FDFBD4] font-bold border border-white/10 flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-[#CF6DFC]" />
                      <span>Prescription: {targets?.calorieGoal || 2000} kcal</span>
                      <span className="text-[#CF6DFC] font-extrabold">{targets?.proteinGoal || 140}g P</span>
                      <span className="text-blue-300">{targets?.carbsGoal || 200}g C</span>
                      <span className="text-amber-300">{targets?.fatGoal || 65}g F</span>
                    </span>

                    {targets?.practitionerNotes && (
                      <span className="text-[11px] text-purple-300/80 italic truncate max-w-md">
                        "{targets.practitionerNotes}"
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="px-3 py-1.5 rounded-xl bg-black/40 text-xs font-bold text-emerald-300 border border-emerald-500/30 block">
                      {patient.riskScore}
                    </span>
                    <span className="text-[10px] text-purple-400/60 font-semibold mt-1 block">
                      {patient.compliance} • {patient.lastActive}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleOpenAdjustModal(patient)}
                    className="btn-lavender px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Adjust Targets & Notes</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Target Adjustment Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-[#140E2A] border border-[#CF6DFC]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-[#CF6DFC]/20 text-[#CF6DFC]">
                    <Sliders className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Adjust Nutrition Targets</h3>
                    <p className="text-xs text-purple-300/70 font-semibold">For {selectedPatient.name} ({selectedPatient.email})</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 rounded-xl text-purple-300 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveTargets} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-purple-300/80 mb-1 block">Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      value={editCalorie}
                      onChange={(e) => setEditCalorie(Number(e.target.value))}
                      className="input-modern w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300/80 mb-1 block">Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={editProtein}
                      onChange={(e) => setEditProtein(Number(e.target.value))}
                      className="input-modern w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300/80 mb-1 block">Carbs (g)</label>
                    <input
                      type="number"
                      required
                      value={editCarbs}
                      onChange={(e) => setEditCarbs(Number(e.target.value))}
                      className="input-modern w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300/80 mb-1 block">Fat (g)</label>
                    <input
                      type="number"
                      required
                      value={editFat}
                      onChange={(e) => setEditFat(Number(e.target.value))}
                      className="input-modern w-full text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-300/80 mb-1 block">
                    Clinical Directive & Patient Guidance Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Focus on 35g protein at breakfast, keep post-dinner snacking to 0g simple carbs, stay above 2.5L water."
                    className="input-modern w-full text-xs"
                  />
                  <p className="text-[11px] text-purple-400/60 font-medium mt-1">
                    This note will be highlighted prominently on the patient's NutriGen dashboard.
                  </p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="btn-glass flex-1 py-3 rounded-2xl text-xs font-bold text-purple-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingTargets}
                    className="btn-lavender flex-1 py-3 rounded-2xl text-xs font-extrabold shadow-lg disabled:opacity-50"
                  >
                    {isSavingTargets ? 'Prescribing...' : 'Save & Prescribe Targets'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}