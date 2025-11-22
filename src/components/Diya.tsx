'use client';

import React, { useState } from 'react';

interface DiyaProps {
  position: number;
  isLit: boolean;
  userName?: string;
  isLighting?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Diya: React.FC<DiyaProps> = ({
  position,
  isLit,
  userName,
  isLighting = false,
  onClick,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLit) {
            e.preventDefault();
            onClick();
          }
        }}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`
          relative w-12 h-12 md:w-14 md:h-14 rounded-full
          spiritual-transition
          ${isLit 
            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 spiritual-glow cursor-default' 
            : 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-amber-200 hover:to-orange-300 cursor-pointer'
          }
          ${isLighting ? 'animate-pulse scale-110' : ''}
          ${disabled && !isLit ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-spiritual-secondary focus:ring-offset-2
          shadow-md hover:shadow-lg
        `}
        aria-label={
          isLit 
            ? `Diya ${position + 1} lit by ${userName || 'someone'}` 
            : `Light diya ${position + 1}`
        }
        aria-pressed={isLit}
      >
        {/* Flame effect for lit diyas */}
        {isLit && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 w-4 h-6 bg-yellow-300 rounded-full blur-md opacity-60 animate-pulse" />
              
              {/* Flame */}
              <svg 
                className="w-4 h-6 relative z-10" 
                viewBox="0 0 24 36" 
                fill="none"
              >
                <path
                  d="M12 2C12 2 6 10 6 18C6 23.5 8.5 28 12 28C15.5 28 18 23.5 18 18C18 10 12 2 12 2Z"
                  fill="url(#flameGradient)"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="flameGradient" x1="12" y1="2" x2="12" y2="28">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {/* Diya base design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            w-8 h-8 md:w-10 md:h-10 rounded-full
            ${isLit 
              ? 'bg-gradient-to-br from-yellow-200 to-orange-400' 
              : 'bg-gradient-to-br from-gray-200 to-gray-300'
            }
            shadow-inner
          `} />
        </div>

        {/* Loading spinner */}
        {isLighting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      {/* Tooltip with user name */}
      {showTooltip && isLit && userName && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            <div className="font-medium">{userName}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
