import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Check, 
  Bookmark, 
  AlertTriangle, 
  Sparkles,
  Zap,
  ArrowRight,
  Database,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

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

interface SimState {
  statusText: string;
  failedNodeIndex?: number;
  highlightFallback?: boolean;
}

export const ProjectsSection: React.FC<{ onAskAgent: (query: string) => void }> = ({ onAskAgent }) => {
  const [expandedId, setExpandedId] = useState<string>('gully-united');
  const [shortlisted, setShortlisted] = useState<Record<string, boolean>>({});
  const [simulations, setSimulations] = useState<Record<string, number>>({});

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  const toggleShortlist = (id: string) => {
    setShortlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulate = (projectId: string, simMode: number) => {
    setSimulations((prev) => ({ ...prev, [projectId]: simMode }));
  };

  const projectsData = [
    {
      id: 'gully-united',
      index: 'P/01',
      title: 'Gully United',
      stack: 'Java · Spring Boot · React · PostgreSQL',
      year: '2026',
      subtitle: '2026 · Freelance Client Solution · Full-Stack',
      summary: 'Production cricket ground booking platform enabling players to reserve turfs and owners to manage slots.',
      flowNodes: ['slot pick', 'jwt auth', 'atomic lock', 'postgresql', 'razorpay webhook', 'qr ticket'],
      failureNodes: ['rollback tx', 'release lock', 'deterministic notice'],
      sims: [
        { label: 'Normal run', note: 'Booking verified in 180ms. QR ticket issued.' },
        { label: 'Razorpay delay', note: 'Webhook re-try triggered; slot lock preserved for 10m.' },
        { label: 'Double-booking race', note: 'Pessimistic DB lock caught collision: second request cleanly rejected with slot unavailable.' },
        { label: 'DB connection drop', note: 'Spring rollback executed cleanly without orphan charge.' }
      ],
      facts: [
        'Atomic double-booking prevention engine guaranteeing zero slot conflicts via PostgreSQL row locks.',
        'Razorpay checkout integration with automated webhook signature validation.',
        'QR-code pass generation for venue check-ins scanned at the turf boundary.',
        'Role-based Spring Security (Owner, Turf Manager, Registered Player).',
        'Interactive Google Maps coordinates integration for turf discovery.'
      ],
      chips: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Razorpay', 'JWT', 'Google Maps'],
      liveUrl: 'https://gully-united-xlv.vercel.app/',
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · gully-united: BookingService.java, SecurityConfig.java, SlotRepository.java',
      agentPrompt: 'How does Gully United prevent double bookings under high concurrency?'
    },
    {
      id: 'khetconnect',
      index: 'P/02',
      title: 'KhetConnect',
      stack: 'Spring Boot · React · PostgreSQL · Tailwind',
      year: '2026',
      subtitle: '2026 · Full-Stack Hyperlocal Platform',
      summary: 'Agricultural labour exchange connecting local farmers with field workers within a 5 km proximity radius.',
      flowNodes: ['farmer job post', 'geo radius query', 'labour matching', 'jwt filter', 'work contract'],
      failureNodes: ['expand to 10km', 'sms broadcast alert', 'queued retry'],
      sims: [
        { label: 'Normal run', note: 'Matched 4 workers within 3.2 km radius.' },
        { label: 'Low labour density', note: 'Radius auto-expanded from 5km to 10km seamlessly.' },
        { label: 'Network offline in field', note: 'Cached job details stored locally on device for offline review.' }
      ],
      facts: [
        'Hyperlocal geospatial radius search querying farm coordinates within 5 km.',
        'Role-based JWT authentication separating Farm Owners and Labour Crews.',
        'Verified work ledger with mutual employer and worker reputation ratings.',
        'Lightweight mobile interface optimized for rural low-bandwidth network zones.'
      ],
      chips: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'JPA/Hibernate', 'Tailwind CSS', 'REST APIs'],
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · khetconnect: LaborMatchingService.java, GeoUtils.java',
      agentPrompt: 'Tell me about the architecture of KhetConnect'
    },
    {
      id: 'ai-forecaster',
      index: 'P/03',
      title: 'AI Consumer Sentiment & Market Forecaster',
      stack: 'Python · Scikit-learn · NLP · RAG · Pinecone · Streamlit',
      year: '2026',
      subtitle: '2026 · Infosys Internship Project · Streamlit Live',
      summary: 'Market sentiment prediction system with vector database grounding and RAG for contextual financial trend analysis.',
      flowNodes: ['sentiment stream', 'tokenization', 'embed (all-MiniLM)', 'retrieve k=8', 'gemini 3.8', 'trend forecast'],
      failureNodes: ['scikit-learn fallback', 'cached baseline', 'plain summary'],
      sims: [
        { label: 'Normal run', note: 'Vector similarity returned 8 context chunks; forecast generated with 92% confidence.' },
        { label: 'Pinecone rate-limit', note: 'Fallback to local TF-IDF cache; answers with lower context tag.' },
        { label: 'Ambiguous sentiment text', note: 'Prompt flags neutral uncertainty rather than hallucinating market trajectory.' }
      ],
      facts: [
        'Engineered during Infosys Springboard Virtual AI Research Internship.',
        'Deployed live interactive web dashboard on Streamlit Cloud.',
        'Integrated Retrieval-Augmented Generation (RAG) using Pinecone vector database.',
        'Preprocessing pipeline implementing tokenization, lemmatization and TF-IDF feature extraction.',
        'Zero-hallucination guard: system requires retrieved context citation for market claims.'
      ],
      chips: ['Python', 'Streamlit', 'NLP', 'Scikit-learn', 'Pinecone', 'LLMs', 'RAG', 'Pandas'],
      liveUrl: 'https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/',
      githubUrl: 'https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster',
      sourcePath: 'source · ai-forecaster: app.py, ingest.py, vector_store.py, rag_pipeline.py',
      agentPrompt: 'Tell me about Guravaiah\'s Infosys AI Consumer Sentiment Forecaster live app'
    },
    {
      id: 'cybershield',
      index: 'P/04',
      title: 'CyberShield Sentinel',
      stack: 'Python · Docker · Network Forensics',
      year: '2025',
      subtitle: '2025 · 1st Place Winner – Cybersecurity Hackathon',
      summary: 'Automated network vulnerability scanner and intrusion detection triage system built in 36 hours.',
      flowNodes: ['packet sniff', 'anomaly detection', 'cve matcher', 'threat score', 'triage alert'],
      failureNodes: ['isolated sandbox', 'quarantine ip', 'static alert'],
      sims: [
        { label: 'Normal run', note: 'Zero-day vulnerability flag isolated; severity 8.9 assigned.' },
        { label: 'Packet flood (DDoS)', note: 'Rate-limiter auto-engaged; suspicious subnet throttled.' }
      ],
      facts: [
        '1st Place Winner across 40+ engineering teams at competitive hackathon.',
        'Real-time packet inspection and threat severity categorization.',
        'Automated vulnerability mitigation recommendations and containerized Docker setup.'
      ],
      chips: ['Python', 'Docker', 'Network Forensics', 'REST APIs', 'Spring Boot'],
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · cybershield: packet_analyzer.py, threat_eval.py',
      agentPrompt: 'What did Guravaiah build for the Cybersecurity Hackathon?'
    },
    {
      id: 'medicare',
      index: 'P/05',
      title: 'MediCare Connect Pro',
      stack: 'React · Spring Boot · PostgreSQL',
      year: '2026',
      subtitle: '2026 · 2nd Place Winner – Medicare Web App Competition',
      summary: 'Patient EHR consultation portal and automated clinic appointment queuing system with encrypted records.',
      flowNodes: ['patient checkin', 'triage queue', 'doctor portal', 'encrypted ehr', 'prescription'],
      failureNodes: ['offline cache', 'sms emergency queue'],
      sims: [
        { label: 'Normal run', note: 'Wait-time estimated at 12 mins. Queue slot #04 confirmed.' }
      ],
      facts: [
        '2nd Place Award Winner in health-tech innovation competition.',
        'Interactive virtual triage queue with dynamic live wait-time estimates.',
        'HIPAA-compliant encrypted medical history and digital physician signatures.'
      ],
      chips: ['React', 'Spring Boot', 'PostgreSQL', 'Tailwind CSS', 'REST APIs'],
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · medicare-connect: QueueController.java, EhrEncryption.java',
      agentPrompt: 'Tell me about the MediCare Connect Pro award-winning project'
    }
  ];

  return (
    <section id="projects" className="py-16 sm:py-24 border-b border-[#e6e3da]">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left"
      >
        
        {/* Section Header */}
        <motion.div variants={itemFadeUp} className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-10">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">04</span>
            <span>Projects</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            {projectsData.length} projects, 2025–2026
          </span>
        </motion.div>

        {/* Project List Accordion matching mohammad-rizwan.tech */}
        <ul className="flex flex-col border-t border-[#e6e3da]">
          {projectsData.map((project) => {
            const isExpanded = expandedId === project.id;
            const currentSim = simulations[project.id] ?? 0;
            const activeSimData = project.sims[currentSim] || project.sims[0];

            return (
              <motion.li variants={itemFadeUp} key={project.id} className="border-b border-[#e6e3da]">
                
                {/* Project Row Button */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className={`w-full py-4 px-3 sm:px-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                    isExpanded ? 'bg-[#f0ede6]' : 'hover:bg-[#f6f4ed]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                    <span className="font-mono text-xs text-[#9c988d] shrink-0">
                      {project.index}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-[#161514] truncate">
                      {project.title}
                    </span>
                    <span className="hidden sm:inline font-mono text-xs text-[#6e6b63] truncate">
                      {project.stack}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-[#9c988d]">
                      {project.year}
                    </span>
                    <span className={`font-mono text-xs transition-transform ${isExpanded ? 'rotate-90 text-[#161514]' : 'text-[#9c988d]'}`}>
                      ↗
                    </span>
                  </div>
                </button>

                {/* Expanded Drawer */}
                {isExpanded && (
                  <div className="bg-[#ffffff] border-t border-[#e6e3da] p-4 sm:p-6 flex flex-col gap-6 animate-in fade-in duration-200">
                    
                    {/* Interactive Architecture Flow Panel matching mohammad-rizwan.tech */}
                    <div className="p-4 sm:p-5 rounded-xl border border-[#d5d1c5] bg-[#f9f8f5] grid-bg flex flex-col gap-3">
                      
                      {/* Flow Diagram Nodes with Animated Pulses */}
                      <div className="flex flex-wrap items-center gap-2">
                        {project.flowNodes.map((node, nIdx) => {
                          const isFailedNode = currentSim > 0 && nIdx === (project.flowNodes.length - 2);
                          const isSuccessNode = currentSim === 0;

                          return (
                            <React.Fragment key={node}>
                              <span 
                                className={`flow-node transition-all duration-300 ${
                                  isFailedNode 
                                    ? 'active-fail scale-105 border-red-500 font-bold' 
                                    : isSuccessNode
                                    ? 'hover:border-[#161514]'
                                    : ''
                                }`}
                              >
                                {isFailedNode && <span className="mr-1 text-red-600">⚠</span>}
                                {node}
                              </span>
                              {nIdx < project.flowNodes.length - 1 && (
                                <span className="text-[#9c988d] font-mono text-xs flow-arrow-pulse">
                                  →
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* On Failure Fallback Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#6e6b63] pt-1">
                        <span className="text-[#9c988d]">on failure ↘</span>
                        {project.failureNodes.map((fb, fbIdx) => {
                          const isTriggered = currentSim > 0 && fbIdx === 0;
                          return (
                            <span 
                              key={fb} 
                              className={`px-2 py-0.5 rounded transition-all duration-300 border ${
                                isTriggered 
                                  ? 'bg-[#fee2e2] text-[#991b1b] border-red-300 font-bold shadow-xs scale-105'
                                  : 'bg-[#f0ede6] text-[#161514] border-[#e6e3da]'
                              }`}
                            >
                              {fb}
                            </span>
                          );
                        })}
                      </div>

                      {/* Simulator Bar */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#e6e3da]">
                        <span className="text-[11px] font-mono text-[#9c988d] uppercase">
                          simulate:
                        </span>
                        {project.sims.map((sim, sIdx) => (
                          <button
                            key={sim.label}
                            onClick={() => handleSimulate(project.id, sIdx)}
                            className={`px-2.5 py-1 text-xs font-mono rounded border transition-all duration-200 cursor-pointer ${
                              currentSim === sIdx
                                ? sIdx === 0
                                  ? 'bg-[#161514] text-white border-[#161514] shadow-xs'
                                  : 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5] font-semibold shadow-xs scale-105'
                                : 'bg-[#ffffff] text-[#6e6b63] border-[#d5d1c5] hover:border-[#161514] hover:text-[#161514]'
                            }`}
                          >
                            {sIdx > 0 && <span className="mr-1">⚡</span>}
                            {sim.label}
                          </button>
                        ))}
                      </div>

                      {/* Simulation Status Feedback with Live Terminal feel */}
                      {activeSimData && (
                        <div className="text-xs font-mono p-2.5 rounded bg-[#ffffff] border border-[#e6e3da] text-[#161514] flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${currentSim === 0 ? 'bg-[#16a34a]' : 'bg-[#dc2626] animate-ping'}`}></span>
                            <span>{activeSimData.note}</span>
                          </div>
                          <span className="text-[10px] text-[#9c988d] shrink-0 hidden sm:inline">
                            latency: {currentSim === 0 ? '142ms' : '980ms'} · status: {currentSim === 0 ? '200 OK' : '409 Conflict Handled'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Body */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-[#161514]">
                          {project.title}
                        </h3>
                        <p className="text-xs font-mono text-[#6e6b63] mt-0.5">
                          {project.subtitle}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-[#161514] leading-relaxed font-medium">
                        {project.summary}
                      </p>

                      {/* Facts with Mark styling */}
                      <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#6e6b63]">
                        {project.facts.map((fact, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.chips.map((chip) => (
                          <span key={chip} className="px-2.5 py-1 rounded bg-[#f0ede6] text-xs font-mono text-[#161514]">
                            {chip}
                          </span>
                        ))}
                      </div>

                      {/* Links Row matching mohammad-rizwan.tech */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#e6e3da]">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#161514] text-white text-xs font-mono font-medium hover:bg-[#333] transition-colors"
                          >
                            <span>Live App</span>
                            <span className="text-xs">↗</span>
                          </a>
                        )}

                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-xs font-mono text-[#161514] transition-colors"
                        >
                          <span>Source</span>
                          <span className="text-xs">↗</span>
                        </a>

                        <button
                          onClick={() => toggleShortlist(project.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                            shortlisted[project.id]
                              ? 'bg-[#161514] text-white border-[#161514]'
                              : 'border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514]'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{shortlisted[project.id] ? 'Shortlisted' : 'Shortlist'}</span>
                        </button>
                      </div>

                      {/* Source path text */}
                      <div className="text-[11px] font-mono text-[#9c988d] pt-1">
                        {project.sourcePath}
                      </div>

                      {/* Options / Ask Agent */}
                      <div className="p-3 bg-[#f9f8f5] border border-[#e6e3da] rounded-lg flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => onAskAgent(project.agentPrompt)}
                          className="text-xs font-mono text-[#161514] hover:text-[#d41514] flex items-center gap-1.5 transition-colors text-left"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#d41514]" />
                          <span>Ask Guru AI: {project.agentPrompt} ↗</span>
                        </button>
                      </div>

                    </div>

                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>

      </motion.div>
    </section>
  );
};
