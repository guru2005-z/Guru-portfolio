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

export const EventsSection: React.FC = () => {
  const events = [
    {
      when: 'Apr 2025',
      title: 'Supraja Technologies CTF Hackathon',
      org: 'NBKRIST CSE & IEEE SB',
      desc: 'Won 1st Place overall (Team: Bug_Slayers, Rank #1 with 223 points on live scoreboard) and awarded "Best Student of the Cybersecurity Level-1 CTF Hackathon" (5-Star Certificate of Excellence) by Santosh Chaluvadi, CEO of Supraja Technologies.',
      tag: 'won 1st place ★',
      tagType: 'won',
      links: [
        { label: 'Excellence Cert (Best Student)', url: '/assets/supraja-excellence-cert.jpg' },
        { label: 'Live Scoreboard (#1 Bug_Slayers)', url: '/assets/supraja-scoreboard.jpg' },
        { label: 'Workshop Cert', url: '/assets/supraja-participation-cert.jpg' }
      ]
    },
    {
      when: '2026',
      title: 'Medicare Web Application Competition',
      org: 'Health-Tech Innovation Contest',
      desc: 'Secured 2nd Place for designing MediCare Connect Pro, an accessible patient EHR consultation portal and dynamic clinic queuing system.',
      tag: 'won 2nd place',
      tagType: 'won'
    },
    {
      when: '2024 – 2026',
      title: 'IEEE Student Branch & HackSpirit',
      org: 'NBKRIST',
      desc: 'Vice Chairperson; engineered and launched official student branch portal (nbkristieee.in) and university hackathon platform (hackspirit.fun).',
      tag: 'vice chairperson',
      tagType: 'built',
      links: [
        { label: 'nbkristieee.in', url: 'https://nbkristieee.in' },
        { label: 'hackspirit.fun', url: 'https://hackspirit.fun' }
      ]
    },
    {
      when: '2025',
      title: 'Microsoft Learn Student Ambassador',
      org: 'Microsoft Community Program',
      desc: 'Mentored fellow engineering students in Microsoft Azure cloud services, Git, and software development practices.',
      tag: 'ambassador',
      tagType: 'built'
    },
    {
      when: '2025',
      title: 'Kaggle GenAI Agents Capstone',
      org: 'Kaggle & Google',
      desc: 'Completed specialized agents intensive covering autonomous agent swarms, function calling architectures, and RAG retrieval.',
      tag: 'capstone',
      tagType: 'attended'
    }
  ];

  return (
    <section id="events" className="py-16 sm:py-24 border-b border-[#e6e3da]">
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
            <span className="font-mono text-xs text-[#9c988d]">07</span>
            <span>Hackathons & events</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            5 milestones · 2 podium prizes
          </span>
        </motion.div>

        {/* Events List */}
        <ul className="flex flex-col gap-4">
          {events.map((ev, i) => (
            <motion.li
              variants={itemFadeUp}
              key={i}
              className="p-4 sm:p-5 rounded-xl border border-[#e6e3da] bg-[#ffffff] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <span className="font-mono text-xs text-[#9c988d] shrink-0 w-24">
                  {ev.when}
                </span>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#161514]">
                      {ev.title}
                    </h3>
                    <small className="text-xs text-[#6e6b63] font-mono">
                      · {ev.org}
                    </small>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6e6b63] max-w-xl leading-relaxed">
                    {ev.desc}
                  </p>
                  {'links' in ev && Array.isArray((ev as any).links) && (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {((ev as any).links as { label: string; url: string }[]).map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#d41514] hover:underline"
                        >
                          <span>{link.label}</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                    ev.tagType === 'won'
                      ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fde047]'
                      : 'bg-[#f0ede6] text-[#161514] border border-[#e6e3da]'
                  }`}
                >
                  {ev.tagType === 'won' && <span>★</span>}
                  <span>{ev.tag}</span>
                </span>
              </div>
            </motion.li>
          ))}
        </ul>

      </motion.div>
    </section>
  );
};
