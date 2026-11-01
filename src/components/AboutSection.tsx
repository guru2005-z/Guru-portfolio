import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Sparkles, Terminal, ShieldCheck, Zap, Database, Server, Cpu } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface HighlightMeta {
  title: string;
  codeSnippet: string;
  metric: string;
  icon: React.ReactNode;
}

const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
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

export const AboutSection: React.FC = () => {
  // 3D Tilt for GK Monogram Avatar Card
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Active highlighted tech keyword inspection
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  // Mouse spotlight coordinates for the 3 stat cards
  const [cardMousePos, setCardMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    // Subtle tilt angles (-10deg to +10deg)
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    setTilt({ rx, ry, px, py });
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  const handleStatCardMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardMousePos((prev) => ({
      ...prev,
      [id]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  };

  const techMetadata: { [key: string]: HighlightMeta } = {
    'Spring Boot REST APIs': {
      title: 'Enterprise Java Architecture',
      codeSnippet: '@RestController @Validated public class BookingController',
      metric: '< 45ms P99 Latency',
      icon: <Server className="w-3.5 h-3.5 text-emerald-600" />
    },
    'atomic double-booking locks': {
      title: 'Row-Level Isolation',
      codeSnippet: 'SELECT * FROM slots WHERE id = :id FOR UPDATE',
      metric: '0 Race Conditions',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
    },
    'JWT authentication': {
      title: 'Stateless Security',
      codeSnippet: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      metric: 'HMAC-SHA256 Token Auth',
      icon: <Zap className="w-3.5 h-3.5 text-amber-600" />
    },
    'PostgreSQL transactions': {
      title: 'ACID Data Layer',
      codeSnippet: 'BEGIN; UPDATE balance; INSERT log; COMMIT;',
      metric: 'Neon Serverless / Cloud SQL',
      icon: <Database className="w-3.5 h-3.5 text-indigo-600" />
    },
    'grounded RAG retrieval': {
      title: 'Context Engine',
      codeSnippet: 'SimilaritySearch(embeddings, topK=5) + Grounding',
      metric: 'Gemini 3.8 / Vector Search',
      icon: <Cpu className="w-3.5 h-3.5 text-cyan-600" />
    }
  };

  return (
    <section id="about" className="py-16 sm:py-24 border-b border-[#e6e3da] relative">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left relative z-10"
      >
        
        {/* Section Header with Live Status Tag */}
        <motion.div variants={itemFadeUp} className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-10">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">01</span>
            <span>About</span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#bbf7d0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
              <span>Available for Hire</span>
            </span>
            <span className="font-mono text-xs text-[#6e6b63]">
              Andhra Pradesh · B.Tech CSE ’27
            </span>
          </div>
        </motion.div>

        {/* Content Box */}
        <motion.div variants={sectionFadeUp} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Avatar / Monogram Box with 3D Tilt Parallax on Mouse Movement */}
          <div className="md:col-span-4 flex flex-col gap-3 items-center md:items-start">
            <div 
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={handleCardMouseLeave}
              className="w-full aspect-square max-w-[220px] rounded-xl border border-[#d5d1c5] bg-[#ffffff] p-2.5 shadow-xs cursor-pointer transition-all duration-150 ease-out select-none relative group overflow-hidden"
              style={{
                perspective: '800px',
                transform: isCardHovered
                  ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.03, 1.03, 1.03)`
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
              }}
            >
              {/* Dynamic mouse light reflection sheen */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20 rounded-xl"
                style={{
                  background: `radial-gradient(circle 120px at ${tilt.px}% ${tilt.py}%, rgba(255, 255, 255, 0.7), transparent)`
                }}
              />

              <div className="w-full h-full rounded-lg bg-[#f4f2ec] border border-[#e6e3da] flex flex-col items-center justify-center p-3 relative overflow-hidden transition-colors group-hover:bg-[#f0ede4]">
                
                {/* Decorative background grid pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#161514_1px,transparent_1px)] [background-size:12px_12px]" />

                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#161514] shadow-md relative z-10 group-hover:scale-105 transition-transform bg-[#161514]">
                  <img 
                    src="/guravaiah-katta.png" 
                    alt="Guravaiah Katta" 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>

                <span className="text-xs font-mono font-medium text-[#161514] mt-3 relative z-10">Guravaiah Katta</span>
                <span className="text-[10px] font-mono font-medium text-[#d41514] bg-[#ffebeb] border border-[#ffcccc] px-2 py-0.5 rounded-full mt-1.5 relative z-10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d41514] animate-ping"></span>
                  <span>Full-Stack & AI</span>
                </span>

                {/* Subtle mouse hover indicator */}
                <span className="text-[9px] font-mono text-[#9c988d] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  3D Interactive Card
                </span>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="max-w-[220px] p-2 rounded-lg border border-[#e6e3da] bg-[#ffffff] font-mono text-[11px] text-[#6e6b63] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#161514]">
                <Terminal className="w-3.5 h-3.5 text-[#6e6b63]" />
                <span>Stack status</span>
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Healthy
              </span>
            </div>
          </div>

          {/* Bio text with Interactive Tech Keywords */}
          <div className="md:col-span-8 flex flex-col gap-4 text-sm sm:text-base text-[#161514] leading-relaxed">
            <p className="text-base sm:text-lg font-medium text-[#161514]">
              I’m Guravaiah Katta, a software engineer and full-stack developer in India building robust backend systems, concurrent web applications, and AI pipelines.
            </p>

            <div className="text-[#55524b] leading-relaxed">
              <span>I build scalable applications and the core systems around them:{' '}</span>
              {[
                'Spring Boot REST APIs',
                'atomic double-booking locks',
                'JWT authentication',
                'PostgreSQL transactions',
                'grounded RAG retrieval'
              ].map((tech, idx) => (
                <React.Fragment key={tech}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveKeyword(tech)}
                    onMouseLeave={() => setActiveKeyword((prev) => (prev === tech ? null : prev))}
                    onClick={() => setActiveKeyword((prev) => (prev === tech ? null : tech))}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded font-medium text-xs sm:text-sm cursor-pointer transition-all ${
                      activeKeyword === tech
                        ? 'bg-[#161514] text-white shadow-xs scale-105'
                        : 'bg-[#fff5cc] text-[#161514] hover:bg-[#ffe082]'
                    }`}
                  >
                    <span>{tech}</span>
                    <Sparkles className={`w-3 h-3 ${activeKeyword === tech ? 'text-amber-300' : 'text-[#9c988d]'}`} />
                  </button>
                  {idx < 4 ? ', ' : ' with vector databases.'}
                </React.Fragment>
              ))}
            </div>

            {/* Dynamic Interactive Inspector Tooltip for Active Keyword */}
            {activeKeyword && techMetadata[activeKeyword] && (
              <div className="p-3.5 rounded-xl border border-[#161514] bg-[#161514] text-white font-mono text-xs shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    {techMetadata[activeKeyword].icon}
                    <span className="font-bold text-white text-xs">{techMetadata[activeKeyword].title}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                    {techMetadata[activeKeyword].metric}
                  </span>
                </div>
                <div className="bg-neutral-900 px-3 py-1.5 rounded text-[#86efac] font-mono text-[11px] overflow-x-auto">
                  <code>{techMetadata[activeKeyword].codeSnippet}</code>
                </div>
              </div>
            )}

            <p className="text-[#6e6b63]">
              Currently developing freelance client platforms like{' '}
              <a 
                href={PORTFOLIO_DATA.personal.socialLinks.freelanceLive}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#161514] font-semibold underline underline-offset-4 hover:text-[#d41514] inline-flex items-center gap-1 group"
              >
                <span>Gully United</span>
                <span className="font-mono text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>{' '}
              (a commercial cricket venue reservation platform), building open-source projects, and exploring distributed cloud systems on Microsoft Azure.
            </p>

            {/* Key-Value Definition Cards with Mouse-Tracking Spotlight */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#e6e3da] font-mono text-xs">
              
              {/* Card 1: Based in */}
              <div 
                onMouseMove={(e) => handleStatCardMouseMove('card1', e)}
                className="p-3.5 bg-[#ffffff] border border-[#e6e3da] hover:border-[#161514] rounded-lg relative overflow-hidden transition-colors shadow-xs group"
              >
                {/* Mouse cursor spotlight */}
                {cardMousePos['card1'] && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle 90px at ${cardMousePos['card1'].x}px ${cardMousePos['card1'].y}px, rgba(212, 21, 20, 0.08), transparent)`
                    }}
                  />
                )}
                <dt className="text-[#9c988d] mb-1 flex items-center justify-between">
                  <span>Based in</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                </dt>
                <dd className="font-semibold text-[#161514]">Andhra Pradesh, India</dd>
              </div>

              {/* Card 2: Focus */}
              <div 
                onMouseMove={(e) => handleStatCardMouseMove('card2', e)}
                className="p-3.5 bg-[#ffffff] border border-[#e6e3da] hover:border-[#161514] rounded-lg relative overflow-hidden transition-colors shadow-xs group"
              >
                {/* Mouse cursor spotlight */}
                {cardMousePos['card2'] && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle 90px at ${cardMousePos['card2'].x}px ${cardMousePos['card2'].y}px, rgba(99, 102, 241, 0.1), transparent)`
                    }}
                  />
                )}
                <dt className="text-[#9c988d] mb-1 flex items-center justify-between">
                  <span>Focus</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
                </dt>
                <dd className="font-semibold text-[#161514]">Java, Spring Boot, React, AI</dd>
              </div>

              {/* Card 3: Studied */}
              <div 
                onMouseMove={(e) => handleStatCardMouseMove('card3', e)}
                className="p-3.5 bg-[#ffffff] border border-[#e6e3da] hover:border-[#161514] rounded-lg relative overflow-hidden transition-colors shadow-xs group"
              >
                {/* Mouse cursor spotlight */}
                {cardMousePos['card3'] && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle 90px at ${cardMousePos['card3'].x}px ${cardMousePos['card3'].y}px, rgba(16, 185, 129, 0.1), transparent)`
                    }}
                  />
                )}
                <dt className="text-[#9c988d] mb-1 flex items-center justify-between">
                  <span>Studied</span>
                  <span className="text-[10px] text-emerald-600 font-bold">8.17 CGPA</span>
                </dt>
                <dd className="font-semibold text-[#161514]">B.Tech CSE, NBKRIST ’27</dd>
              </div>

            </dl>

            {/* Quick interactive hint */}
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#9c988d]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#161514]"></span>
              <span>Tip: Hover or move cursor over the highlight tags and cards to inspect architecture parameters.</span>
            </div>

          </div>

        </motion.div>

      </motion.div>
    </section>
  );
};
