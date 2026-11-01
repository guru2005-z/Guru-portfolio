import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ArrowDown, FileText, Download, Sparkles, Gamepad2 } from 'lucide-react';
import { PixelGridCanvas, GameTheme } from './PixelGridCanvas';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useSound } from '../hooks/useSound';

interface HeroProps {
  onOpenAgent: () => void;
  onOpenResumeModal: () => void;
  gameTheme: GameTheme;
  onSelectGameTheme: (theme: GameTheme) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAgent,
  onOpenResumeModal,
  gameTheme,
  onSelectGameTheme
}) => {
  const { playSound } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const [istTime, setIstTime] = useState('');
  const [activeLoopStep, setActiveLoopStep] = useState(0);

  // Parallax coordinates using lerp for silky smooth motion
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const targetParallax = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });

  const loopSteps = [
    { label: 'request', detail: 'HTTP client payload' },
    { label: 'spring security jwt', detail: 'stateless filter' },
    { label: 'atomic lock', detail: 'row-level isolation' },
    { label: 'postgresql', detail: 'ACID commit' },
    { label: 'razorpay webhook', detail: 'signature verified' },
    { label: 'qr ticket', detail: 'gate entry pass' }
  ];

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
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

  // Cycle loopline steps smoothly with animated pulse
  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveLoopStep((prev) => (prev + 1) % loopSteps.length);
    }, 2000);
    return () => clearInterval(cycle);
  }, [loopSteps.length]);

  // Subtle Mouse Parallax Tracking & Animation Loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      targetParallax.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny))
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationId: number;
    const lerpFactor = 0.07;

    const loop = () => {
      currentParallax.current.x += (targetParallax.current.x - currentParallax.current.x) * lerpFactor;
      currentParallax.current.y += (targetParallax.current.y - currentParallax.current.y) * lerpFactor;

      setParallax({
        x: currentParallax.current.x,
        y: currentParallax.current.y
      });

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const px = parallax.x;
  const py = parallax.y;

  return (
    <section
      ref={sectionRef}
      className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#e6e3da] overflow-hidden"
    >
      {/* Confined Hero Background Game Canvas (Snake / Pac-Man / Tetris blocks) - strictly within Hero */}
      <PixelGridCanvas theme={gameTheme} />

      {/* Background Radial Ambient Glow with subtle parallax */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[350px] bg-gradient-to-tr from-[#f3ede0]/70 via-[#f9f5ed]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10 transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(calc(-50% + ${px * -16}px), calc(-50% + ${py * -12}px), 0)`
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-left">
        {/* Top Bar: Location & Status Line with Live Clock + Background Game Theme Switcher */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">

          {/* Location & Status Line with Live Clock (Matches Image 2 exactly) */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d5d1c5] bg-[#ffffff]/90 backdrop-blur-xs text-xs font-mono text-[#6e6b63] shadow-xs transition-transform duration-75 will-change-transform"
            style={{
              transform: `translate3d(${px * 3}px, ${py * 2}px, 0)`
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping"></span>
            <span>Andhra Pradesh, India</span>
            <span className="text-[#9c988d]">·</span>
            <span className="font-semibold text-[#161514]">{istTime || '14:36:27'} IST</span>
          </div>

          {/* Background Game Theme Selector matching Image 2 concept */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl border border-[#d5d1c5] bg-[#ffffff]/95 backdrop-blur-xs font-mono text-xs shadow-xs transition-transform duration-75 will-change-transform"
            style={{
              transform: `translate3d(${px * 4}px, ${py * 2.5}px, 0)`
            }}
          >
            <span className="text-[#9c988d] px-2 text-[11px] hidden sm:inline flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-[#161514]" />
              <span>Background Game:</span>
            </span>

            {/* Snake (Recommended) */}
            <button
              onClick={() => {
                playSound('toggle');
                onSelectGameTheme('snake');
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${gameTheme === 'snake'
                  ? 'bg-[#161514] text-white font-semibold shadow-xs'
                  : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]'
                }`}
            >
              <span>🐍 Snake</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${gameTheme === 'snake' ? 'bg-[#16a34a] text-white' : 'bg-[#e2f7e8] text-[#16a34a]'
                }`}>
                Rec
              </span>
            </button>

            {/* Pac-Man */}
            <button
              onClick={() => {
                playSound('toggle');
                onSelectGameTheme('pacman');
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${gameTheme === 'pacman'
                  ? 'bg-[#161514] text-white font-semibold shadow-xs'
                  : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]'
                }`}
            >
              <span>🟡 Pac-Man</span>
            </button>

            {/* Block Game / Tetris (Image 2) */}
            <button
              onClick={() => {
                playSound('toggle');
                onSelectGameTheme('tetris');
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${gameTheme === 'tetris'
                  ? 'bg-[#161514] text-white font-semibold shadow-xs'
                  : 'text-[#6e6b63] hover:text-[#161514] hover:bg-[#f0ede6]'
                }`}
            >
              <span>🧱 Block Game</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Hero Content + Right Background-Themed Photo Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Heading, Subtitle, Pipeline, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Huge Name Display */}
            <h1
              className="font-bold text-5xl sm:text-7xl lg:text-7xl xl:text-8xl tracking-tight text-[#161514] leading-[0.94] mb-5 transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate3d(${px * 5}px, ${py * 3.5}px, 0)`
              }}
            >
              <span className="block">Guravaiah</span>
              <span className="block">Katta</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-xl text-[#6e6b63] font-normal max-w-xl leading-snug mb-6 transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate3d(${px * 4}px, ${py * 2.5}px, 0)`
              }}
            >
              Full-stack software engineer in India. I build reliable backends, concurrent database systems, and AI pipelines.
            </p>

            {/* Architecture Loopline Pipeline with pulse animation */}
            <div
              className="flex flex-wrap items-center gap-2 py-2.5 px-3.5 rounded-xl border border-[#e6e3da] bg-[#ffffff]/95 backdrop-blur-xs w-fit font-mono text-xs text-[#6e6b63] mb-6 shadow-xs transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate3d(${px * 6}px, ${py * 4}px, 0)`
              }}
            >
              {loopSteps.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <span
                    className={`px-2 py-0.5 rounded transition-all duration-300 relative cursor-default ${activeLoopStep === idx
                        ? 'bg-[#161514] text-white font-semibold shadow-xs scale-105'
                        : step.label === 'atomic lock'
                          ? 'text-[#d41514] font-medium bg-[#ffebeb]'
                          : 'text-[#161514] hover:bg-[#f0ede6]'
                      }`}
                    title={step.detail}
                  >
                    {step.label}
                  </span>
                  {idx < loopSteps.length - 1 && (
                    <span className={`transition-colors duration-300 ${activeLoopStep === idx ? 'text-[#161514] font-bold' : 'text-[#9c988d]'}`}>
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Primary CTA Buttons */}
            <div
              className="flex flex-wrap items-center gap-2.5 transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate3d(${px * 4}px, ${py * 2}px, 0)`
              }}
            >
              {/* Talk to my agent */}
              <button
                onClick={onOpenAgent}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#161514] hover:bg-[#302e2b] text-white text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer group"
              >
                <span>Talk to my agent</span>
                <span className="font-mono text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </button>

              {/* Resume */}
              <a
                href={PORTFOLIO_DATA.personal.resumePath}
                download="Guravaiah_Katta_Resume.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
              >
                <span>Resume</span>
                <span className="font-mono text-xs">↗</span>
              </a>

              {/* GitHub */}
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
              >
                <span>GitHub</span>
                <span className="font-mono text-xs">↗</span>
              </a>

              {/* LinkedIn */}
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
              >
                <span>LinkedIn</span>
                <span className="font-mono text-xs">↗</span>
              </a>

              {/* Live Freelance Project */}
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.freelanceLive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#d41514]/40 bg-[#fff5f5] hover:bg-[#ffe5e5] text-[#d41514] text-xs sm:text-sm font-medium transition-all shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d41514] animate-pulse"></span>
                <span>Live Project: Gully United</span>
                <span className="font-mono text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Photo Card styled with Background Theme */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[290px] sm:max-w-[320px] transition-transform duration-75 will-change-transform group select-none"
              style={{
                transform: `translate3d(${px * -7}px, ${py * -5}px, 0)`
              }}
            >
              {/* Outer Retro Crosshair Corners */}
              <span className="absolute -top-2.5 -left-2.5 font-mono text-xs text-[#9c988d] pointer-events-none select-none z-20">+</span>
              <span className="absolute -top-2.5 -right-2.5 font-mono text-xs text-[#9c988d] pointer-events-none select-none z-20">+</span>
              <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs text-[#9c988d] pointer-events-none select-none z-20">+</span>
              <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs text-[#9c988d] pointer-events-none select-none z-20">+</span>

              {/* Theme Glow Backdrop */}
              <div className="absolute -inset-1.5 bg-gradient-to-br from-[#161514]/5 via-[#f0ede6] to-[#16a34a]/10 rounded-2xl blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

              {/* Main Themed Card Box */}
              <div className="rounded-2xl border border-[#d5d1c5] bg-[#ffffff]/95 backdrop-blur-md p-3 sm:p-3.5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">

                {/* Micro Tech Grid Background Pattern */}
                <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#161514_1px,transparent_1px)] [background-size:10px_10px]" />

                {/* Card Header Status Bar */}
                <div className="flex items-center justify-between border-b border-[#e6e3da] pb-2 mb-2.5 font-mono text-[10px] text-[#6e6b63] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
                    <span className="font-semibold text-[#161514] tracking-wider">DEV_NODE // ONLINE</span>
                  </div>
                  <span className="text-[#9c988d] bg-[#f4f2ec] px-1.5 py-0.5 rounded border border-[#e6e3da]">
                    {gameTheme.toUpperCase()} MATRIX
                  </span>
                </div>

                {/* Photo Bevel Container */}
                <div className="relative rounded-xl overflow-hidden border border-[#d5d1c5] bg-[#f4f2ec] shadow-inner aspect-square">

                  {/* The User Photo */}
                  <img
                    src="/guravaiah-katta.png"
                    alt="Guravaiah Katta"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    loading="eager"
                  />

                  {/* Corner Visual Brackets */}
                  <span className="absolute top-1.5 left-2 font-mono text-xs text-white/80 pointer-events-none drop-shadow-md">⌜</span>
                  <span className="absolute top-1.5 right-2 font-mono text-xs text-white/80 pointer-events-none drop-shadow-md">⌝</span>
                  <span className="absolute bottom-1.5 left-2 font-mono text-xs text-white/80 pointer-events-none drop-shadow-md">⌞</span>
                  <span className="absolute bottom-1.5 right-2 font-mono text-xs text-white/80 pointer-events-none drop-shadow-md">⌟</span>

                  {/* Ambient Bottom Gradient for contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#161514]/80 via-[#161514]/30 to-transparent pointer-events-none" />

                  {/* Identification Pill over Photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white pointer-events-none">
                    <div>
                      <div className="font-bold text-sm tracking-tight drop-shadow-md">Guravaiah Katta</div>
                      <div className="font-mono text-[10px] text-white/90 drop-shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                        <span>Full-Stack & AI Systems</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs border border-white/30 text-white font-medium">
                      B.Tech '27
                    </span>
                  </div>
                </div>

                {/* Technical Specs Footer */}
                <div className="mt-2.5 pt-2 border-t border-[#e6e3da] flex flex-col gap-1.5 relative z-10">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#6e6b63]">
                    <span className="text-[#9c988d]">PRIMARY STACK</span>
                    <span className="text-[#161514] font-medium">Java · Spring Boot · React</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#6e6b63]">
                    <span className="text-[#9c988d]">ENGINEERING</span>
                    <span className="text-[#d41514] font-medium bg-[#ffebeb] px-1.5 py-0.2 rounded border border-[#ffd1d1]">
                      300+ DSA · Gully United Live
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Interactive Background Tip & Scroll cue */}
        <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-4 text-xs font-mono text-[#9c988d]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span>Background active: Use Arrow keys / WASD or click grid cells to play</span>
          </span>
          <span>·</span>
          <a
            href="#about"
            className="inline-flex items-center gap-1 text-[#9c988d] hover:text-[#161514] transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>scroll to about</span>
          </a>
        </div>

      </div>
    </section>
  );
};
