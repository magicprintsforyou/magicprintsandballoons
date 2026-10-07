import React from 'react';

const Logo: React.FC<{ className?: string, light?: boolean, customLogo?: string }> = ({ className = "w-full", light = false, customLogo }) => {
  if (customLogo) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img src={customLogo} alt="magicprintsandballoons Logo" className="max-h-full w-auto object-contain" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative leading-none flex flex-col items-center">
        {/* "Magic" script with balloon accent */}
        <div className="flex items-start justify-center">
          <span
            className={`block font-script text-[48px] md:text-[60px] leading-[0.7] mb-2 select-none ${
              light ? 'text-white' : 'magic-text'
            }`}
            style={{
              textShadow: light ? 'none' : '0 2px 10px rgba(217,0,130,0.15)',
              letterSpacing: '-0.02em'
            }}
          >
            Magic
          </span>
          {/* Balloon icon accent */}
          <svg
            viewBox="0 0 24 32"
            className="w-6 h-8 md:w-8 md:h-10 ml-1 -mt-1 animate-magic-float"
            fill="none"
            aria-hidden="true"
          >
            <ellipse cx="12" cy="11" rx="9" ry="10" fill={light ? '#ffcc00' : '#d90082'} />
            <ellipse cx="9" cy="8" rx="3" ry="4" fill="white" opacity="0.35" />
            <path d="M11 21 L13 21 L12 24 Z" fill={light ? '#ffcc00' : '#d90082'} />
            <path d="M12 24 C 12 27, 9 28, 9 31" stroke={light ? '#ffffffaa' : '#41137e88'} strokeWidth="1.2" fill="none" />
          </svg>
        </div>

        {/* "PRINTS & BALLOONS" */}
        <div className="flex flex-col items-center w-full">
          <span className={`block text-[11px] md:text-[18px] font-black tracking-[0.28em] whitespace-nowrap leading-none uppercase ${
            light ? 'text-white' : 'text-[#41137e]'
          }`}>
            PRINTS &amp; BALLOONS
          </span>

          <div className="flex items-center gap-2 mt-2 w-full max-w-[140px] md:max-w-none justify-center">
             <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-[#d90082]/20'}`}></div>
             <span className={`text-[6px] md:text-[8px] font-black tracking-[0.35em] uppercase whitespace-nowrap ${
               light ? 'text-white/60' : 'text-[#d90082]'
             }`}>
               Party Ready
             </span>
             <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-[#d90082]/20'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
