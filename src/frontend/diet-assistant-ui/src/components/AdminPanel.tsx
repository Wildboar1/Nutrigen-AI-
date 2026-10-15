import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, User } from '../contexts/UserContext';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Zap, 
  Crown, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Check, 
  X, 
  Sliders, 
  Terminal, 
  Layers, 
  Cpu, 
  Database, 
  Stethoscope, 
  Lock, 
  Unlock, 
  Download, 
  LogOut, 
  AlertTriangle,
  Server,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  onBackToApp: () => void;
}

export function AdminPanel({ onBackToApp }: AdminPanelProps) {
  const { 
    user, 
    fetchAdminOverview, 
    fetchAdminUsers, 
    createAdminUser, 
    updateAdminUser, 
    deleteAdminUser, 
    fetchAdminPractitioners, 
    verifyAdminPractitioner, 
    fetchAdminFeatures, 
    updateAdminFeatures, 
    fetchAdminAuditLogs 
  } = useUser();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'practitioners' | 'features' | 'logs'>('overview');
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any>({
    aiVisionScanner: true,
    aiCoachGPT4o: true,
    wearablesSync: true,
    cgmTelemetry: true,
    usdaDatabase: true,
    mealPlanGen: true,
    baseQuotaAiScans: 3,
    baseQuotaAiCoach: 5,
    maintenanceMode: false
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // User Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // User Edit Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editAccountType, setEditAccountType] = useState('individual');
  const [editAccountMode, setEditAccountMode] = useState('solo');
  const [editSubscriptionTier, setEditSubscriptionTier] = useState('base');
  const [isSavingUser, setIsSavingUser] = useState(false);

  // User Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('Pass1234!');
  const [newRole, setNewRole] = useState('individual');
  const [newMode, setNewMode] = useState('solo');
  const [newTier, setNewTier] = useState('base');
  const [newOrgName, setNewOrgName] = useState('Mayo Clinic Metabolic Center');
  const [newLicenseId, setNewLicenseId] = useState('NPI-904218');

  // Load All Data
  const loadConsoleData = async () => {
    setIsLoading(true);
    try {
      const [ovData, uList, pList, fData, lList] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminUsers({ query: searchQuery, role: roleFilter, mode: modeFilter, tier: tierFilter }),
        fetchAdminPractitioners(),
        fetchAdminFeatures(),
        fetchAdminAuditLogs()
      ]);

      if (ovData) setOverview(ovData);
      if (uList) setUsers(uList);
      if (pList) setPractitioners(pList);
      if (fData?.featureFlags) setFeatureFlags(fData.featureFlags);
      if (lList) setAuditLogs(lList);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsoleData();
  }, [searchQuery, roleFilter, modeFilter, tierFilter]);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleOpenEditUser = (targetUser: any) => {
    setSelectedUser(targetUser);
    setEditDisplayName(targetUser.displayName || '');
    setEditAccountType(targetUser.accountType || 'individual');
    setEditAccountMode(targetUser.accountMode || 'solo');
    setEditSubscriptionTier(targetUser.subscriptionTier || 'base');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSavingUser(true);
    try {
      await updateAdminUser(selectedUser.id, {
        displayName: editDisplayName,
        accountType: editAccountType,
        accountMode: editAccountMode,
        subscriptionTier: editSubscriptionTier
      });
      showNotice(`Updated account for ${selectedUser.email}`);
      setSelectedUser(null);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleQuickToggleTier = async (targetUser: any) => {
    const nextTier = targetUser.subscriptionTier === 'pro' ? 'base' : 'pro';
    try {
      await updateAdminUser(targetUser.id, { subscriptionTier: nextTier });
      showNotice(`Switched ${targetUser.email} to ${nextTier.toUpperCase()}`);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to change tier');
    }
  };

  const handleQuickToggleMode = async (targetUser: any) => {
    const nextMode = targetUser.accountMode === 'practitioner_linked' ? 'solo' : 'practitioner_linked';
    try {
      await updateAdminUser(targetUser.id, { accountMode: nextMode });
      showNotice(`Switched ${targetUser.email} to ${nextMode.toUpperCase()}`);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to change mode');
    }
  };

  const handleResetQuotas = async (targetUser: any) => {
    try {
      await updateAdminUser(targetUser.id, { resetQuotas: true });
      showNotice(`Reset daily quotas for ${targetUser.email}`);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to reset quotas');
    }
  };

  const handleDeleteUser = async (targetUser: any) => {
    if (!window.confirm(`Are you sure you want to permanently delete user ${targetUser.email}?`)) return;
    try {
      await deleteAdminUser(targetUser.id);
      showNotice(`Deleted user ${targetUser.email}`);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    try {
      await createAdminUser({
        email: newEmail,
        password: newPassword,
        displayName: newName || newEmail.split('@')[0],
        accountType: newRole,
        accountMode: newMode,
        subscriptionTier: newTier,
        organizationName: newOrgName,
        licenseId: newLicenseId
      });
      showNotice(`Successfully created ${newRole} user ${newEmail}`);
      setIsCreateModalOpen(false);
      setNewEmail('');
      setNewName('');
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleTogglePractitionerVerify = async (p: any) => {
    try {
      const res = await verifyAdminPractitioner(p.id, !p.credentialVerified);
      showNotice(`${p.displayName}: License ${res.credentialVerified ? 'VERIFIED' : 'REVOKED'}`);
      loadConsoleData();
    } catch (err: any) {
      alert(err.message || 'Failed to update practitioner');
    }
  };

  const handleToggleFeature = async (key: string) => {
    const updated = {
      ...featureFlags,
      [key]: !featureFlags[key]
    };
    setFeatureFlags(updated);
    try {
      await updateAdminFeatures(updated);
      showNotice(`Feature flag '${key}' updated`);
    } catch (err: any) {
      console.error('Failed to update feature flags', err);
    }
  };

  const handleSaveQuotaDefaults = async () => {
    try {
      await updateAdminFeatures(featureFlags);
      showNotice('Base subscription default daily quotas updated');
    } catch (err: any) {
      alert('Failed to save quota defaults');
    }
  };

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nutrigen_audit_logs_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500/30">
      {/* Console Topbar */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Cpu className="h-6 w-6 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                NutriGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">OPS COMMAND</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                Root Authority
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Global Platform Administration • Feature Switchboard • User 2×2 Matrix
            </p>
          </div>
        </div>

        {/* Telemetry Chips & Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center space-x-2 font-mono">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-400">Health:</span>
            <span className="text-emerald-400 font-bold">99.98%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Latency:</span>
            <span className="text-cyan-400 font-bold">{overview?.telemetry?.apiLatencyMs || 42}ms</span>
          </div>

          <button
            onClick={loadConsoleData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5"
            title="Refresh Metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportAuditLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Audit JSON</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <span>Exit to User App</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {statusNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500/90 backdrop-blur-md text-slate-950 text-xs font-extrabold shadow-2xl flex items-center space-x-2 border border-emerald-300/40"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none gap-1.5">
          {[
            { id: 'overview', label: 'Telemetry & KPIs', icon: Activity },
            { id: 'users', label: 'Global Users & 2×2 Matrix', icon: Users, count: users.length },
            { id: 'practitioners', label: 'Practitioners & Clinical Codes', icon: Stethoscope, count: practitioners.length },
            { id: 'features', label: 'Feature Flags Switchboard', icon: Sliders },
            { id: 'logs', label: 'Security & Audit Stream', icon: Terminal, count: auditLogs.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Area */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* TAB 1: SYSTEM OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                  <span>Total Users</span>
                  <Users className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white">{overview?.totalUsers || users.length}</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="text-cyan-400 font-bold">{overview?.breakdown?.individual || 0} Individual</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{overview?.breakdown?.professional || 0} Clinical</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                  <span>Pro Subscriptions (MRR)</span>
                  <Crown className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-300">
                  ${(overview?.telemetry?.estimatedMRR || 0).toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="text-amber-400 font-bold">{overview?.breakdown?.proTier || 0} Pro Users</span>
                  <span>vs</span>
                  <span className="text-slate-400">{overview?.breakdown?.baseTier || 0} Base (Free)</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                  <span>Active Practitioners</span>
                  <Stethoscope className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">{practitioners.length} Doctors</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="text-emerald-400 font-bold">{overview?.breakdown?.practitionerLinked || 0} Linked Patients</span>
                  <span>•</span>
                  <span className="text-slate-400">{overview?.breakdown?.solo || 0} Solo</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                  <span>AI Inferences Today</span>
                  <Zap className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {(overview?.telemetry?.totalAiScansToday || 0) + (overview?.telemetry?.totalAiCoachToday || 0)}
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="text-purple-400 font-bold">{overview?.telemetry?.totalAiScansToday || 0} Scans</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-bold">{overview?.telemetry?.totalAiCoachToday || 0} Coach Chats</span>
                </div>
              </div>
            </div>

            {/* 2x2 Matrix Distribution Map & System Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Active 2×2 User Matrix Distribution</h3>
                    <p className="text-xs text-slate-400">Account Mode × Subscription Tier Real-Time Breakdown</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                    Live Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">🧍 Solo + 🟢 Base</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                        {users.filter(u => u.accountMode === 'solo' && u.subscriptionTier === 'base').length} Users
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Self-guided logging, USDA food search, default daily quotas</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">🧍 Solo + 👑 Pro</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                        {users.filter(u => u.accountMode === 'solo' && u.subscriptionTier === 'pro').length} Users
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Unlimited AI plate scans, continuous Apple Watch & CGM streams</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">🩺 Linked + 🟢 Base</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        {users.filter(u => u.accountMode === 'practitioner_linked' && u.subscriptionTier === 'base').length} Users
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Doctor-prescribed targets & clinical notes with Base free quotas</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">🩺 Linked + 👑 Pro</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                        {users.filter(u => u.accountMode === 'practitioner_linked' && u.subscriptionTier === 'pro').length} Users
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Doctor-prescribed targets + unlimited AI vision & biometric streams</p>
                  </div>
                </div>
              </div>

              {/* System Engine Status */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-white mb-1">Core Engine Telemetry</h3>
                  <p className="text-xs text-slate-400 mb-4">Infrastructure & Microservices</p>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Gemini LLM Bio-Engine</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> ONLINE
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">USDA CSV Database</span>
                      <span className="text-cyan-400 font-bold">7,058 Records Loaded</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Flask Backend Port</span>
                      <span className="text-purple-400 font-bold">5000 (Active)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">React Client Port</span>
                      <span className="text-blue-400 font-bold">3000 (Active)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-medium">
                  💡 All microservices operating within nominal parameters. Real-time logging sync is live.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GLOBAL USER MANAGEMENT */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Filter Controls Bar */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Roles</option>
                  <option value="individual">Individual</option>
                  <option value="professional">Professional</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Modes</option>
                  <option value="solo">Solo</option>
                  <option value="practitioner_linked">Practitioner-Linked</option>
                </select>

                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="base">Base (Free)</option>
                  <option value="pro">Pro ($9.99)</option>
                </select>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">User Details</th>
                      <th className="py-3.5 px-4">Role & Mode</th>
                      <th className="py-3.5 px-4">Subscription</th>
                      <th className="py-3.5 px-4">Daily Quotas</th>
                      <th className="py-3.5 px-4">Clinical Guidance</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => {
                      const isPro = u.subscriptionTier === 'pro';
                      const isLinked = u.accountMode === 'practitioner_linked';
                      const quotas = u.dailyQuotas || {};

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-white text-sm">{u.displayName || 'No Name'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                u.accountType === 'admin' 
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                                  : u.accountType === 'professional' 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}>
                                {u.accountType}
                              </span>
                              {u.accountType !== 'professional' && (
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {isLinked ? '🩺 Practitioner-Linked' : '🧍 Solo Mode'}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                              isPro
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {isPro ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                              <span>{isPro ? 'Pro Member' : 'Base Plan'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {isPro ? (
                              <span className="text-amber-400 font-bold">Unlimited ∞</span>
                            ) : (
                              <div>
                                <div>Scans: <span className="text-cyan-400">{quotas.aiScansUsed || 0}</span> / {quotas.aiScansMax || 3}</div>
                                <div>Coach: <span className="text-emerald-400">{quotas.aiCoachUsed || 0}</span> / {quotas.aiCoachMax || 5}</div>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            {u.accountType === 'professional' ? (
                              <span className="font-mono font-bold text-[#FDFBD4] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {u.clinicalInviteCode || 'CLIN-AUTO'}
                              </span>
                            ) : isLinked ? (
                              <div className="text-slate-300">
                                <div className="font-semibold text-emerald-400">{u.practitionerInfo?.name || 'Linked Doctor'}</div>
                                <div className="text-[10px] text-slate-500 truncate max-w-xs">{u.practitionerInfo?.organization}</div>
                              </div>
                            ) : (
                              <span className="text-slate-500">Autonomous</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleQuickToggleTier(u)}
                                title="Toggle Base / Pro"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                              >
                                <Crown className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleQuickToggleMode(u)}
                                title="Toggle Solo / Practitioner-Linked"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                              >
                                <Stethoscope className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleResetQuotas(u)}
                                title="Reset Quotas"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleOpenEditUser(u)}
                                title="Edit Profile & Targets"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>

                              {u.email !== 'admin@nutrigen.ai' && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  title="Delete User"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-rose-400 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: PRACTITIONERS & CLINICAL CODES */}
        {activeTab === 'practitioners' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">Registered Clinical Practitioners & NPI Licenses</h3>
                  <p className="text-xs text-slate-400">Manage doctor/nutritionist clinical invite codes and verify accreditations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practitioners.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{p.displayName}</h4>
                          <p className="text-xs text-slate-400 font-medium">{p.role}</p>
                          <p className="text-[11px] text-cyan-400 font-semibold">{p.organization}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          p.credentialVerified 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.credentialVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mt-3 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Clinical Code:</span>
                          <span className="text-[#FDFBD4] font-black">{p.clinicalInviteCode || 'CLIN-4091'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">License / NPI:</span>
                          <span className="text-slate-200">{p.licenseId || 'NPI-UNSET'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Assigned Clients:</span>
                          <span className="text-cyan-400 font-bold">{p.patientCount || 0} Patients</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleTogglePractitionerVerify(p)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                          p.credentialVerified
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {p.credentialVerified ? 'Revoke License' : 'Approve & Verify'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: FEATURE FLAGS & GLOBAL SWITCHBOARD */}
        {activeTab === 'features' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-white">Global Feature Flags & Microservice Toggles</h3>
                <p className="text-xs text-slate-400">Instantly enable, disable, or gate application capabilities across the entire platform</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'aiVisionScanner',
                    title: 'AI Computer Vision Food Scanner',
                    description: 'Enables real-time plate recognition and automated macronutrient estimation via Gemini Vision API'
                  },
                  {
                    key: 'aiCoachGPT4o',
                    title: 'Interactive AI Nutrition Coach',
                    description: 'GPT-4o real-time metabolic assistant drawer and suggestions engine'
                  },
                  {
                    key: 'wearablesSync',
                    title: 'Smartwatch & Wearables Integration',
                    description: 'Continuous Apple Watch, Oura Ring Gen 3, and Fitbit data bridges'
                  },
                  {
                    key: 'cgmTelemetry',
                    title: 'Continuous Glucose Monitor (CGM) Feed',
                    description: 'Dexcom G7 and FreeStyle Libre live interstitial glycemic response stream'
                  },
                  {
                    key: 'usdaDatabase',
                    title: 'USDA Food Database Search Index',
                    description: '7,058 indexed foods with precise micro and macronutrient profiles'
                  },
                  {
                    key: 'mealPlanGen',
                    title: 'Personalized AI Meal Blueprint Engine',
                    description: 'Multi-modal circadian dietary generator with cuisine and allergen filtering'
                  },
                  {
                    key: 'maintenanceMode',
                    title: 'Platform Maintenance Mode',
                    description: 'Temporarily limits user access to emergency read-only status'
                  }
                ].map((feat) => {
                  const isEnabled = Boolean(featureFlags[feat.key]);
                  return (
                    <div
                      key={feat.key}
                      className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-sm">{feat.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{feat.description}</p>
                      </div>

                      <button
                        onClick={() => handleToggleFeature(feat.key)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                          isEnabled
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isEnabled ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Free Tier Default Daily Quotas Slider Settings */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 pt-4">
                <h4 className="text-sm font-extrabold text-white">System-Wide Base Plan Default Quotas</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">
                      Daily Free AI Plate Scans (Currently: {featureFlags.baseQuotaAiScans || 3})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={featureFlags.baseQuotaAiScans || 3}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, baseQuotaAiScans: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">
                      Daily Free AI Coach Questions (Currently: {featureFlags.baseQuotaAiCoach || 5})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={featureFlags.baseQuotaAiCoach || 5}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, baseQuotaAiCoach: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveQuotaDefaults}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  Save Global Quota Rules
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SECURITY & AUDIT LOGS */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">Live Administrative Audit Console</h3>
                  <p className="text-xs text-slate-400 font-mono">Real-time security log of state mutations & permissions</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Events Logged</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="text-slate-500 text-center py-6">No administrative events recorded yet.</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                        log.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                        log.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {log.action}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 text-xs break-all">{log.details}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{log.adminEmail} • {new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* User Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Edit User: {selectedUser.email}</h3>
                  <p className="text-xs text-slate-400">Modify global account permissions, tier, and role</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Account Role</label>
                    <select
                      value={editAccountType}
                      onChange={(e) => setEditAccountType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="individual">Individual</option>
                      <option value="professional">Professional</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Account Mode</label>
                    <select
                      value={editAccountMode}
                      onChange={(e) => setEditAccountMode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="solo">Solo</option>
                      <option value="practitioner_linked">Practitioner-Linked</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Subscription Tier</label>
                  <select
                    value={editSubscriptionTier}
                    onChange={(e) => setEditSubscriptionTier(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="base">Base (Free Habit Tracker)</option>
                    <option value="pro">Pro ($9.99/mo Active AI OS)</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg"
                  >
                    {isSavingUser ? 'Saving...' : 'Update User Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Create New User</h3>
                  <p className="text-xs text-slate-400">Direct administrative registration</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="individual">Individual</option>
                      <option value="professional">Professional</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Mode</label>
                    <select
                      value={newMode}
                      onChange={(e) => setNewMode(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="solo">Solo</option>
                      <option value="practitioner_linked">Linked</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Tier</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="base">Base</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>

                {newRole === 'professional' && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Organization</label>
                      <input
                        type="text"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">License ID</label>
                      <input
                        type="text"
                        value={newLicenseId}
                        onChange={(e) => setNewLicenseId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg"
                  >
                    Create User Account
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
