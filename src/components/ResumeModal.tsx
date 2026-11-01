import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  X, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'pdf'>('structured');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `Guravaiah Katta - Full-Stack & AI Software Engineer\nEmail: ${PORTFOLIO_DATA.personal.email}\nPhone: ${PORTFOLIO_DATA.personal.phone}\nLinkedIn: ${PORTFOLIO_DATA.personal.socialLinks.linkedin}\nGitHub: ${PORTFOLIO_DATA.personal.socialLinks.github}\nEducation: B.Tech CSE (2023-2027) NBKRIST, CGPA: 8.17/10\nKey Skills: Java, Spring Boot, React, PostgreSQL, REST APIs, Microsoft Azure (AZ-900), Python, NLP/ML.`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#222222] bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D41514]/15 border border-[#D41514]/40 flex items-center justify-center text-[#D41514]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                Guravaiah Katta — Official Resume
              </h3>
              <p className="text-xs font-mono text-[#8E8D8C]">
                Software Engineering Intern & Full-Stack Developer • Updated 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PORTFOLIO_DATA.personal.resumePath}
              download="Guravaiah_Katta_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#D41514] hover:bg-[#b0100f] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(212,21,20,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#282828] bg-[#161616] text-[#8E8D8C] hover:text-white hover:border-[#444] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#202020] bg-[#141414]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'structured'
                  ? 'bg-[#D41514] text-white font-bold'
                  : 'text-[#8E8D8C] hover:text-[#CDCBCA]'
              }`}
            >
              Structured Document View
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'pdf'
                  ? 'bg-[#D41514] text-white font-bold'
                  : 'text-[#8E8D8C] hover:text-[#CDCBCA]'
              }`}
            >
              Original PDF Frame
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#8E8D8C] hover:text-[#CDCBCA]"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Brief</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'pdf' ? (
            <div className="w-full h-[65vh] rounded-xl border border-[#222222] bg-[#161616] overflow-hidden flex flex-col items-center justify-center">
              <iframe
                src={`${PORTFOLIO_DATA.personal.resumePath}#toolbar=0`}
                className="w-full h-full border-none"
                title="Resume PDF"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {/* Header Box */}
              <div className="border-b border-[#242424] pb-4">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  Guravaiah Katta
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[#CDCBCA] mt-2">
                  <span>✉ {PORTFOLIO_DATA.personal.email}</span>
                  <span>☎ {PORTFOLIO_DATA.personal.phone}</span>
                  <a href={PORTFOLIO_DATA.personal.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[#0077B5] underline">
                    LinkedIn
                  </a>
                  <a href={PORTFOLIO_DATA.personal.socialLinks.github} target="_blank" rel="noreferrer" className="text-white underline">
                    GitHub
                  </a>
                </div>
              </div>

              {/* Career Objective */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D41514] font-bold">
                  Career Objective
                </h4>
                <p className="text-xs sm:text-sm text-[#CDCBCA] leading-relaxed">
                  Motivated Computer Science undergraduate seeking a Software Engineering internship / role to apply strong programming fundamentals and hands-on experience in Java, Spring Boot, React, REST APIs, and PostgreSQL. Experienced in building secure, scalable full-stack applications with JWT authentication and database integration, with additional exposure to Artificial Intelligence and Microsoft Azure. Eager to contribute to real-world software projects while continuously developing strong engineering and problem-solving skills.
                </p>
              </div>

              {/* Education */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D41514] font-bold">
                  Education
                </h4>
                <div className="p-3.5 rounded-xl border border-[#222222] bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h5 className="font-display font-bold text-sm text-white">
                      B.Tech in Computer Science and Engineering
                    </h5>
                    <span className="text-xs text-[#8E8D8C]">
                      N.B.K.R Institute of Science and Technology
                    </span>
                  </div>
                  <div className="text-xs font-mono text-right">
                    <span className="text-[#8E8D8C]">2023 – 2027</span>
                    <span className="block text-[#D41514] font-bold">CGPA: 8.17 / 10</span>
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D41514] font-bold">
                  Technical Skills Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
                    <span className="text-[#8E8D8C] block text-[11px]">Languages:</span>
                    <span className="text-white">Java, Python, C, JavaScript, TypeScript</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
                    <span className="text-[#8E8D8C] block text-[11px]">Backend Frameworks:</span>
                    <span className="text-white">Spring Boot, Spring Security, JPA/Hibernate</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
                    <span className="text-[#8E8D8C] block text-[11px]">Web Technologies:</span>
                    <span className="text-white">React, HTML, CSS, REST APIs, Tailwind CSS</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
                    <span className="text-[#8E8D8C] block text-[11px]">Databases & Cloud:</span>
                    <span className="text-white">PostgreSQL, SQL, H2, Pinecone, Microsoft Azure</span>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D41514] font-bold">
                  Experience
                </h4>
                {PORTFOLIO_DATA.experiences.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#222222] bg-[#141414] flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <span className="font-display font-bold text-sm text-white">
                        {exp.role} — <span className="text-[#CDCBCA]">{exp.company}</span>
                      </span>
                      <span className="text-xs font-mono text-[#8E8D8C]">{exp.period}</span>
                    </div>
                    <ul className="flex flex-col gap-1.5 mt-1">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-[#CDCBCA] flex items-start gap-2">
                          <span className="text-[#D41514] mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Achievements & Certifications */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D41514] font-bold">
                  Certifications & Honors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-[#CDCBCA]">
                    <strong className="text-white block font-display">Microsoft Certified: Azure Fundamentals (AZ-900)</strong>
                    <span className="text-[#8E8D8C] font-mono text-[11px]">Credential ID: 5B48115BB42E21FC</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-[#CDCBCA]">
                    <strong className="text-white block font-display">1st Place — Cybersecurity Hackathon</strong>
                    <span className="text-[#8E8D8C] font-mono text-[11px]">36-hour competitive security tooling</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-[#CDCBCA]">
                    <strong className="text-white block font-display">300+ Solved DSA Problems</strong>
                    <span className="text-[#8E8D8C] font-mono text-[11px]">LeetCode & CodeChef algorithmic problem solving</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-[#CDCBCA]">
                    <strong className="text-white block font-display">IEEE Vice Chairperson — NBKRIST</strong>
                    <span className="text-[#8E8D8C] font-mono text-[11px]">Student branch leadership & tech symposiums</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#111111] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#8E8D8C]">
            Target File: /public/Guravaiah_Katta_Resume.pdf
          </span>
          <a
            href={PORTFOLIO_DATA.personal.resumePath}
            download="Guravaiah_Katta_Resume.pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D41514] text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#b0100f]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};
