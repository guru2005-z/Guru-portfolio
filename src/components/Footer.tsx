import React from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Download, 
  ArrowUp, 
  ExternalLink,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
  onOpenCertModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume, onOpenCertModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1c1c1c] bg-[#050505] text-[#8E8D8C] text-xs font-mono py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Top Row: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#242424] flex items-center justify-center font-bold text-white">
                <span className="text-[#CDCBCA]">G</span>
                <span className="text-[#D41514]">K</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Guravaiah Katta
              </span>
            </div>
            <p className="text-xs text-[#8E8D8C] max-w-sm leading-relaxed">
              Full-Stack Software Engineer & AI Systems Developer. Crafting enterprise Spring Boot backends, scalable PostgreSQL databases, and reactive React applications.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#CDCBCA] pt-1">
              <span className="w-2 h-2 rounded-full bg-[#D41514]"></span>
              <span>Obsidian • Chrome Silver • Laser Crimson</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-white font-semibold mb-1">
              Navigation
            </span>
            <a href="#projects" className="hover:text-[#D41514] transition-colors">
              Featured Coding Projects
            </a>
            <a href="#skills" className="hover:text-[#D41514] transition-colors">
              Technical Stack & Arsenal
            </a>
            <a href="#experience" className="hover:text-[#D41514] transition-colors">
              Experience & Education
            </a>
            <a href="#contact" className="hover:text-[#D41514] transition-colors">
              Contact & Inquiries
            </a>
            <button 
              onClick={onOpenCertModal} 
              className="text-left hover:text-[#0078D4] transition-colors"
            >
              Azure AZ-900 Certificate
            </button>
          </div>

          {/* Social Profiles & Direct Endpoints */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-white font-semibold mb-1">
              Verified Profiles
            </span>
            <div className="flex flex-col gap-2">
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#0077B5] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                <span>linkedin.com/in/guravaiah-katta</span>
              </a>

              <a
                href={PORTFOLIO_DATA.personal.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>github.com/guru2005-z</span>
              </a>

              <a
                href={PORTFOLIO_DATA.personal.socialLinks.freelanceLive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#D41514] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D41514]" />
                <span>gully-united-xlv.vercel.app (Live Project)</span>
              </a>

              <a
                href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D41514]" />
                <span>{PORTFOLIO_DATA.personal.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left text-[11px] text-[#777]">
            <span>© {new Date().getFullYear()} Guravaiah Katta. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>B.Tech CSE NBKRIST (CGPA 8.17/10)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-1 text-[11px] text-[#CDCBCA] hover:text-[#D41514] transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3 text-[#D41514]" />
              <span>Resume</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg border border-[#222222] bg-[#121212] text-[#CDCBCA] hover:text-white hover:border-[#D41514] transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
