import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';

interface EducationSectionProps {
  onOpenCertModal: (certKey?: 'az900' | 'mlsa' | 'infosys') => void;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

interface CertPreviewMeta {
  title: string;
  issuer: string;
  signee: string;
  image: string;
  badge: string;
  badgeBg: string;
  tag: string;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ onOpenCertModal }) => {
  const [hoveredCert, setHoveredCert] = useState<'az900' | 'mlsa' | 'infosys' | null>(null);

  // Smooth mouse follower for floating certificate preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const certPreviews: Record<'az900' | 'mlsa' | 'infosys', CertPreviewMeta> = {
    az900: {
      title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
      issuer: 'Microsoft Corporation',
      signee: 'Satya Nadella (CEO, Microsoft)',
      image: '/assets/aistudio/image_dedf00ae.png',
      badge: 'AZURE AZ-900 CERTIFIED',
      badgeBg: 'bg-[#0078D4]',
      tag: 'CREDENTIAL ID: 5B48115BB42E21FC'
    },
    mlsa: {
      title: 'Microsoft Student Ambassadors | 2026',
      issuer: 'Microsoft Global Student Community',
      signee: 'Pablo Veramendi (Global Director)',
      image: '/assets/mlsa-certificate.jpg',
      badge: 'MLSA 2026 · ASSOCIATE',
      badgeBg: 'bg-amber-600',
      tag: 'STUDENT AMBASSADOR'
    },
    infosys: {
      title: 'Infosys Springboard Internship 6.0',
      issuer: 'Infosys Limited',
      signee: 'Satheesha B. Nanjappa (SVP & Head)',
      image: '/assets/infosys-certificate.jpg',
      badge: 'INTERNSHIP COMPLETION',
      badgeBg: 'bg-[#007cc3]',
      tag: 'VERIFIED ON WINGSPAN'
    }
  };

  const activePreview = hoveredCert ? certPreviews[hoveredCert] : null;

  return (
    <section 
      id="education" 
      onMouseMove={handleContainerMouseMove}
      className="relative py-16 sm:py-24 border-b border-[#e6e3da] overflow-visible"
    >
      {/* Floating Certificate Image Preview Window */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.85, rotate: -3 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: smoothX,
              top: smoothY,
              x: '-35%',
              y: '-65%',
              pointerEvents: 'none',
              zIndex: 60,
            }}
            className="hidden lg:block select-none"
          >
            <div className="relative">
              {/* Floating Pill on top-left */}
              <div className={`absolute -top-3.5 -left-3.5 z-20 px-3 py-1 rounded-full ${activePreview.badgeBg} text-white flex items-center justify-center font-bold text-[10px] font-mono uppercase tracking-wider shadow-2xl ring-4 ring-white/10 select-none`}>
                <span>{activePreview.badge} ↗</span>
              </div>

              {/* Certificate Card Window */}
              <div className="w-[380px] rounded-xl overflow-hidden border border-[#3b3561] bg-[#161426] shadow-2xl p-3 text-left flex flex-col gap-2.5">
                {/* Top header bar */}
                <div className="flex items-center justify-between border-b border-[#2b274c] pb-1.5">
                  <span className="font-mono text-[10px] text-[#a5a0cb]">
                    {activePreview.tag}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                    Official Verified
                  </span>
                </div>

                {/* High Resolution Real Certificate Image */}
                <div className="w-full h-[220px] rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center shadow-inner p-1">
                  <img
                    src={activePreview.image}
                    alt={activePreview.title}
                    className="w-full h-full object-contain rounded"
                  />
                </div>

                {/* Bottom title & action hint */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-xs font-bold text-white truncate max-w-[260px]">
                    {activePreview.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#a5a0cb] shrink-0">
                    Click to inspect ↗
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left"
      >
        
        {/* Section Header */}
        <motion.div variants={itemFadeUp} className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-10">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">08</span>
            <span>Education & certifications</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            2023 – 2027
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Degree Card */}
          <div className="md:col-span-6 p-6 rounded-xl border border-[#d5d1c5] bg-[#ffffff] shadow-xs flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#161514]">
                B.Tech, Computer Science & Engineering
              </h3>
              <p className="text-xs font-mono text-[#6e6b63] mt-0.5">
                N.B.K.R. Institute of Science and Technology · 2023 – 2027
              </p>
            </div>

            {/* Grade highlight matching mohammad-rizwan.tech */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#f9f8f5] border border-[#e6e3da] font-mono">
              <div>
                <b className="text-2xl text-[#161514] block">8.17</b>
                <span className="text-xs text-[#6e6b63]">CGPA</span>
              </div>
              <div>
                <b className="text-sm font-bold text-[#16a34a] block mt-1">First Class</b>
                <span className="text-xs text-[#6e6b63]">Distinction</span>
              </div>
            </div>

            <p className="text-xs text-[#6e6b63] leading-relaxed">
              Core Coursework: Data Structures & Algorithms, Object-Oriented Programming (Java), Database Management Systems (PostgreSQL), Operating Systems, Computer Networks.
            </p>
          </div>

          {/* Certifications List */}
          <div className="md:col-span-6 flex flex-col gap-3">
            
            {/* Clickable Azure AZ-900 Card */}
            <div
              onMouseEnter={() => setHoveredCert('az900')}
              onMouseLeave={() => setHoveredCert(null)}
              onClick={() => onOpenCertModal('az900')}
              className="p-4 rounded-xl border border-[#0078D4]/40 bg-[#f4f9ff] hover:border-[#0078D4] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0078D4]/15 border border-[#0078D4]/30 flex items-center justify-center text-[#0078D4] shrink-0 font-bold">
                  ☁️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#161514] group-hover:text-[#0078D4] transition-colors">
                    Microsoft Certified: Azure Fundamentals (AZ-900)
                  </h4>
                  <span className="text-xs font-mono text-[#6e6b63]">
                    ID: 5B48115BB42E21FC · Verified Credential
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#0078D4] group-hover:underline shrink-0">
                View ↗
              </span>
            </div>

            {/* Clickable Microsoft Student Ambassador (MLSA) Card */}
            <div
              onMouseEnter={() => setHoveredCert('mlsa')}
              onMouseLeave={() => setHoveredCert(null)}
              onClick={() => onOpenCertModal('mlsa')}
              className="p-4 rounded-xl border border-amber-500/40 bg-[#fffbeb] hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0 font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#161514] group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                    <span>Microsoft Student Ambassadors | 2026</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-200 text-amber-900 font-bold">Associate</span>
                  </h4>
                  <span className="text-xs font-mono text-[#6e6b63]">
                    Signed by Pablo Veramendi · Global Community
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-amber-700 group-hover:underline shrink-0">
                View ↗
              </span>
            </div>

            {/* Clickable Infosys Springboard Internship Card */}
            <div
              onMouseEnter={() => setHoveredCert('infosys')}
              onMouseLeave={() => setHoveredCert(null)}
              onClick={() => onOpenCertModal('infosys')}
              className="p-4 rounded-xl border border-[#007cc3]/40 bg-[#f0f9ff] hover:border-[#007cc3] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#007cc3]/15 border border-[#007cc3]/30 flex items-center justify-center text-[#007cc3] shrink-0 font-bold">
                  🏢
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#161514] group-hover:text-[#007cc3] transition-colors flex items-center gap-1.5">
                    <span>Infosys Springboard Internship 6.0</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-200 text-sky-900 font-bold">Verified</span>
                  </h4>
                  <span className="text-xs font-mono text-[#6e6b63]">
                    Intelligent Forecasting System · verify.onwingspan.com
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#007cc3] group-hover:underline shrink-0">
                View ↗
              </span>
            </div>

            {/* Other Certifications */}
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li className="p-3 rounded-lg border border-[#e6e3da] bg-[#ffffff] flex items-center justify-between">
                <span className="text-[#161514]">Kaggle GenAI 2025 Agents Intensive Capstone</span>
                <span className="text-[#9c988d]">2025</span>
              </li>
              <li className="p-3 rounded-lg border border-[#e6e3da] bg-[#ffffff] flex items-center justify-between">
                <span className="text-[#161514]">300+ Solved DSA Problems (LeetCode & CodeChef)</span>
                <span className="text-[#16a34a] font-semibold">Verified</span>
              </li>
              <li className="p-3 rounded-lg border border-[#e6e3da] bg-[#ffffff] flex items-center justify-between">
                <span className="text-[#161514]">Java & Spring Boot REST Architecture</span>
                <span className="text-[#9c988d]">2026</span>
              </li>
              <li className="p-3 rounded-lg border border-[#e6e3da] bg-[#ffffff] flex items-center justify-between">
                <span className="text-[#161514]">PostgreSQL Relational DB & Concurrency</span>
                <span className="text-[#9c988d]">2026</span>
              </li>
            </ul>
          </div>

        </div>

      </motion.div>
    </section>
  );
};
