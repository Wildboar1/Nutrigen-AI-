import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number; // Current value (e.g. 1450 or 68%)
  max?: number; // Max goal value (default 100)
  size?: number; // Circle SVG size (default 110)
  strokeWidth?: number; // Stroke thickness (default 9)
  gradientId: string;
  gradientColors: [string, string]; // [startColor, endColor]
  label: string;
  unit?: string;
  subtext?: string;
  icon?: React.ElementType;
}

export function CircularProgress({
  value,
  max = 100,
  size = 110,
  strokeWidth = 9,
  gradientId,
  gradientColors,
  label,
  unit = '',
  subtext,
  icon: Icon,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Animated display value for smooth count-up
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayVal(value);
        clearInterval(timer);
      } else {
        setDisplayVal(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center p-3 relative group">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>

          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(193, 191, 255, 0.12)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Foreground Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center inset-0">
          {Icon && <Icon className="h-4 w-4 mb-0.5" style={{ color: gradientColors[0] }} />}
          <span className="text-lg font-extrabold text-white tracking-tight leading-none">
            {displayVal.toLocaleString()}
            {unit && <span className="text-xs font-semibold text-purple-300/80 ml-0.5">{unit}</span>}
          </span>
          <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider mt-0.5">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-extrabold text-white tracking-tight block">{label}</span>
        {subtext && <span className="text-[11px] font-semibold text-purple-300/60 block">{subtext}</span>}
      </div>
    </div>
  );
}
