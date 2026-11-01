import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';

interface EducationSectionProps {
  onOpenCertModal: () => void;
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

export const EducationSection: React.FC<EducationSectionProps> = ({ onOpenCertModal }) => {
  return (
    <section id="education" className="py-16 sm:py-24 border-b border-[#e6e3da]">
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
              onClick={onOpenCertModal}
              className="p-4 rounded-xl border border-[#0078D4]/40 bg-[#f4f9ff] hover:border-[#0078D4] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
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
