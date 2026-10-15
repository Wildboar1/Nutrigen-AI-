import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Watch, 
  Camera, 
  Dna, 
  TestTube2, 
  FileText, 
  MapPin, 
  Brain, 
  Heart, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  Shield, 
  Eye, 
  EyeOff, 
  Gauge, 
  Activity, 
  TrendingUp, 
  BarChart3,
  Crown,
  Lock,
  Sparkles
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { UpgradeProModal } from './UpgradeProModal';

interface DataSource {
  id: string;
  name: string;
  category: string;
  icon: any;
  connected: boolean;
  isProOnly?: boolean;
  status: 'active' | 'syncing' | 'error' | 'inactive';
  lastSync: string;
  dataPoints: number;
  description: string;
  setupComplexity: 'easy' | 'medium' | 'complex';
  permissions: string[];
}

export function DataIntegration() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPermissions, setShowPermissions] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const isPro = user?.subscriptionTier === 'pro';

  const [dataSources, setDataSources] = useState<DataSource[]>([
    // Continuous Glucose Monitoring (Pro)
    {
      id: 'dexcom-g7',
      name: 'Dexcom G7 CGM',
      category: 'glucose',
      icon: Gauge,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '2 minutes ago',
      dataPoints: 1440,
      description: 'Real-time interstitial glucose monitoring with 1-minute telemetry stream',
      setupComplexity: 'medium',
      permissions: ['Health data access', 'Real-time sync', 'Historical data']
    },
    {
      id: 'freestyle-libre',
      name: 'FreeStyle Libre 3',
      category: 'glucose',
      icon: Gauge,
      connected: false,
      isProOnly: true,
      status: 'inactive',
      lastSync: 'Never',
      dataPoints: 0,
      description: 'Flash continuous glucose monitoring sensor for glycemic index mapping',
      setupComplexity: 'easy',
      permissions: ['Health data access', 'Scan data']
    },

    // Wearable Devices (Pro)
    {
      id: 'apple-watch',
      name: 'Apple Watch Ultra',
      category: 'wearable',
      icon: Watch,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '5 minutes ago',
      dataPoints: 2880,
      description: 'Continuous heart rate, HRV, active calorie burn, sleep stages, and workout telemetry',
      setupComplexity: 'easy',
      permissions: ['HealthKit access', 'Activity data', 'Heart rate', 'Sleep data']
    },
    {
      id: 'fitbit-sense',
      name: 'Fitbit Sense 2',
      category: 'wearable',
      icon: Watch,
      connected: true,
      isProOnly: true,
      status: 'syncing',
      lastSync: '1 hour ago',
      dataPoints: 1920,
      description: 'Comprehensive health, daily readiness score, and electrodermal stress tracking',
      setupComplexity: 'easy',
      permissions: ['Fitbit API access', 'Sleep data', 'Stress data', 'Activity data']
    },
    {
      id: 'oura-ring',
      name: 'Oura Ring Gen 3',
      category: 'wearable',
      icon: Heart,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '15 minutes ago',
      dataPoints: 720,
      description: 'Restorative sleep quality, resting heart rate, and circadian readiness score',
      setupComplexity: 'medium',
      permissions: ['Oura API access', 'Sleep analysis', 'HRV data', 'Temperature data']
    },

    // Food Logging (Base + Pro)
    {
      id: 'food-camera',
      name: 'AI Computer Vision Plate Scanner',
      category: 'food',
      icon: Camera,
      connected: true,
      isProOnly: false,
      status: 'active',
      lastSync: '30 minutes ago',
      dataPoints: 45,
      description: 'Computer vision food recognition and mass macronutrient estimation',
      setupComplexity: 'easy',
      permissions: ['Camera access', 'Image processing', 'Nutrition database']
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal Sync',
      category: 'food',
      icon: Smartphone,
      connected: false,
      isProOnly: false,
      status: 'inactive',
      lastSync: 'Never',
      dataPoints: 0,
      description: 'Historical diary import and legacy database cross-referencing',
      setupComplexity: 'easy',
      permissions: ['MyFitnessPal API', 'Nutrition data', 'Historical logs']
    },

    // Microbiome Analysis (Pro)
    {
      id: 'viome-gut',
      name: 'Viome Gut Intelligence',
      category: 'microbiome',
      icon: TestTube2,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '2 weeks ago',
      dataPoints: 1,
      description: 'Microbiome transcriptome sequencing and personalized microbial food scoring',
      setupComplexity: 'complex',
      permissions: ['Lab results access', 'Microbiome data', 'Recommendation sync']
    },

    // Genetic Data (Pro)
    {
      id: '23andme',
      name: '23andMe Nutrigenomics',
      category: 'genetic',
      icon: Dna,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '1 month ago',
      dataPoints: 1,
      description: 'Genomic polymorphism analysis for caffeine metabolism and lipid tolerance',
      setupComplexity: 'medium',
      permissions: ['Genetic data access', 'Health reports', 'Trait analysis']
    },

    // Environmental & Context
    {
      id: 'stress-tracking',
      name: 'Biometric Stress & Cortisol Pattern',
      category: 'environmental',
      icon: Brain,
      connected: true,
      isProOnly: true,
      status: 'active',
      lastSync: '10 minutes ago',
      dataPoints: 144,
      description: 'HRV baseline deviation and estimated nocturnal cortisol recovery',
      setupComplexity: 'medium',
      permissions: ['HRV analysis', 'Stress surveys', 'Calendar integration']
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Sources', count: dataSources.length },
    { id: 'glucose', label: 'Continuous Glucose (CGM)', count: dataSources.filter(s => s.category === 'glucose').length },
    { id: 'wearable', label: 'Wearable Devices', count: dataSources.filter(s => s.category === 'wearable').length },
    { id: 'food', label: 'Food Logging & Vision', count: dataSources.filter(s => s.category === 'food').length },
    { id: 'microbiome', label: 'Microbiome Labs', count: dataSources.filter(s => s.category === 'microbiome').length },
    { id: 'genetic', label: 'Nutrigenomics DNA', count: dataSources.filter(s => s.category === 'genetic').length }
  ];

  const filteredSources = selectedCategory === 'all' 
    ? dataSources 
    : dataSources.filter(source => source.category === selectedCategory);

  const connectedSources = dataSources.filter(s => s.connected).length;
  const totalDataPoints = dataSources.reduce((sum, s) => sum + s.dataPoints, 0);

  const handleToggleConnect = (source: DataSource) => {
    if (source.isProOnly && !isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setDataSources(prev => prev.map(s => {
      if (s.id === source.id) {
        return {
          ...s,
          connected: !s.connected,
          status: !s.connected ? 'active' : 'inactive',
          lastSync: !s.connected ? 'Just now' : 'Disconnected'
        };
      }
      return s;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'syncing':
        return <RotateCw className="h-5 w-5 text-[#CF6DFC] animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-rose-400" />;
      default:
        return <WifiOff className="h-5 w-5 text-purple-400/40" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#CF6DFC]/30 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#CF6DFC] mb-1">
              <Activity className="h-3.5 w-3.5" /> Biometric & Hardware Telemetry Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multi-Modal Data Integrations
            </h1>
            <p className="text-purple-300/70 text-xs sm:text-sm font-semibold mt-1">
              Connect CGMs, smartwatches, Oura rings, microbiome and DNA profiles for unified AI metabolic optimization
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={() => setShowPermissions(!showPermissions)}
              className="btn-glass px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2"
            >
              {showPermissions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPermissions ? 'Hide Security' : 'HIPAA Security'}</span>
            </button>
            
            {!isPro && (
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="btn-lavender px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg"
              >
                <Crown className="h-4 w-4" />
                <span>Unlock Pro Wearables</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center space-x-2 mb-1.5 text-purple-300/70">
            <Wifi className="h-4 w-4 text-[#CF6DFC]" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Connected Feeds</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{connectedSources}</div>
          <div className="text-[11px] font-semibold text-purple-300/60 mt-0.5">of {dataSources.length} supported</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center space-x-2 mb-1.5 text-purple-300/70">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Data Stream Points</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalDataPoints.toLocaleString()}</div>
          <div className="text-[11px] font-semibold text-purple-300/60 mt-0.5">sampled in last 24h</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center space-x-2 mb-1.5 text-purple-300/70">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Live Streams</span>
          </div>
          <div className="text-2xl font-extrabold text-white">6 Feeds</div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">Continuous sync active</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#C1BFFF]/20">
          <div className="flex items-center space-x-2 mb-1.5 text-purple-300/70">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider">AI Precision</span>
          </div>
          <div className="text-2xl font-extrabold text-white">96.4%</div>
          <div className="text-[11px] font-semibold text-amber-300 mt-0.5">Biomarker calibration score</div>
        </div>
      </div>

      {/* Security & HIPAA Notice */}
      {showPermissions && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-6 rounded-3xl border border-[#CF6DFC]/30 bg-purple-950/40"
        >
          <div className="flex items-start space-x-3.5">
            <Shield className="h-6 w-6 text-[#CF6DFC] shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-purple-200">
              <h3 className="font-extrabold text-white text-sm">Military-Grade Biometric Encryption & HIPAA Safeguards</h3>
              <p>• All continuous glucose and sensor telemetry is encrypted in transit and at rest with AES-256 GCM.</p>
              <p>• Your genetic and microbiome sequences are strictly siloed and never sold to third-party ad networks.</p>
              <p>• You retain full revoke authority over Apple Health, Dexcom, and Oura data bridges at any time.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              selectedCategory === cat.id
                ? 'bg-[#CF6DFC] text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-300/80 border border-white/10'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              selectedCategory === cat.id ? 'bg-black/20 text-white' : 'bg-white/10 text-purple-300'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredSources.map((source) => {
          const Icon = source.icon;
          const isLockedForBase = source.isProOnly && !isPro;

          return (
            <motion.div 
              key={source.id}
              whileHover={{ y: -3 }}
              className="glass-panel p-6 rounded-3xl border border-[#C1BFFF]/20 flex flex-col justify-between transition-all hover:border-[#CF6DFC]/40 relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${
                      source.connected ? 'bg-[#CF6DFC]/20 text-[#CF6DFC]' : 'bg-white/10 text-purple-300'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-extrabold text-white text-sm">{source.name}</h3>
                        {source.isProOnly && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-black uppercase">
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-purple-300/60 font-semibold capitalize">{source.category}</p>
                    </div>
                  </div>
                  {getStatusIcon(source.status)}
                </div>

                <p className="text-xs text-purple-200/80 font-medium mb-4 leading-relaxed">{source.description}</p>

                <div className="space-y-2 p-3.5 rounded-2xl bg-black/30 border border-white/5 mb-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300/70 font-semibold">Last Sync:</span>
                    <span className="text-white font-bold">{source.lastSync}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300/70 font-semibold">Daily Data Points:</span>
                    <span className="text-[#CF6DFC] font-bold">{source.dataPoints.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleToggleConnect(source)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md ${
                    isLockedForBase
                      ? 'bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400/30'
                      : source.connected
                      ? 'bg-white/10 hover:bg-rose-500/20 text-purple-200 hover:text-rose-300 border border-white/10 hover:border-rose-500/30'
                      : 'btn-lavender text-white'
                  }`}
                >
                  {isLockedForBase ? (
                    <>
                      <Lock className="h-4 w-4 text-amber-400" />
                      <span>Unlock with Pro</span>
                    </>
                  ) : source.connected ? (
                    <span>Disconnect Source</span>
                  ) : (
                    <span>Connect Source</span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade Pro Modal */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}