import React, { useState } from 'react';
import { 
  FileText, 
  Github, 
  Linkedin, 
  Mail, 
  Menu, 
  X, 
  ExternalLink, 
  Download, 
  Terminal,
  Sparkles,
  Award
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAiChat: () => void;
  onOpenCertModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenResume, 
  onOpenAiChat, 
  onOpenCertModal 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#202020] bg-[#080808]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center font-mono font-bold text-white group-hover:border-[#D41514] group-hover:shadow-[0_0_15px_rgba(212,21,20,0.35)] transition-all">
              <span className="text-[#CDCBCA]">G</span>
              <span className="text-[#D41514]">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
                Guravaiah Katta
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D41514]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#8E8D8C]">
                Full-Stack & AI Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#CDCBCA] hover:text-[#D41514] transition-colors"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={onOpenCertModal}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8E8D8C] hover:text-[#CDCBCA] px-2.5 py-1 rounded border border-[#242424] hover:border-[#383838] transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>Azure AZ-900</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#CDCBCA] rounded-lg border border-[#2a2a2a] bg-[#121212] hover:border-[#D41514] hover:text-white transition-colors"
              title="Chat with Guravaiah's AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D41514]" />
              <span>Ask Guru AI</span>
            </button>

            {/* GitHub */}
            <a
              href={PORTFOLIO_DATA.personal.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-lg border border-[#222222] bg-[#121212] text-[#CDCBCA] hover:text-white hover:border-[#D41514] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
              href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-lg border border-[#222222] bg-[#121212] text-[#CDCBCA] hover:text-[#0077B5] hover:border-[#0077B5] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Resume Button */}
            <div className="flex items-center">
              <a
                href={PORTFOLIO_DATA.personal.resumePath}
                download="Guravaiah_Katta_Resume.pdf"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-l-lg bg-[#D41514] text-white hover:bg-[#b0100f] shadow-[0_0_15px_rgba(212,21,20,0.3)] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
              <button
                onClick={onOpenResume}
                title="Preview Resume"
                className="px-2 py-2 rounded-r-lg bg-[#940d0c] hover:bg-[#7a0b0a] text-white/90 border-l border-white/20 text-xs font-mono transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={PORTFOLIO_DATA.personal.resumePath}
              download="Guravaiah_Katta_Resume.pdf"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-mono rounded bg-[#D41514] text-white"
            >
              <Download className="w-3 h-3" />
              <span>Resume</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#242424] bg-[#121212] text-[#CDCBCA] hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#242424] bg-[#0c0c0c] px-4 pt-3 pb-6 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded text-sm font-medium text-[#CDCBCA] hover:bg-[#181818] hover:text-[#D41514]"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCertModal();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#CDCBCA] hover:bg-[#181818]"
            >
              <Award className="w-4 h-4 text-[#0078D4]" />
              <span>Azure AZ-900 Certification</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiChat();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#CDCBCA] hover:bg-[#181818]"
            >
              <Sparkles className="w-4 h-4 text-[#D41514]" />
              <span>Ask Guru AI</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#CDCBCA] hover:bg-[#181818]"
            >
              <FileText className="w-4 h-4 text-[#CDCBCA]" />
              <span>Preview Resume PDF</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-[#181818] border border-[#282828] text-[#CDCBCA]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-[#181818] border border-[#282828] text-[#CDCBCA]"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-[#181818] border border-[#282828] text-[#CDCBCA]"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <a
              href={PORTFOLIO_DATA.personal.resumePath}
              download="Guravaiah_Katta_Resume.pdf"
              className="px-3 py-1.5 text-xs font-mono uppercase bg-[#D41514] text-white rounded font-bold"
            >
              Download PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
