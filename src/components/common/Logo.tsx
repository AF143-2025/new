import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'monogram';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', onClick }) => {
  if (variant === 'monogram') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center cursor-pointer select-none ${className}`}
        aria-label="Style City Baghdad"
      >
        <div className="relative w-10 h-10 rounded-full border border-[#B99A5B]/60 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(185,154,91,0.2)]">
          <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#B99A5B]" fill="currentColor">
            {/* Ornate crest monogram */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            <text
              x="50%"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize="44"
              fontWeight="bold"
              fill="#D4BD86"
              style={{ letterSpacing: '-0.05em' }}
            >
              SC
            </text>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2.5 cursor-pointer select-none text-right ${className}`}
        aria-label="Style City Baghdad"
      >
        <div className="relative w-8 h-8 rounded-full border border-[#B99A5B]/70 flex items-center justify-center bg-[#0B0A09]">
          <span className="font-serif-luxury font-bold text-xs text-[#D4BD86] tracking-tight">SC</span>
        </div>
        <div className="flex flex-col">
          <span className="font-serif-luxury text-sm tracking-[0.2em] font-semibold text-[#F5F1EA] uppercase leading-none">
            STYLE CITY
          </span>
          <span className="text-[8px] font-sans tracking-[0.25em] text-[#B99A5B] uppercase mt-0.5 leading-none">
            THE CITY OF BEAUTY
          </span>
        </div>
      </div>
    );
  }

  // Full Luxury Logo matching the uploaded brand asset
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01] ${className}`}
      aria-label="Style City Baghdad - The City of Beauty"
    >
      {/* Top Baroque Crest & Monogram Medallion */}
      <div className="relative flex items-center justify-center mb-1 w-full max-w-[200px]">
        {/* Left Scroll Flourish */}
        <svg className="w-12 h-6 text-[#B99A5B]/80 -mr-1" viewBox="0 0 60 25" fill="none" stroke="currentColor">
          <path
            d="M58 20 C45 20, 35 15, 25 18 C15 21, 5 12, 10 5 C15 -2, 28 8, 20 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="7" r="1.5" fill="currentColor" />
        </svg>

        {/* Central Circular Monogram */}
        <div className="relative w-12 h-12 rounded-full border border-[#B99A5B] flex items-center justify-center bg-[#0B0A09] shadow-[0_0_20px_rgba(185,154,91,0.25)] z-10 mx-1">
          <div className="absolute inset-0.5 rounded-full border border-[#B99A5B]/40" />
          {/* Diagonal cut line across letters */}
          <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#F5E5C9] to-transparent rotate-[-35deg] pointer-events-none" />
          <span className="font-serif-luxury font-bold text-lg text-transparent bg-clip-text bg-gradient-to-b from-[#F5E5C9] via-[#D4BD86] to-[#8C713B] tracking-tighter">
            SC
          </span>
        </div>

        {/* Right Scroll Flourish */}
        <svg className="w-12 h-6 text-[#B99A5B]/80 -ml-1 scale-x-[-1]" viewBox="0 0 60 25" fill="none" stroke="currentColor">
          <path
            d="M58 20 C45 20, 35 15, 25 18 C15 21, 5 12, 10 5 C15 -2, 28 8, 20 18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="7" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Double Top Parallel Golden Rules */}
      <div className="w-full flex flex-col items-center gap-[2px] my-1">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#B99A5B]/90 to-transparent" />
        <div className="w-[85%] h-[0.75px] bg-gradient-to-r from-transparent via-[#B99A5B]/50 to-transparent" />
      </div>

      {/* STYLE CITY Main Wordmark */}
      <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#E8D7B0] to-[#B99A5B] my-1 drop-shadow-sm">
        STYLE CITY
      </h1>

      {/* Double Bottom Parallel Golden Rules */}
      <div className="w-full flex flex-col items-center gap-[2px] my-1">
        <div className="w-[85%] h-[0.75px] bg-gradient-to-r from-transparent via-[#B99A5B]/50 to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#B99A5B]/90 to-transparent" />
      </div>

      {/* THE CITY OF BEAUTY Tracked Subtitle */}
      <p className="font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] text-[#D4BD86] uppercase font-medium mt-1">
        THE CITY OF BEAUTY
      </p>
    </div>
  );
};
