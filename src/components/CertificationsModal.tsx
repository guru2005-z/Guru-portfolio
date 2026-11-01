import React from 'react';
import { ShieldCheck, ExternalLink, X, CheckCircle, Download } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface CertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificationsModal: React.FC<CertificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0078D4]/15 border border-[#0078D4]/40 flex items-center justify-center text-[#0078D4]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                Official Microsoft Certification
              </h3>
              <p className="text-xs font-mono text-[#8E8D8C]">
                Azure Fundamentals (AZ-900) • Verified Credential
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#282828] bg-[#161616] text-[#8E8D8C] hover:text-white hover:border-[#444] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Image Display */}
        <div className="relative rounded-xl border border-[#262626] bg-[#050505] overflow-hidden p-2 flex items-center justify-center shadow-inner">
          <img
            src="/assets/aistudio/image_dedf00ae.png"
            alt="Microsoft Certified Azure Fundamentals - Katta Guravaiah"
            className="w-full h-auto max-h-[460px] object-contain rounded-lg"
          />
        </div>

        {/* Verification Credentials Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#121212] border border-[#222222] p-4 rounded-xl text-xs font-mono">
          <div className="flex flex-col">
            <span className="text-[#8E8D8C]">Candidate Name:</span>
            <span className="text-white font-semibold mt-0.5">Katta Guravaiah</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#8E8D8C]">Credential ID:</span>
            <span className="text-[#0078D4] font-semibold mt-0.5">5B48115BB42E21FC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#8E8D8C]">Certification Number:</span>
            <span className="text-[#CDCBCA] font-semibold mt-0.5">A10BH5-156616</span>
          </div>
        </div>

        {/* Details & Syllabus */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm text-[#CDCBCA]">
          <p className="leading-relaxed">
            Validated by Microsoft with foundational knowledge of cloud concepts, Azure architecture and services, security, privacy, and compliance management. Signed by <strong className="text-white">Satya Nadella</strong> (Chairman and Chief Executive Officer, Microsoft).
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-[#0078D4] mt-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Status: Active & Online Verifiable</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#333] bg-[#161616] text-xs font-mono text-[#CDCBCA] hover:text-white"
          >
            Close Viewer
          </button>
          <a
            href="/assets/aistudio/image_dedf00ae.png"
            download="Katta_Guravaiah_Azure_AZ900.png"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0078D4] hover:bg-[#006abc] text-white text-xs font-mono font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certificate PNG</span>
          </a>
        </div>
      </div>
    </div>
  );
};
