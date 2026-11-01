import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.55, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export const WorkSection: React.FC = () => {
  return (
    <section id="work" className="py-16 sm:py-24 border-b border-[#e6e3da]">
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
            <span className="font-mono text-xs text-[#9c988d]">03</span>
            <span>Work</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            2 roles · Freelance & Enterprise Internship
          </span>
        </motion.div>

        {/* Timeline List matching mohammad-rizwan.tech */}
        <ul className="flex flex-col gap-8">
          
          {/* Gully United */}
          <motion.li variants={itemFadeUp} className="p-5 sm:p-6 rounded-xl border border-[#d5d1c5] bg-[#ffffff] shadow-xs relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e3da] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#6e6b63]">2026 – now</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#161514] text-white font-bold">
                  current
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#ffebeb] text-[#d41514] font-bold">
                  freelance
                </span>
              </div>
              <a
                href={PORTFOLIO_DATA.personal.socialLinks.freelanceLive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-[#d41514] hover:underline"
              >
                <span>Live App: gully-united-xlv.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#161514]">
                Gully United
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#6e6b63] font-mono mt-0.5">
                Freelance Software Developer
              </p>
            </div>

            <p className="text-sm text-[#161514] leading-relaxed">
              Developing a full-stack commercial cricket ground booking platform using <mark>Java</mark>, <mark>Spring Boot</mark>, <mark>React</mark>, and <mark>PostgreSQL</mark>, enabling venue owners to manage slots and players to reserve turfs.
            </p>

            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#6e6b63]">
              <li className="flex items-start gap-2">
                <span className="text-[#161514] mt-1">•</span>
                <span>Implementing Razorpay payments, role-based JWT authentication, atomic double-booking prevention, and QR-based booking confirmation at the gate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#161514] mt-1">•</span>
                <span>Integrated Google Maps API for interactive venue discovery and custom owner admin dashboard for slot pricing and revenue tracking.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f0ede6]">
              {['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'JPA/Hibernate', 'Spring Security', 'JWT', 'Razorpay', 'Google Maps'].map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-[#f0ede6] text-[11px] font-mono text-[#161514]">
                  {tech}
                </span>
              ))}
            </div>
          </motion.li>

          {/* Infosys Springboard */}
          <motion.li variants={itemFadeUp} className="p-5 sm:p-6 rounded-xl border border-[#e6e3da] bg-[#ffffff] shadow-xs relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e3da] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#6e6b63]">Jan 2026 – Mar 2026</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#f0ede6] text-[#6e6b63]">
                  internship
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#d41514] hover:underline"
                >
                  <span>Live App (Streamlit)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#6e6b63] hover:text-[#161514] hover:underline"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#161514]">
                Infosys Springboard
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#6e6b63] font-mono mt-0.5">
                Virtual AI Research Intern
              </p>
            </div>

            <p className="text-sm text-[#161514] leading-relaxed">
              Developed an AI-based consumer sentiment analysis system using <mark>NLP</mark> and machine learning techniques, deploying an interactive live forecaster dashboard on <mark>Streamlit Cloud</mark>.
            </p>

            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#6e6b63]">
              <li className="flex items-start gap-2">
                <span className="text-[#161514] mt-1">•</span>
                <span>Designed end-to-end data processing and model inference pipeline with RAG and vector retrieval.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#161514] mt-1">•</span>
                <span>Implemented text normalization, TF-IDF representations, and scikit-learn model benchmarking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#161514] mt-1">•</span>
                <span>Shipped public web dashboard on Streamlit with interactive sentiment visualization and market metrics.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f0ede6]">
              {['Python', 'Streamlit', 'Scikit-learn', 'NLP', 'Machine Learning', 'RAG', 'Pandas'].map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-[#f0ede6] text-[11px] font-mono text-[#161514]">
                  {tech}
                </span>
              ))}
            </div>
          </motion.li>

        </ul>

      </motion.div>
    </section>
  );
};
