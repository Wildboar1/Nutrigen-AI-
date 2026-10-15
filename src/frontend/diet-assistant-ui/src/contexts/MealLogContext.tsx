import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUser } from './UserContext';

export interface MealLogItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  source: 'camera' | 'search' | 'quick-add';
  loggedAt: string;
}

interface MealLogContextType {
  mealLogs: MealLogItem[];
  addMealLog: (meal: Omit<MealLogItem, 'id' | 'loggedAt'>) => void;
  clearMealLogs: () => void;
  totalCaloriesToday: number;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

function isSameDayIso(iso: string, compareDate: Date) {
  const d = new Date(iso);
  return (
    d.getFullYear() === compareDate.getFullYear() &&
    d.getMonth() === compareDate.getMonth() &&
    d.getDate() === compareDate.getDate()
  );
}

export function MealLogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const storageKey = useMemo(() => `nutrigen_ai_meal_logs_${user?.uid || 'guest'}`, [user?.uid]);
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setMealLogs([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setMealLogs(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMealLogs([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(mealLogs));
  }, [mealLogs, storageKey]);

  const addMealLog = (meal: Omit<MealLogItem, 'id' | 'loggedAt'>) => {
    setMealLogs(prev => [
      {
        ...meal,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        loggedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const clearMealLogs = () => {
    setMealLogs([]);
  };

  const totalCaloriesToday = useMemo(() => {
    const now = new Date();
    return mealLogs
      .filter(item => isSameDayIso(item.loggedAt, now))
      .reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  }, [mealLogs]);

  return (
    <MealLogContext.Provider
      value={{
        mealLogs,
        addMealLog,
        clearMealLogs,
        totalCaloriesToday,
      }}
    >
      {children}
    </MealLogContext.Provider>
  );
}

export function useMealLogs() {
  const context = useContext(MealLogContext);
  if (!context) {
    throw new Error('useMealLogs must be used within a MealLogProvider');
  }
  return context;
}
