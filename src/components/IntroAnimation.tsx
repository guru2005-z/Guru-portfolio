import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete?: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [dismissing, setDismissing] = useState(false);

  const fullName = "Guravaiah Katta";
  const letters = fullName.split("");

  useEffect(() => {
    // Total animation timeline: ~1.8s then dismiss
    const dismissTimer = setTimeout(() => {
      setDismissing(true);
    }, 1700);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2100);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f9f8f5] transition-all duration-400 select-none ${
        dismissing ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4 max-w-md px-6 text-center">
        
        {/* Animated Letter by Letter Typography matching mohammad-rizwan.tech */}
        <p className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#161514] font-sans flex items-center">
          {letters.map((char, index) => (
            <span
              key={index}
              className="intro-letter"
              style={{
                animationDelay: `${100 + index * 34}ms`,
                marginRight: char === ' ' ? '0.35em' : '0'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>

        {/* Subtitle */}
        <p
          className="text-xs sm:text-sm font-mono text-[#6e6b63] intro-letter"
          style={{ animationDelay: '820ms' }}
        >
          Full-stack software engineer · Andhra Pradesh
        </p>

        {/* Minimal Progress Bar runner matching intro-bar */}
        <div className="w-48 sm:w-56 h-[2px] bg-[#e6e3da] rounded-full overflow-hidden mt-3">
          <div className="h-full bg-[#161514] intro-progress-bar rounded-full" />
        </div>

      </div>
    </div>
  );
};
