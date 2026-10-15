import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = 'Analyzing Bio-Signals...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CF6DFC]/30 text-center flex flex-col items-center justify-center space-y-4 bg-[#120D26]/90">
      <div className="relative flex items-center justify-center">
        <div className={`animate-spin rounded-full border-2 border-t-[#CF6DFC] border-r-[#a84df0] border-b-transparent border-l-transparent ${sizeClasses[size]}`} />
        <Sparkles className="h-4 w-4 text-[#CF6DFC] absolute inset-0 m-auto animate-pulse" />
      </div>
      {message && <p className="text-xs font-extrabold text-white tracking-tight">{message}</p>}
    </div>
  );
}

export function InlineLoadingSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-t-[#CF6DFC] border-r-[#a84df0] border-b-transparent border-l-transparent ${sizeClasses[size]}`} />
  );
}