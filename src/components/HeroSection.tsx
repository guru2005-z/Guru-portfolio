import React from 'react';
import { 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Sparkles, 
  Terminal, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CyberInterfaceScene } from './CyberInterfaceScene';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface HeroSectionProps {
  onOpenResume: () => void;
  onOpenAiChat: () => void;
  onOpenCertModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenResume, 
  onOpenAiChat, 
  onOpenCertModal 
}) => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden border-b border-[#1c1c1c] cyber-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-[#D41514]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#101010]/90 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#D41514] animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#CDCBCA]">
                Available for Software Engineering Roles & Freelance
              </span>
            </div>

            {/* Main Headline styled like the "Next Human Interface" aesthetic */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs sm:text-sm tracking-widest text-[#D41514] font-semibold uppercase">
                Guravaiah Katta • Portfolio
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08]">
                ARCHITECTING <br />
                <span className="text-[#D41514] drop-shadow-[0_0_25px_rgba(212,21,20,0.5)]">
                  HIGH-CONCURRENCY
                </span> <br />
                <span className="text-gradient-chrome">
                  SYSTEMS & AI.
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#CDCBCA]/85 max-w-2xl leading-relaxed">
              Full-Stack Software Engineer with hands-on experience in{' '}
              <strong className="text-white font-medium">Java, Spring Boot, React, and PostgreSQL</strong>.
              Creator of production booking platform{' '}
              <a 
                href={PORTFOLIO_DATA.personal.socialLinks.freelanceLive} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D41514] underline underline-offset-4 hover:text-[#ff4a49]"
              >
                Gully United
              </a>, AI sentiment intelligence systems, and AZ-900 certified cloud solutions.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-[#1f1f1f]">
              {PORTFOLIO_DATA.stats.map((st, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display font-bold text-xl sm:text-2xl text-white">
                    {st.value}
                  </span>
                  <span className="text-xs font-mono text-[#8E8D8C]">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Resume Download Button */}
              <a
                href={PORTFOLIO_DATA.personal.resumePath}
                download="Guravaiah_Katta_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#D41514] hover:bg-[#b0100f] text-white font-mono text-xs sm:text-sm uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(212,21,20,0.35)] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              {/* View Resume in App */}
              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#2a2a2a] bg-[#121212] hover:border-[#444] text-[#CDCBCA] hover:text-white font-mono text-xs sm:text-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-[#8E8D8C]" />
                <span>Preview PDF</span>
              </button>

              {/* Contact Button */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#D41514]/40 bg-[#D41514]/10 hover:bg-[#D41514]/20 text-white font-mono text-xs sm:text-sm transition-colors"
              >
                <span>Hire / Contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Ask Guru AI Assistant */}
              <button
                onClick={onOpenAiChat}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#282828] bg-[#141414] hover:border-[#D41514] text-[#CDCBCA] hover:text-white font-mono text-xs sm:text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#D41514]" />
                <span>Ask AI Representative</span>
              </button>
            </div>

            {/* Quick Links Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8E8D8C] pt-1">
              <a 
                href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#0077B5] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                <span>linkedin.com/in/guravaiah-katta</span>
              </a>
              <span className="text-[#333]">•</span>
              <a 
                href={PORTFOLIO_DATA.personal.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>github.com/guru2005-z</span>
              </a>
              <span className="text-[#333]">•</span>
              <button
                onClick={onOpenCertModal}
                className="inline-flex items-center gap-1.5 hover:text-[#0078D4] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0078D4]" />
                <span>AZ-900 Certified</span>
              </button>
            </div>
          </div>

          {/* Right Column: Three.js 3D Cybernetic Interface Scene */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="w-full relative rounded-2xl border border-[#222222] bg-[#0c0c0c]/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Inner ambient corner indicators */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D41514]/60 z-10" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D41514]/60 z-10" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D41514]/60 z-10" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D41514]/60 z-10" />

              {/* 3D Scene */}
              <CyberInterfaceScene />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
