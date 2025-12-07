'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DiyaProps {
  position: number;
  isLit: boolean;
  userName?: string;
  message?: string;
  isLighting?: boolean;
  isAuthenticated?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Diya: React.FC<DiyaProps> = ({
  position,
  isLit,
  userName,
  message,
  isLighting = false,
  isAuthenticated = false,
  onClick,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLit && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Video play failed:', error);
      });
    }
  }, [isLit]);

  return (
    <div className="relative group hover:z-50">
      <button
        onClick={isLit ? undefined : onClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLit) {
            e.preventDefault();
            onClick();
          }
        }}
        // Only disable interactivity if NOT lit (so we can still hover lit diyas)
        disabled={!isLit && disabled}
        aria-disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`
          relative w-12 h-12 md:w-14 md:h-14 rounded-full
          spiritual-transition
          ${isLit
            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 spiritual-glow cursor-help hover:scale-110'
            : 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-amber-200 hover:to-orange-300 cursor-pointer hover:scale-110'
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
        {/* Video for lit diyas */}
        {isLit ? (
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
            <video
              ref={videoRef}
              src="/diya-lit.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          /* Diya base design for unlit state */
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`
              w-8 h-8 md:w-10 md:h-10 rounded-full
              bg-gradient-to-br from-gray-200 to-gray-300
              shadow-inner
            `} />
          </div>
        )}

        {/* Loading spinner */}
        {isLighting && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      {/* Tooltip with user name */}
      {showTooltip && isLit && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-[100] pointer-events-none w-max">
          <div className="bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-2xl text-center min-w-[120px] max-w-[200px] whitespace-normal border border-white/20">
            <div className="font-bold text-amber-300 mb-0.5">
              {isAuthenticated ? (userName || 'A Devotee') : 'A Devotee'}
            </div>
            {message && (
              <div className="text-gray-200 italic text-[11px] leading-relaxed border-t border-white/10 pt-1 mt-1 break-words">{message}</div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 flex justify-center">
              <div className="w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
