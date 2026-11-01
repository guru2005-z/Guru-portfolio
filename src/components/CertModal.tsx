import React from 'react';
import { X, ShieldCheck, Download, ExternalLink } from 'lucide-react';

interface CertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertModal: React.FC<CertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#d5d1c5] rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6e3da] pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#0078D4]" />
            <div>
              <h3 className="font-bold text-base text-[#161514]">
                Microsoft Certified: Azure Fundamentals (AZ-900)
              </h3>
              <p className="text-xs text-[#6e6b63] font-mono">
                Credential ID: 5B48115BB42E21FC · July 3, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
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
      </div>
    </div>
  );
};
