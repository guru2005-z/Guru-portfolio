import React from 'react';
import { motion, type Variants } from 'framer-motion';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export const PrinciplesSection: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'State lives in code & database, not client memory',
      desc: 'Database row locks and transaction isolation levels enforce scheduling constraints. The client UI reflects server authority, never optimistic guesses.',
      proof: [
        { name: 'Gully United', href: '#projects' }
      ]
    },
    {
      num: '02',
      title: 'Every payment & external API has a way down',
      desc: 'Razorpay webhook retries, signature validations, and atomic rollbacks ensure zero orphan charges during network or gateway hiccups.',
      proof: [
        { name: 'Gully United', href: '#projects' },
        { name: 'KhetConnect', href: '#projects' }
      ]
    },
    {
      num: '03',
      title: 'Cite it or don’t say it: Grounded RAG',
      desc: 'Predictions and contextual queries query Pinecone vector embeddings (k=8) first. When context is insufficient, the model declines rather than hallucinates.',
      proof: [
        { name: 'AI Sentiment Forecaster', href: '#projects' }
      ]
    },
    {
      num: '04',
      title: 'Atomic concurrency prevents race collisions',
      desc: 'When two users tap the final cricket turf slot simultaneously, database lock isolation guarantees exactly one success and a deterministic error for the other.',
      proof: [
        { name: 'Gully United', href: '#projects' }
      ]
    },
    {
      num: '05',
      title: 'Think like the attacker: Zero trust',
      desc: 'Role-based JWT filters, stateless token verification, and strict DTO schemas ensure hidden administrative data is never leaked to client views.',
      proof: [
        { name: 'CyberShield Sentinel', href: '#projects' },
        { name: 'Gully United', href: '#projects' }
      ]
    },
    {
      num: '06',
      title: 'Crashes resume, they don’t restart',
      desc: 'Batch processing jobs and background workers checkpoint state as they execute, so any network interruption picks up exactly where it stopped.',
      proof: [
        { name: 'KhetConnect', href: '#projects' },
        { name: 'Gully United', href: '#projects' }
      ]
    }
  ];

  return (
    <section id="principles" className="py-16 sm:py-24 border-b border-[#e6e3da]">
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
            <span className="font-mono text-xs text-[#9c988d]">05</span>
            <span>How I build</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            6 habits, each with receipts
          </span>
        </motion.div>

        {/* Principles List */}
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((pr) => (
            <motion.li
              variants={itemFadeUp}
              key={pr.num}
              className="p-5 sm:p-6 rounded-xl border border-[#e6e3da] bg-[#ffffff] shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-[#9c988d] font-bold">
                  {pr.num}
                </span>
                <h3 className="font-bold text-base text-[#161514] leading-snug">
                  {pr.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6e6b63] leading-relaxed">
                  {pr.desc}
                </p>
              </div>

              {/* Proof / Seen in links */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#f0ede6] text-xs font-mono">
                <span className="text-[#9c988d]">seen in</span>
                {pr.proof.map((pf) => (
                  <a
                    key={pf.name}
                    href={pf.href}
                    className="px-2 py-0.5 rounded bg-[#f0ede6] text-[#161514] hover:bg-[#161514] hover:text-white transition-colors"
                  >
                    {pf.name}
                  </a>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>

      </motion.div>
    </section>
  );
};
