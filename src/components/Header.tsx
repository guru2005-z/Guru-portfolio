import React, { useState, useEffect } from 'react';
import { Briefcase, FolderGit2, Wrench, Calendar, GraduationCap, Mail, Sparkles, Sliders, Gamepad2, Volume2, VolumeX, Cpu } from 'lucide-react';
import { useSound } from '../hooks/useSound';

import { GameTheme } from './PixelGridCanvas';

interface HeaderProps {
  currentMode: 'classic' | 'agent';
  onModeChange: (mode: 'classic' | 'agent') => void;
  onOpenArcade: () => void;
  gameTheme?: GameTheme;
  onSelectGameTheme?: (theme: GameTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentMode, 
  onModeChange, 
  onOpenArcade, 
  gameTheme = 'tetris', 
  onSelectGameTheme 
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const { isMuted, toggleMute, playSound } = useSound();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // IST is UTC + 5:30
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e6e3da] bg-[#f9f8f5]/92 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Name / Brand */}
        <a 
          href="#top" 
          onClick={(e) => {
            if (currentMode === 'agent') {
              e.preventDefault();
              onModeChange('classic');
            }
          }}
          className="font-bold text-sm sm:text-base tracking-tight text-[#161514] hover:text-[#d41514] transition-colors"
        >
          Guravaiah Katta
        </a>

        {/* Section Navigation (Classic mode only) */}
        {currentMode === 'classic' && (
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#6e6b63]">
            <a href="#about" className="hover:text-[#161514] transition-colors">
              About
            </a>
            <a href="#efforts" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <Cpu className="w-3.5 h-3.5 text-[#d41514]" />
              <span className="font-semibold text-[#161514]">Efforts</span>
            </a>
            <a href="#work" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Work</span>
            </a>
            <a href="#projects" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Projects</span>
            </a>
            <a href="#principles" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <Sliders className="w-3.5 h-3.5" />
              <span>How I build</span>
            </a>
            <a href="#toolkit" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <Wrench className="w-3.5 h-3.5" />
              <span>Toolkit</span>
            </a>
            <a href="#contact" className="hover:text-[#161514] flex items-center gap-1.5 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </nav>
        )}

        {/* Right Info: Sound Toggle + Arcade trigger + Live IST Clock + Mode Segment Switch */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Persistent Sound Mute/Unmute Toggle */}
          <button
            onClick={() => {
              toggleMute();
            }}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={isMuted ? 'Sound FX: Muted (Click to unmute)' : 'Sound FX: Active (Click to mute)'}
            className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
              isMuted
                ? 'border-[#d5d1c5] bg-[#ece9e0]/80 text-[#8c897f] hover:text-[#161514] hover:bg-[#e4e1d7]'
                : 'border-[#161514]/30 bg-[#ffffff] text-[#161514] hover:border-[#161514] shadow-2xs'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#8c897f]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#161514]" />
            )}
            {/* Visual audio pulse indicator when unmuted */}
            {!isMuted && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]"></span>
              </span>
            )}
          </button>

          {/* Arcade Mini-Game Trigger */}
          <button
            onClick={() => {
              playSound('click');
              onOpenArcade();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-xs font-mono text-[#161514] transition-colors cursor-pointer shadow-2xs"
            title="Open Arcade Mini-Games (Snake, Pac-Man, Tetris)"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#d41514]" />
            <span className="hidden sm:inline">Arcade</span>
            <span className="text-[9px] bg-[#161514] text-white px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
              Play
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#6e6b63] border-r border-[#e6e3da] pr-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span>IST {istTime || '14:09'}</span>
          </div>

          {/* Mode Switch: [Classic] [Agent] */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-[#d5d1c5] bg-[#ece9e0] text-xs font-mono">
            <button
              onClick={() => {
                if (currentMode !== 'classic') {
                  playSound('switch');
                  onModeChange('classic');
                }
              }}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentMode === 'classic'
                  ? 'bg-[#161514] text-white shadow-sm font-semibold'
                  : 'text-[#6e6b63] hover:text-[#161514]'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => {
                if (currentMode !== 'agent') {
                  playSound('switch');
                  onModeChange('agent');
                }
              }}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                currentMode === 'agent'
                  ? 'bg-[#161514] text-white shadow-sm font-semibold'
                  : 'text-[#6e6b63] hover:text-[#161514]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#facc15]" />
              <span>Agent</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
