import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Award, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ExperienceEducationSectionProps {
  onOpenCertModal: () => void;
}

export const ExperienceEducationSection: React.FC<ExperienceEducationSectionProps> = ({ 
  onOpenCertModal 
}) => {
  return (
    <section id="experience" className="py-20 sm:py-28 border-b border-[#1c1c1c] bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#141414] border border-[#242424] text-[11px] font-mono text-[#D41514] uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Track Record & Academic Rigor</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Experience & Engineering Journey
          </h2>
          <p className="text-sm sm:text-base text-[#8E8D8C] mt-2 max-w-xl">
            Real client freelance software delivery, enterprise internship research, and competitive hackathon wins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Work & Internship Experience (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#D41514]" />
              <span>Work & Internship Experience</span>
            </h3>

            <div className="flex flex-col gap-6">
              {PORTFOLIO_DATA.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#222222] bg-[#111111] p-6 sm:p-7 hover:border-[#D41514]/50 transition-all flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e1e1e] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-lg text-white">
                          {exp.role}
                        </h4>
                        {exp.liveLink && (
                          <a
                            href={exp.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#D41514] hover:underline"
                          >
                            <span>Live Product</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#CDCBCA] mt-0.5 block">
                        {exp.company}
                      </span>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs font-mono text-[#8E8D8C]">
                      <span className="flex items-center gap-1 text-white/90">
                        <Calendar className="w-3 h-3 text-[#D41514]" />
                        {exp.period}
                      </span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="flex flex-col gap-2.5">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#CDCBCA]/90 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D41514] shrink-0 mt-2" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1a1a1a]">
                    {exp.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#181818] border border-[#262626] text-[11px] font-mono text-[#8E8D8C]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Education Card */}
            <div className="mt-4 rounded-2xl border border-[#222222] bg-[#111111] p-6 sm:p-7">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-[#D41514]" />
                <span>Education</span>
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e1e1e] pb-4">
                <div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-white">
                    {PORTFOLIO_DATA.personal.education.degree}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#CDCBCA]">
                    {PORTFOLIO_DATA.personal.education.institution}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end text-xs font-mono">
                  <span className="text-[#8E8D8C]">{PORTFOLIO_DATA.personal.education.timeline}</span>
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-[#D41514] font-bold mt-1">
                    CGPA: {PORTFOLIO_DATA.personal.education.cgpa}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#8E8D8C] mt-4 leading-relaxed">
                Coursework: Data Structures & Algorithms, Object-Oriented Programming (Java), Database Management Systems (PostgreSQL), Operating Systems, Computer Networks, Software Engineering.
              </p>
            </div>
          </div>

          {/* Right Column: Achievements & Certifications (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Certifications Card */}
            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#0078D4]" />
                <span>Verified Certifications</span>
              </h3>

              <div className="rounded-2xl border border-[#242424] bg-[#111111] p-6 flex flex-col gap-4">
                {/* Azure AZ-900 Banner */}
                <div 
                  onClick={onOpenCertModal}
                  className="rounded-xl border border-[#0078D4]/40 bg-[#0e1622] p-4 cursor-pointer hover:border-[#0078D4] hover:shadow-[0_0_20px_rgba(0,120,212,0.2)] transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0078D4]/20 border border-[#0078D4]/40 flex items-center justify-center text-[#0078D4] font-bold shrink-0">
                        ☁️
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-[#5cb3ff] transition-colors">
                          Microsoft Certified: Azure Fundamentals
                        </h4>
                        <span className="text-[11px] font-mono text-[#8E8D8C]">
                          Exam AZ-900 • Issued July 3, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#CDCBCA] pt-2 border-t border-[#1a2538]">
                    <span>ID: 5B48115BB42E21FC</span>
                    <span className="text-[#0078D4] underline text-[11px]">Click to View Certificate ↗</span>
                  </div>
                </div>

                {/* Kaggle GenAI Specialization */}
                <div className="rounded-xl border border-[#222222] bg-[#161616] p-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-white">
                      Kaggle GenAI 2025 Agents Intensive Capstone
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202020] text-[#D41514]">
                      2025
                    </span>
                  </div>
                  <span className="text-xs text-[#8E8D8C]">
                    Google & Kaggle Capstone: Multi-agent systems, function calling, RAG pipelines.
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div id="achievements">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#D41514]" />
                <span>Honors & Key Milestones</span>
              </h3>

              <div className="flex flex-col gap-3">
                {PORTFOLIO_DATA.achievements.map((ach, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[#222222] bg-[#111111] hover:border-[#D41514]/40 transition-colors flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#282828] flex items-center justify-center text-[#D41514] shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-[#8E8D8C] mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
