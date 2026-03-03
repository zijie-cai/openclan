import React, { useState, KeyboardEvent } from 'react';
import { cn } from '../ui/button';

export const Mascot: React.FC<{ className?: string }> = ({ className }) => {
  const [isClickedOpen, setIsClickedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = isClickedOpen || isHovered;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsClickedOpen(!isClickedOpen);
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <button
        className={cn(
          "bg-transparent border-none p-0 cursor-pointer outline-none relative w-[320px] h-[320px] rounded-full transition-transform duration-200 ease-out",
          "focus-visible:ring-4 focus-visible:ring-[#00B4D8]/40 active:scale-95",
          isOpen ? "is-open" : ""
        )}
        aria-label="Toggle OpenCLAN Mascot"
        aria-pressed={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsClickedOpen(!isClickedOpen)}
        onKeyDown={handleKeyDown}
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox="-40 -40 280 280"
          role="img"
          aria-labelledby="mascotTitle mascotDesc"
        >
          <title id="mascotTitle">OpenCLAN Mascot</title>
          <desc id="mascotDesc">A cute blue clam mascot that opens to reveal a glowing golden pearl.</desc>

          <defs>
            <linearGradient id="bottomShellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00B4D8" />
              <stop offset="40%" stopColor="#0077B6" />
              <stop offset="100%" stopColor="#03045E" />
            </linearGradient>

            <linearGradient id="topShellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#90E0EF" />
              <stop offset="50%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>

            <radialGradient id="pearlGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFF3B0" />
              <stop offset="60%" stopColor="#FFD166" />
              <stop offset="90%" stopColor="#F77F00" />
              <stop offset="100%" stopColor="#D62828" />
            </radialGradient>

            <filter id="glow" x="-200%" y="-200%" width="500%" height="500%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="heavyGlow" x="-200%" y="-200%" width="500%" height="500%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="shadow" x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
              <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          <g>
            {/* Back inside of the shell */}
            <path d="M 40 110 C 40 70, 160 70, 160 110 Z" fill="#010B1A" />

            {/* Pearl and Sparkles Group */}
            <g
              className={cn(
                "origin-[100px_95px] transition-all duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)]",
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
              style={{ transformBox: 'view-box' }}
            >
              <circle cx="100" cy="95" r="22" fill="#FFD166" filter="url(#heavyGlow)" opacity="0.5" />
              <circle cx="100" cy="95" r="20" fill="#FFF3B0" filter="url(#glow)" opacity="0.8" />
              <circle cx="100" cy="95" r="18" fill="url(#pearlGrad)" />
              <path d="M 88 85 A 8 8 0 0 1 102 82 A 10 10 0 0 0 88 85 Z" fill="#FFFFFF" opacity="0.9" />
              <circle cx="92" cy="90" r="1.5" fill="#FFFFFF" opacity="0.8" />

              <g fill="#FFFFFF" filter="url(#glow)">
                <path
                  className={cn(
                    "origin-[65px_65px] transition-all duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)] delay-50",
                    isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-45"
                  )}
                  style={{ transformBox: 'view-box' }}
                  d="M 65 59 Q 65 65 71 65 Q 65 65 65 71 Q 65 65 59 65 Q 65 65 65 59 Z"
                />
                <path
                  className={cn(
                    "origin-[135px_60px] transition-all duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)] delay-100",
                    isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-45"
                  )}
                  style={{ transformBox: 'view-box' }}
                  d="M 135 54 Q 135 60 141 60 Q 135 60 135 66 Q 135 60 129 60 Q 135 60 135 54 Z"
                />
                <path
                  className={cn(
                    "origin-[100px_45px] transition-all duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)] delay-150",
                    isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-45"
                  )}
                  style={{ transformBox: 'view-box' }}
                  d="M 100 37 Q 100 45 108 45 Q 100 45 100 53 Q 100 45 92 45 Q 100 45 100 37 Z"
                />
              </g>
            </g>

            {/* Bottom Shell */}
            <g filter="url(#shadow)">
              <path d="M 30 110 C 30 170, 170 170, 170 110 C 140 125, 60 125, 30 110 Z" fill="url(#bottomShellGrad)" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M 30 110 C 60 125, 140 125, 170 110 C 140 118, 60 118, 30 110 Z" fill="#00E5FF" opacity="0.5" />
              <g fill="#03045E">
                <circle cx="80" cy="135" r="4.5" />
                <circle cx="81" cy="133.5" r="1.5" fill="#FFFFFF" />
                <circle cx="120" cy="135" r="4.5" />
                <circle cx="121" cy="133.5" r="1.5" fill="#FFFFFF" />
                <path d="M 95 142 Q 100 148 105 142" stroke="#03045E" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="68" cy="138" r="4" fill="#90E0EF" opacity="0.4" />
                <circle cx="132" cy="138" r="4" fill="#90E0EF" opacity="0.4" />
              </g>
            </g>

            {/* Top Shell */}
            <g
              className={cn(
                "origin-[30px_110px] transition-transform duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)]",
                isOpen ? "-rotate-42" : "rotate-0"
              )}
              style={{ transformBox: 'view-box' }}
              filter="url(#shadow)"
            >
              <path d="M 30 110 C 10 60, 50 20, 100 20 C 150 20, 190 60, 170 110 C 140 100, 60 100, 30 110 Z" fill="url(#topShellGrad)" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.6" />
              <path d="M 60 40 Q 70 80 75 105" stroke="#03045E" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
              <path d="M 100 25 L 100 102" stroke="#03045E" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
              <path d="M 140 40 Q 130 80 125 105" stroke="#03045E" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
              <path d="M 45 90 C 40 50, 80 30, 100 30" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
};
