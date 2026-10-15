import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, DIET_ENDPOINTS } from '../config';

const AUTH_API_BASE_URL = `${API_BASE_URL}/api`;

const getApiErrorMessage = async (response: Response, fallback: string) => {
  try {
    const error = await response.json();
    if (error?.error && typeof error.error === 'string') {
      return error.error;
    }
  } catch {
    // Ignore JSON parse errors and use fallback message.
  }
  return fallback;
};

const formatNetworkError = (error: unknown, fallback: string) => {
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return 'Cannot connect to API server at http://localhost:5000. Please start backend and try again.';
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export interface UserData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  dietary_restrictions: string[];
  health_conditions: string[];
  preferred_cuisine: string;
  current_mood: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  photoURL?: string;
}

export interface DietMeal {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
  ai_suggestion?: string | null;
  health_warnings?: Array<{ condition: string; reason: string }>;
}

export interface DietPlan {
  diet_plan: DietMeal[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number; sugar: number };
  recommendation: string | null;
  explanation: string | null;
  generatedAt: string;
}

export interface ProfessionalCredentials {
  role: string;
  organization: string;
  licenseId: string;
  workEmail: string;
  credentialDocumentName?: string;
  credentialVerified: boolean;
  verifiedAt?: string;
}

export interface DailyQuotas {
  aiScansUsed: number;
  aiScansMax: number;
  aiCoachUsed: number;
  aiCoachMax: number;
  mealPlansUsed: number;
  mealPlansMax: number;
  resetDate: string;
}

export interface PractitionerInfo {
  id: string;
  name: string;
  organization: string;
  role: string;
  licenseId: string;
  workEmail?: string;
  linkedAt: string;
  notes?: string;
  customTargets?: {
    calorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
    practitionerNotes?: string;
  } | null;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  accountType?: 'individual' | 'professional' | 'admin';
  accountMode?: 'solo' | 'practitioner_linked';
  practitionerId?: string | null;
  practitionerInfo?: PractitionerInfo | null;
  subscriptionTier?: 'base' | 'pro';
  subscriptionValidUntil?: string | null;
  dailyQuotas?: DailyQuotas;
  clinicalInviteCode?: string | null;
  professionalCredentials?: ProfessionalCredentials | null;
  userData?: UserData;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isDarkMode: boolean;
  hasCompletedForm: boolean;
  dietPlan: DietPlan | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string, 
    password: string, 
    displayName: string, 
    accountType?: 'individual' | 'professional' | 'admin',
    professionalData?: Partial<ProfessionalCredentials>
  ) => Promise<User>;
  verifyProfessional: (professionalData: Partial<ProfessionalCredentials>) => Promise<void>;
  connectPractitioner: (code: string) => Promise<{ success: boolean; message: string }>;
  disconnectPractitioner: () => Promise<void>;
  upgradeSubscription: (tier: 'base' | 'pro') => Promise<void>;
  consumeQuota: (quotaType: 'aiScans' | 'aiCoach' | 'mealPlans') => Promise<{ allowed: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  getUserData: () => UserData | undefined;
  generateDietPlan: (profileData: Partial<UserData>) => Promise<DietPlan | null>;
  loadDietPlan: () => Promise<void>;
  // Admin Methods
  fetchAdminOverview: () => Promise<any>;
  fetchAdminUsers: (filters?: { query?: string; role?: string; mode?: string; tier?: string }) => Promise<any[]>;
  createAdminUser: (userData: any) => Promise<any>;
  updateAdminUser: (userId: string, data: any) => Promise<any>;
  deleteAdminUser: (userId: string) => Promise<any>;
  fetchAdminPractitioners: () => Promise<any[]>;
  verifyAdminPractitioner: (practitionerId: string, verified?: boolean) => Promise<any>;
  fetchAdminFeatures: () => Promise<any>;
  updateAdminFeatures: (flags: any) => Promise<any>;
  fetchAdminAuditLogs: () => Promise<any[]>;
  enterAdminMode: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(() => {
    try {
      const saved = localStorage.getItem('nutrigen_ai_diet_plan');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Check if user has completed the initial form
  const hasCompletedForm = user?.userData !== undefined;

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call backend login API
      const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response, 'Login failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { user: userData, token } = data;

      const mockUser: User = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        accountType: userData.accountType || 'individual',
        professionalCredentials: userData.professionalCredentials || null,
        userData: userData.userData,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', token);
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(formatNetworkError(error, 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    displayName: string,
    accountType: 'individual' | 'professional' | 'admin' = 'individual',
    professionalData?: Partial<ProfessionalCredentials>
  ): Promise<User> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          displayName,
          accountType,
          professionalRole: professionalData?.role,
          organizationName: professionalData?.organization,
          licenseId: professionalData?.licenseId,
          workEmail: professionalData?.workEmail || email,
          credentialDocumentName: professionalData?.credentialDocumentName || 'Medical_Credentials.pdf'
        }),
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response, 'Registration failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { user: userData, token } = data;

      const mockUser: User = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        accountType: userData.accountType || accountType,
        professionalCredentials: userData.professionalCredentials || (accountType === 'professional' ? {
          role: professionalData?.role || 'Certified Doctor',
          organization: professionalData?.organization || 'Clinic',
          licenseId: professionalData?.licenseId || 'LIC-VERIFIED',
          workEmail: professionalData?.workEmail || email,
          credentialDocumentName: professionalData?.credentialDocumentName || 'Medical_License.pdf',
          credentialVerified: true
        } : null),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', token);
      
      localStorage.removeItem(`progress_${mockUser.uid}`);
      localStorage.removeItem(`userData_${email}`);
      return mockUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(formatNetworkError(error, 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyProfessional = async (professionalData: Partial<ProfessionalCredentials>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/auth/verify-professional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          professionalRole: professionalData.role,
          organizationName: professionalData.organization,
          licenseId: professionalData.licenseId,
          workEmail: professionalData.workEmail,
          credentialDocumentName: professionalData.credentialDocumentName
        })
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response, 'Professional verification failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (user) {
        const updatedUser: User = {
          ...user,
          accountType: 'professional',
          professionalCredentials: data.professionalCredentials
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectPractitioner = async (code: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/patient/connect-practitioner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response, 'Failed to link practitioner');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, message: data.message || 'Connected successfully!' };
    } catch (error: any) {
      console.error('Connect practitioner error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectPractitioner = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/patient/disconnect-practitioner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Disconnect practitioner error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeSubscription = async (tier: 'base' | 'pro') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response, 'Failed to update subscription');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error: any) {
      console.error('Upgrade subscription error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const consumeQuota = async (quotaType: 'aiScans' | 'aiCoach' | 'mealPlans'): Promise<{ allowed: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/subscription/consume-quota`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quotaType })
      });

      const data = await response.json();
      if (response.ok && data.allowed) {
        if (user && data.dailyQuotas) {
          const updatedUser: User = {
            ...user,
            dailyQuotas: data.dailyQuotas
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return { allowed: true };
      } else {
        return { allowed: false, error: data.error || 'Daily limit reached.' };
      }
    } catch (error) {
      // Allow fallback if offline
      return { allowed: true };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Call backend logout API
        await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all user-related data including progress
      if (user) {
        localStorage.removeItem(`progress_${user.uid}`);
        localStorage.removeItem(`userData_${user.email}`);
      }
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      // Navigation is handled by App component
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    const storedUser = localStorage.getItem('user');
    const baseUser = user || (storedUser ? JSON.parse(storedUser) : null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Call backend update API
        const response = await fetch(`${AUTH_API_BASE_URL}/user/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          const mergedData = result.user.userData;
          
          const updatedUser = {
            uid: result.user.uid ?? baseUser?.uid,
            email: result.user.email ?? baseUser?.email,
            displayName: result.user.displayName ?? baseUser?.displayName ?? null,
            photoURL: result.user.photoURL ?? baseUser?.photoURL ?? null,
            userData: mergedData,
          };
          
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (updatedUser.email) {
            localStorage.setItem(`userData_${updatedUser.email}`, JSON.stringify(mergedData));
          }
          
          // Don't navigate automatically - let the component handle it
          return;
        }
      }
    } catch (error) {
      console.error('Update user data error:', error);
    }
    
    // Fallback to local storage if API call fails
    if (!baseUser) {
      return;
    }

    const mergedData = {
      ...baseUser.userData,
      ...data,
    } as UserData;
    
    const updatedUser = {
      ...baseUser,
      userData: mergedData,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem(`userData_${updatedUser.email}`, JSON.stringify(mergedData));
  };

  const getUserData = () => {
    return user?.userData;
  };

  /** Call /api/generate-diet and store the result in state + localStorage */
  const generateDietPlan = useCallback(async (profileData: Partial<UserData>): Promise<DietPlan | null> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(DIET_ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          age:                   profileData.age,
          gender:                profileData.gender,
          weight:                profileData.weight,
          height:                profileData.height,
          activity_level:        profileData.activity_level,
          dietary_restrictions:  profileData.dietary_restrictions || [],
          health_conditions:     profileData.health_conditions    || [],
          preferred_cuisine:     profileData.preferred_cuisine    || '',
          current_mood:          profileData.current_mood         || '',
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('generate-diet error:', err);
        return null;
      }
      const plan: DietPlan = await response.json();
      setDietPlan(plan);
      localStorage.setItem('nutrigen_ai_diet_plan', JSON.stringify(plan));
      return plan;
    } catch (error) {
      console.error('generateDietPlan network error:', error);
      return null;
    }
  }, []);

  /** Load the last saved diet plan from the backend for the current user */
  const loadDietPlan = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await fetch(DIET_ENDPOINTS.GET_PLAN, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.dietPlan) {
        setDietPlan(data.dietPlan);
        localStorage.setItem('nutrigen_ai_diet_plan', JSON.stringify(data.dietPlan));
      }
    } catch (error) {
      console.error('loadDietPlan error:', error);
    }
  }, []);

  /** Admin Methods */
  const fetchAdminOverview = useCallback(async (): Promise<any> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/admin/overview`, {
        headers: {
          'Authorization': `Bearer ${token || 'admin_token'}`,
          'X-User-Email': user?.email || 'admin@nutrigen.ai'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.overview;
      }
      return null;
    } catch (e) {
      console.error('fetchAdminOverview error:', e);
      return null;
    }
  }, [user?.email]);

  const fetchAdminUsers = useCallback(async (filters?: { query?: string; role?: string; mode?: string; tier?: string }): Promise<any[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.mode) params.append('mode', filters.mode);
      if (filters?.tier) params.append('tier', filters.tier);

      const response = await fetch(`${AUTH_API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token || 'admin_token'}`,
          'X-User-Email': user?.email || 'admin@nutrigen.ai'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.users || [];
      }
      return [];
    } catch (e) {
      console.error('fetchAdminUsers error:', e);
      return [];
    }
  }, [user?.email]);

  const createAdminUser = useCallback(async (userData: any): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${AUTH_API_BASE_URL}/admin/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || 'admin_token'}`,
        'X-User-Email': user?.email || 'admin@nutrigen.ai'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create user');
    }
    return response.json();
  }, [user?.email]);

  const updateAdminUser = useCallback(async (userId: string, data: any): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${AUTH_API_BASE_URL}/admin/users/${userId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || 'admin_token'}`,
        'X-User-Email': user?.email || 'admin@nutrigen.ai'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update user');
    }
    return response.json();
  }, [user?.email]);

  const deleteAdminUser = useCallback(async (userId: string): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${AUTH_API_BASE_URL}/admin/users/${userId}/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || 'admin_token'}`,
        'X-User-Email': user?.email || 'admin@nutrigen.ai'
      }
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete user');
    }
    return response.json();
  }, [user?.email]);

  const fetchAdminPractitioners = useCallback(async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${AUTH_API_BASE_URL}/admin/practitioners`, {
        headers: {
          'Authorization': `Bearer ${token || 'admin_token'}`,
          'X-User-Email': user?.email || 'admin@nutrigen.ai'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.practitioners || [];
      }
      return [];
    } catch (e) {
      console.error('fetchAdminPractitioners error:', e);
      return [];
    }
  }, [user?.email]);

  const verifyAdminPractitioner = useCallback(async (practitionerId: string, verified?: boolean): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${AUTH_API_BASE_URL}/admin/practitioners/${practitionerId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || 'admin_token'}`,
        'X-User-Email': user?.email || 'admin@nutrigen.ai'
      },
      body: JSON.stringify({ verified })
    });
    return response.json();
  }, [user?.email]);

  const fetchAdminFeatures = useCallback(async (): Promise<any> => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/admin/features`);
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (e) {
      console.error('fetchAdminFeatures error:', e);
      return null;
    }
  }, []);

  const updateAdminFeatures = useCallback(async (flags: any): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${AUTH_API_BASE_URL}/admin/features/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || 'admin_token'}`,
        'X-User-Email': user?.email || 'admin@nutrigen.ai'
      },
      body: JSON.stringify(flags)
    });
    return response.json();
  }, [user?.email]);

  const fetchAdminAuditLogs = useCallback(async (): Promise<any[]> => {
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/admin/audit-logs`);
      if (response.ok) {
        const data = await response.json();
        return data.auditLogs || [];
      }
      return [];
    } catch (e) {
      console.error('fetchAdminAuditLogs error:', e);
      return [];
    }
  }, []);

  const enterAdminMode = useCallback(async (): Promise<void> => {
    const adminUser: User = {
      uid: 'master-admin-root',
      email: 'admin@nutrigen.ai',
      displayName: 'Master Administrator',
      photoURL: null,
      accountType: 'admin',
      accountMode: 'solo',
      practitionerId: null,
      practitionerInfo: null,
      subscriptionTier: 'pro',
      clinicalInviteCode: 'ADMIN-ROOT',
      professionalCredentials: {
        role: 'Chief Medical & Technical Operations Director',
        organization: 'NutriGen AI Operations Command',
        licenseId: 'ADMIN-NPI-0001',
        workEmail: 'admin@nutrigen.ai',
        credentialVerified: true
      },
      dailyQuotas: {
        aiScansUsed: 0,
        aiScansMax: 9999,
        aiCoachUsed: 0,
        aiCoachMax: 9999,
        mealPlansUsed: 0,
        mealPlansMax: 9999,
        resetDate: new Date().toISOString().split('T')[0]
      }
    };
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    localStorage.setItem('authToken', 'master_admin_session_token');
    localStorage.setItem('nutrigen_ai_session', 'master_admin_session_token');
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isDarkMode,
        hasCompletedForm,
        dietPlan,
        login,
        register,
        verifyProfessional,
        connectPractitioner,
        disconnectPractitioner,
        upgradeSubscription,
        consumeQuota,
        logout,
        toggleTheme,
        updateUserData,
        getUserData,
        generateDietPlan,
        loadDietPlan,
        fetchAdminOverview,
        fetchAdminUsers,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        fetchAdminPractitioners,
        verifyAdminPractitioner,
        fetchAdminFeatures,
        updateAdminFeatures,
        fetchAdminAuditLogs,
        enterAdminMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 