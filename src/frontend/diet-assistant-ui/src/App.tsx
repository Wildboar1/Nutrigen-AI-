import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from './components/Dashboard';
import { MealPlanning } from './components/MealPlanning';
import { ProfessionalPortal } from './components/ProfessionalPortal';
import { FoodLogging } from './components/FoodLogging';
import { RecipeManagement } from './components/RecipeManagement';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { PasswordReset } from './components/PasswordReset';
import { UserProfile } from './components/UserProfile';
import { OnboardingForm } from './components/OnboardingForm';
import { UserSettings } from './components/UserSettings';
import { AICoachModal } from './components/AICoachModal';
import { CommandPalette } from './components/CommandPalette';
import { AdminPanel } from './components/AdminPanel';
import { useUser } from './contexts/UserContext';
import { 
  User as UserIcon, 
  Menu, 
  Settings, 
  Search, 
  Bot,
  LogOut,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './components/ui/sheet';

type ViewType = 'dashboard' | 'meals' | 'professional' | 'profile' | 'settings' | 'admin';
type AppState = 'splash' | 'onboarding' | 'login' | 'signup' | 'passwordReset' | 'userInfo' | 'authenticated';

export default function App() {
  const { user, logout } = useUser();
  const [appState, setAppState] = useState<AppState>('splash');
  
  // Account type is strictly locked to authenticated user's accountType
  const userType: 'individual' | 'professional' | 'admin' = (user?.accountType as any) === 'admin' ? 'admin' : user?.accountType === 'professional' ? 'professional' : 'individual';
  
  // Set default view based on role
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showFoodLogging, setShowFoodLogging] = useState(false);
  const [showRecipeManagement, setShowRecipeManagement] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // AI Coach & Command Palette State
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [aiCoachInitialPrompt, setAiCoachInitialPrompt] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync default view whenever user authentication or accountType changes
  useEffect(() => {
    if (user?.accountType === 'admin') {
      setCurrentView('admin');
    } else if (user?.accountType === 'professional') {
      setCurrentView('professional');
    } else if (user?.accountType === 'individual') {
      setCurrentView('dashboard');
    }
  }, [user?.accountType]);

  // Enhanced view change handler with role-based guard
  const handleViewChange = (view: ViewType) => {
    if (view === 'admin') {
      if (userType !== 'admin') {
        return;
      }
      setCurrentView('admin');
      setShowFoodLogging(false);
      setShowRecipeManagement(false);
      return;
    }
    if (userType === 'individual' && view === 'professional') {
      setCurrentView('dashboard');
      return;
    }
    if (userType === 'professional' && (view === 'dashboard' || view === 'meals')) {
      setCurrentView('professional');
      return;
    }
    setCurrentView(view);
    setShowFoodLogging(false);
    setShowRecipeManagement(false);
  };

  const handleOpenAICoach = (prompt?: string) => {
    setAiCoachInitialPrompt(prompt || '');
    setIsAICoachOpen(true);
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const existingSession = localStorage.getItem('nutrigen_ai_session');
      const hasSeenOnboardingSession = sessionStorage.getItem('nutrigen_ai_onboarding_seen');

      if (existingSession && hasSeenOnboardingSession === 'true') {
        setAppState('authenticated');
      }
    };

    const timer = setTimeout(checkExistingSession, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = () => {
    const hasSeenOnboardingSession = sessionStorage.getItem('nutrigen_ai_onboarding_seen');
    if (hasSeenOnboardingSession === 'true') {
      const existingSession = localStorage.getItem('nutrigen_ai_session');
      if (existingSession) {
        setAppState('authenticated');
      } else {
        setAppState('login');
      }
    } else {
      setAppState('onboarding');
    }
  };

  const handleWelcomeOnboardingComplete = () => {
    sessionStorage.setItem('nutrigen_ai_onboarding_seen', 'true');
    const existingSession = localStorage.getItem('nutrigen_ai_session');
    if (existingSession) {
      setAppState('authenticated');
    } else {
      setAppState('login');
    }
  };

  const handleUserInfoComplete = () => {
    setAppState('authenticated');
  };

  const handleLogin = (resolvedUserType: 'individual' | 'professional' | 'admin') => {
    const sessionData = {
      userType: resolvedUserType,
      timestamp: Date.now()
    };
    localStorage.setItem('nutrigen_ai_session', JSON.stringify(sessionData));
    
    if (resolvedUserType === 'admin') {
      setCurrentView('admin');
      setAppState('authenticated');
    } else if (resolvedUserType === 'professional') {
      setCurrentView('professional');
      setAppState('authenticated');
    } else {
      setCurrentView('dashboard');
      if (!user?.userData || !user.userData.age || !user.userData.weight) {
        setAppState('userInfo');
      } else {
        setAppState('authenticated');
      }
    }
  };

  const handleSignup = (resolvedUserType: 'individual' | 'professional') => {
    const sessionData = {
      userType: resolvedUserType,
      timestamp: Date.now()
    };
    localStorage.setItem('nutrigen_ai_session', JSON.stringify(sessionData));
    if (resolvedUserType === 'professional') {
      setCurrentView('professional');
    } else {
      setCurrentView('dashboard');
    }
    setAppState('authenticated');
  };

  const handleLogout = async () => {
    localStorage.removeItem('nutrigen_ai_session');
    await logout();
    setAppState('login');
  };

  const goToSignup = () => setAppState('signup');
  const goToLogin = () => setAppState('login');
  const goToPasswordReset = () => setAppState('passwordReset');
  const goBackToOnboarding = () => setAppState('onboarding');

  const renderCurrentView = () => {
    if (showFoodLogging && userType === 'individual') {
      return <FoodLogging onBack={() => setShowFoodLogging(false)} />;
    }

    if (showRecipeManagement && userType === 'individual') {
      return (
        <ErrorBoundary>
          <RecipeManagement onBack={() => setShowRecipeManagement(false)} />
        </ErrorBoundary>
      );
    }

    // Admin Console View (Dedicated Executive Layout - Admin Only)
    if (currentView === 'admin') {
      if (userType !== 'admin') {
        return userType === 'professional' ? <ProfessionalPortal /> : (
          <Dashboard 
            onLogFood={() => setShowFoodLogging(true)} 
            onOpenAICoach={handleOpenAICoach}
            onNavigateMealPlan={() => handleViewChange('meals')}
          />
        );
      }
      return (
        <AdminPanel 
          onBackToApp={() => setCurrentView('dashboard')} 
        />
      );
    }

    // Strict role-based rendering
    if (userType === 'professional') {
      switch (currentView) {
        case 'professional':
          return <ProfessionalPortal />;
        case 'profile':
          return <UserProfile userType="professional" />;
        case 'settings':
          return <UserSettings />;
        default:
          return <ProfessionalPortal />;
      }
    }

    // Individual Account Views
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onLogFood={() => setShowFoodLogging(true)} 
            onOpenAICoach={handleOpenAICoach}
            onNavigateMealPlan={() => handleViewChange('meals')}
          />
        );
      case 'meals':
        return (
          <MealPlanning 
            onScanFood={() => setShowFoodLogging(true)} 
            onRecipeBrowser={() => setShowRecipeManagement(true)}
            onOpenAICoach={handleOpenAICoach}
          />
        );
      case 'profile':
        return <UserProfile userType="individual" />;
      case 'settings':
        return <UserSettings />;
      default:
        return (
          <Dashboard 
            onLogFood={() => setShowFoodLogging(true)} 
            onOpenAICoach={handleOpenAICoach}
            onNavigateMealPlan={() => handleViewChange('meals')}
          />
        );
    }
  };

  // Render different screens based on app state
  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleWelcomeOnboardingComplete} />;
  }

  if (appState === 'userInfo') {
    return <OnboardingForm onComplete={handleUserInfoComplete} />;
  }

  if (appState === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={goToSignup}
        onBack={goBackToOnboarding}
        onPasswordReset={goToPasswordReset}
      />
    );
  }

  if (appState === 'passwordReset') {
    return (
      <PasswordReset
        onBack={goToLogin}
        onComplete={goToLogin}
      />
    );
  }

  if (appState === 'signup') {
    return (
      <Signup
        onSignup={handleSignup}
        onLogin={goToLogin}
        onBack={goBackToOnboarding}
      />
    );
  }

  // Main authenticated application
  return (
    <div className="min-h-screen bg-[#0b0814] text-[#f1edfd] flex flex-col font-sans w-full relative">
      {/* Floating Glass Top Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-2 bg-[#0b0814]/80 backdrop-blur-md">
        <div className="glass-panel rounded-3xl border border-[#C1BFFF]/20 shadow-2xl px-4 sm:px-6 py-2 flex justify-between items-center bg-[#130E29]/80 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-2xl text-purple-300 hover:bg-white/10 transition-colors" title="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 border-r border-[#C1BFFF]/20 bg-[#0F0B21]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Access navigation options for NutriGen AI
                </SheetDescription>
                <Navigation 
                  currentView={currentView} 
                  onViewChange={(view) => {
                    handleViewChange(view);
                    setIsMobileMenuOpen(false);
                  }}
                  userType={userType}
                  isMobile={true}
                />
              </SheetContent>
            </Sheet>

            {/* Brand Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleViewChange(userType === 'professional' ? 'professional' : 'dashboard')}>
              <img src="/newlogofull.png" alt="NutriGen AI" className="h-[45px] sm:h-[50px] w-auto object-contain" />
            </div>

            {/* Cmd + K Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-purple-300/70 hover:border-[#CF6DFC]/40 hover:text-white transition-all shadow-xs"
            >
              <Search className="h-3.5 w-3.5 text-[#CF6DFC]" />
              <span className="font-semibold">Search or commands...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-purple-200">Cmd K</kbd>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Ask AI Coach Floating Button (Individual Only) */}
            {userType === 'individual' && (
              <button
                onClick={() => handleOpenAICoach()}
                className="btn-glass px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md"
              >
                <Bot className="h-3.5 w-3.5 text-[#CF6DFC]" />
                <span className="hidden sm:inline">Ask AI Coach</span>
              </button>
            )}

            {/* Strict Role Badge (Displays account type cleanly without cross-switching) */}
            {userType === 'professional' ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-purple-950/40 border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="hidden md:inline font-extrabold">
                  {user?.professionalCredentials?.role || 'Clinical Professional'}
                </span>
                <span className="md:hidden">Practitioner</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-purple-900/40 border border-[#CF6DFC]/30 text-xs font-bold text-purple-200 shadow-xs">
                <UserIcon className="h-3.5 w-3.5 text-[#CF6DFC] shrink-0" />
                <span className="hidden sm:inline">Individual Account</span>
                <span className="sm:hidden">Individual</span>
              </div>
            )}

            {/* Dedicated Admin Console Quick Launcher (Admin Only) */}
            {userType === 'admin' && (
              <button
                onClick={() => handleViewChange(currentView === 'admin' ? 'dashboard' : 'admin')}
                title="Admin Command Console"
                className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-md ${
                  currentView === 'admin'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border border-cyan-300 ring-2 ring-cyan-400/40 shadow-cyan-500/20'
                    : 'bg-[#0f172a]/90 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950/50 hover:border-cyan-400 hover:text-cyan-200'
                }`}
              >
                <Cpu className={`h-3.5 w-3.5 ${currentView === 'admin' ? 'animate-pulse text-black' : 'text-cyan-400'}`} />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => handleViewChange('settings')}
              title="Settings"
              className={`p-2 rounded-2xl text-purple-300/80 hover:bg-white/10 transition-all ${
                currentView === 'settings' ? 'bg-[#CF6DFC]/20 text-white border border-[#CF6DFC]/40' : ''
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>
            
            {/* Sign Out */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-2xl text-purple-300/80 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sidebar */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* Desktop Floating Navigation Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-20 self-start z-30">
          <Navigation 
            currentView={currentView} 
            onViewChange={handleViewChange}
            userType={userType}
            isMobile={false}
          />
        </div>

        {/* Dynamic Main View Area with Framer Motion Transition */}
        <main className="flex-1 p-3 sm:p-6 min-w-0 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (showFoodLogging ? '_food' : '') + (showRecipeManagement ? '_recipe' : '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global ChatGPT-Style AI Coach Modal */}
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        initialPrompt={aiCoachInitialPrompt}
      />

      {/* Global Cmd + K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={handleViewChange}
        onOpenLogFood={() => setShowFoodLogging(true)}
        onOpenAICoach={handleOpenAICoach}
        userType={userType}
      />
    </div>
  );
}
