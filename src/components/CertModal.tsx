import React, { useState } from 'react';
import { X, ShieldCheck, Download, Award, Briefcase, ExternalLink } from 'lucide-react';

interface CertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCert?: 'az900' | 'mlsa' | 'infosys';
}

export const CertModal: React.FC<CertModalProps> = ({ isOpen, onClose, defaultCert = 'az900' }) => {
  const [activeTab, setActiveTab] = useState<'az900' | 'mlsa' | 'infosys'>(defaultCert);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#d5d1c5] rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-left max-h-[92vh] overflow-y-auto">
        
        {/* Tab Switcher & Close Button */}
        <div className="flex items-center justify-between border-b border-[#e6e3da] pb-3 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('az900')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'az900'
                  ? 'bg-[#161514] text-white shadow-xs'
                  : 'bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0078D4]" />
              <span>Azure AZ-900</span>
            </button>
            <button
              onClick={() => setActiveTab('mlsa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mlsa'
                  ? 'bg-[#161514] text-white shadow-xs'
                  : 'bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Microsoft MLSA</span>
            </button>
            <button
              onClick={() => setActiveTab('infosys')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'infosys'
                  ? 'bg-[#161514] text-white shadow-xs'
                  : 'bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#007cc3]" />
              <span>Infosys Internship</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {activeTab === 'az900' && (
          <>
            {/* Azure AZ-900 Header */}
            <div>
              <h3 className="font-bold text-base text-[#161514]">
                Microsoft Certified: Azure Fundamentals (AZ-900)
              </h3>
              <p className="text-xs text-[#6e6b63] font-mono">
                Credential ID: 5B48115BB42E21FC · Verified Microsoft Credential
              </p>
            </div>

            {/* Certificate Image */}
            <div className="rounded-lg border border-[#e6e3da] bg-[#0c0c0c] p-2 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/image_dedf00ae.png"
                alt="Microsoft Certified Azure Fundamentals - Katta Guravaiah"
                className="max-h-[380px] w-auto object-contain rounded"
              />
            </div>

            {/* Verification Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#f9f8f5] border border-[#e6e3da] rounded-lg text-xs font-mono">
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Candidate:</span>
                <span className="font-semibold text-[#161514]">Katta Guravaiah</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Cert Number:</span>
                <span className="font-semibold text-[#161514]">A10BH5-156616</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Signed by:</span>
                <span className="font-semibold text-[#161514]">Satya Nadella</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e6e3da]">
              <span className="text-xs font-mono text-[#16a34a] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
                Online Verifiable Credential
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="/assets/aistudio/image_dedf00ae.png"
                  download="Guravaiah_Katta_Azure_AZ900.png"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-xs font-mono text-[#161514] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-[#161514] text-white text-xs font-mono hover:bg-[#333] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'mlsa' && (
          <>
            {/* MLSA Header */}
            <div>
              <h3 className="font-bold text-base text-[#161514] flex items-center gap-2">
                <span>Microsoft Student Ambassadors | 2026</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  Associate
                </span>
              </h3>
              <p className="text-xs text-[#6e6b63] font-mono">
                Awarded to Katta Guravaiah · Global Student Ambassadors Community
              </p>
            </div>

            {/* Certificate Image */}
            <div className="rounded-lg border border-[#e6e3da] bg-[#ffffff] p-2 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src="/assets/mlsa-certificate.jpg"
                alt="Microsoft Student Ambassadors 2026 Associate Certificate - Katta Guravaiah"
                className="max-h-[380px] w-auto object-contain rounded"
              />
            </div>

            {/* Verification Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#f9f8f5] border border-[#e6e3da] rounded-lg text-xs font-mono">
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Presented to:</span>
                <span className="font-semibold text-[#161514]">Katta Guravaiah</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Designation:</span>
                <span className="font-semibold text-[#0078D4]">Student Ambassador (Associate)</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Signed by:</span>
                <span className="font-semibold text-[#161514]">Pablo Veramendi (Global Director)</span>
              </div>
            </div>

            {/* Recognition note */}
            <p className="text-xs text-[#6e6b63] leading-relaxed">
              "In recognition of your hard work and dedication as a member of the Student Ambassadors community." Signed by <strong className="text-[#161514]">Pablo Veramendi</strong>, Global Director | Microsoft Student Ambassadors.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e6e3da]">
              <span className="text-xs font-mono text-[#0078D4] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0078D4]"></span>
                Verified Microsoft MLSA Credential
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="/assets/mlsa-certificate.jpg"
                  download="Katta_Guravaiah_Microsoft_Student_Ambassador_2026.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-xs font-mono text-[#161514] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JPG</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-[#161514] text-white text-xs font-mono hover:bg-[#333] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'infosys' && (
          <>
            {/* Infosys Header */}
            <div>
              <h3 className="font-bold text-base text-[#161514] flex items-center gap-2">
                <span>Infosys Springboard: Certificate of Completion</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-100 text-sky-800 font-bold border border-sky-300">
                  Internship 6.0
                </span>
              </h3>
              <p className="text-xs text-[#6e6b63] font-mono">
                Internship 6.0 (B 11): Intelligent Forecasting System for Consumer Behavior and Industry Trends
              </p>
            </div>

            {/* Certificate Image */}
            <div className="rounded-lg border border-[#e6e3da] bg-[#ffffff] p-2 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src="/assets/infosys-certificate.jpg"
                alt="Infosys Springboard Internship 6.0 Certificate of Completion - Guravaiah Katta"
                className="max-h-[380px] w-auto object-contain rounded"
              />
            </div>

            {/* Verification Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#f9f8f5] border border-[#e6e3da] rounded-lg text-xs font-mono">
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Presented to:</span>
                <span className="font-semibold text-[#161514]">Guravaiah Katta</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Duration:</span>
                <span className="font-semibold text-[#161514]">Dec 22, 2025 – Feb 25, 2026</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Issued on:</span>
                <span className="font-semibold text-[#161514]">April 8, 2026</span>
              </div>
              <div>
                <span className="text-[#6e6b63] block text-[11px]">Signed by:</span>
                <span className="font-semibold text-[#007cc3]">Satheesha B. Nanjappa (SVP)</span>
              </div>
            </div>

            {/* Recognition note */}
            <p className="text-xs text-[#6e6b63] leading-relaxed">
              "For actively participating and completing the mandatory assignment related to Internship 6.0 (B 11): Intelligent Forecasting System for Consumer Behavior and Industry Trends conducted from December 22, 2025 to February 25, 2026." Signed by <strong className="text-[#161514]">Satheesha B. Nanjappa</strong>, Senior Vice President and Head, Education, Training and Assessment, Infosys Limited.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e6e3da]">
              <a
                href="https://verify.onwingspan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#007cc3] hover:underline flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify at verify.onwingspan.com</span>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="/assets/infosys-certificate.jpg"
                  download="Guravaiah_Katta_Infosys_Internship_Certificate.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-xs font-mono text-[#161514] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Certificate</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-[#161514] text-white text-xs font-mono hover:bg-[#333] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
