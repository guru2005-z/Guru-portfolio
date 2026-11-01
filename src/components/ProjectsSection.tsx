import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { 
  Bookmark, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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

interface ProjectPreview {
  tag: string;
  domain: string;
  heading: string;
  rows: { k: string; v: string }[];
  status: string;
  accent: string;
  image?: string;
}

interface ProjectItem {
  id: string;
  index: string;
  title: string;
  stack: string;
  year: string;
  subtitle: string;
  summary: string;
  flowNodes: string[];
  failureNodes: string[];
  sims: { label: string; note: string }[];
  facts: string[];
  chips: string[];
  liveUrl?: string;
  githubUrl: string;
  sourcePath: string;
  agentPrompt: string;
  preview: ProjectPreview;
}

export const ProjectsSection: React.FC<{ onAskAgent: (query: string) => void }> = ({ onAskAgent }) => {
  const [expandedId, setExpandedId] = useState<string>('');
  const [shortlisted, setShortlisted] = useState<Record<string, boolean>>({});
  const [simulations, setSimulations] = useState<Record<string, number>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Smooth mouse follower for the floating preview card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  const toggleShortlist = (id: string) => {
    setShortlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulate = (projectId: string, simMode: number) => {
    setSimulations((prev) => ({ ...prev, [projectId]: simMode }));
  };

  const projectsData: ProjectItem[] = [
    {
      id: 'gully-united',
      index: 'P/01',
      title: 'Gully United',
      stack: 'Java · Spring Boot · React',
      year: '2026',
      subtitle: '2026 · Freelance Client Solution · Full-Stack Commercial Platform',
      summary: 'Production cricket ground booking platform enabling players to reserve turfs and owners to manage slots with zero double-booking tolerance.',
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
      agentPrompt: 'How does Gully United prevent double bookings under high concurrency?',
      preview: {
        tag: 'GULLY UNITED',
        domain: 'gully-united-xlv.vercel.app',
        heading: 'Commercial Cricket Venue Reservation Platform',
        rows: [
          { k: 'Concurrency', v: 'PostgreSQL Row Lock (SELECT FOR UPDATE)' },
          { k: 'Payment', v: 'Razorpay HMAC-SHA256 Webhooks' },
          { k: 'Gate Pass', v: 'Dynamic Encrypted QR Ticket Validator' }
        ],
        status: 'Production Live App · Vercel',
        accent: '#10b981',
        image: '/assets/gully-united-preview.jpg'
      }
    },
    {
      id: 'ai-forecaster',
      index: 'P/02',
      title: 'Consumer Sentiment Forecaster',
      stack: 'Python · Scikit-learn · RAG',
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
      agentPrompt: 'Tell me about Guravaiah\'s Infosys AI Consumer Sentiment Forecaster live app',
      preview: {
        tag: 'INFOSYS INTERNSHIP',
        domain: 'streamlit.app/ai-market-forecaster',
        heading: 'AI Consumer Market Trend & RAG Forecaster',
        rows: [
          { k: 'NLP Engine', v: 'Scikit-learn + RoBERTa Sentiment Model' },
          { k: 'Vector DB', v: 'Pinecone RAG (k=8 Financial Chunks)' },
          { k: 'Inference', v: 'Sub-150ms Semantic Similarity Retrieval' }
        ],
        status: 'Interactive Live App · Streamlit Cloud',
        accent: '#818cf8',
        image: '/assets/ai-sentiment-forecaster-preview.jpg'
      }
    },
    {
      id: 'nbkrist-ieee',
      index: 'P/03',
      title: 'NBKRIST IEEE Portal',
      stack: 'React · TypeScript · Tailwind',
      year: '2026',
      subtitle: '2026 · Official University Student Branch Platform · Vice Chair',
      summary: 'Official web platform for the IEEE Student Branch at NBKRIST, digitizing memberships, event announcements, and technical archives.',
      flowNodes: ['event hub', 'officer directory', 'membership api', 'cdn cache', 'edge delivery'],
      failureNodes: ['static fallback', 'cached officer list'],
      sims: [
        { label: 'Normal run', note: 'Global edge cache delivered portal in 420ms.' }
      ],
      facts: [
        'Developed as Vice Chairperson of IEEE Student Branch NBKRIST.',
        'Deployed to production with custom domain at https://nbkristieee.in.',
        'Centralizes member directory, upcoming hackathons, and technical symposiums.'
      ],
      chips: ['React', 'TypeScript', 'Tailwind CSS', 'Jamstack', 'Edge CDN'],
      liveUrl: 'https://nbkristieee.in',
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · nbkrist-ieee: App.tsx, EventsList.tsx, OfficerDirectory.tsx',
      agentPrompt: 'Tell me about the NBKRIST IEEE official portal built by Guravaiah',
      preview: {
        tag: 'NBKRIST IEEE',
        domain: 'nbkristieee.in',
        heading: 'Official IEEE Student Branch Web Portal',
        rows: [
          { k: 'Role', v: 'Vice Chairperson Architecture' },
          { k: 'Systems', v: 'Officer Directory, Memberships & Archives' },
          { k: 'Performance', v: 'Sub-1s Global Edge Delivery' }
        ],
        status: 'Official Live Portal · nbkristieee.in',
        accent: '#38bdf8'
      }
    },
    {
      id: 'hackspirit',
      index: 'P/04',
      title: 'HackSpirit Hackathon Hub',
      stack: 'React · TypeScript · Cloud',
      year: '2025',
      subtitle: '2025 · Campus Hackathon Management Hub · Vice Chair',
      summary: 'Production event platform for HackSpirit, managing team registrations, problem tracks, countdown timers, and sponsor showcases.',
      flowNodes: ['team register', 'track pick', 'countdown clock', 'judging matrix', 'submission gateway'],
      failureNodes: ['offline backup', 'local schedule cache'],
      sims: [
        { label: 'Normal run', note: 'Processed 45+ team registrations smoothly under sprint peak.' }
      ],
      facts: [
        'Designed and launched as Vice Chairperson for university-wide hackathons.',
        'Live event website deployed at https://hackspirit.fun.',
        'Integrated dynamic problem statements, live schedule milestones, and judging criteria.'
      ],
      chips: ['React', 'TypeScript', 'Tailwind CSS', 'Event Platform', 'Cloud Hosting'],
      liveUrl: 'https://hackspirit.fun',
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · hackspirit: Countdown.tsx, TrackExplorer.tsx, RegisterModal.tsx',
      agentPrompt: 'What is the HackSpirit platform developed by Guravaiah?',
      preview: {
        tag: 'HACKSPIRIT',
        domain: 'hackspirit.fun',
        heading: 'University Hackathon Arena & Team Hub',
        rows: [
          { k: 'Capacity', v: '45+ Team Registrations & Judging Rubrics' },
          { k: 'Tracks', v: 'AI/ML, Web3 & Cybersecurity Challenges' },
          { k: 'Schedule', v: '36-Hour Real-time Milestone Tracker' }
        ],
        status: 'Live Platform · hackspirit.fun',
        accent: '#c084fc'
      }
    },
    {
      id: 'khetconnect',
      index: 'P/05',
      title: 'KhetConnect',
      stack: 'Spring Boot · React · PostgreSQL',
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
      agentPrompt: 'Tell me about the architecture of KhetConnect',
      preview: {
        tag: 'KHETCONNECT',
        domain: 'khetconnect.app',
        heading: 'Hyperlocal Agricultural Labour Platform',
        rows: [
          { k: 'Radius', v: '5km Geospatial Proximity Match' },
          { k: 'Auth', v: 'Spring Security Role-based JWT' },
          { k: 'Offline', v: 'Low-bandwidth Local Caching' }
        ],
        status: 'Agricultural Workforce Platform',
        accent: '#f59e0b'
      }
    },
    {
      id: 'cybershield',
      index: 'P/06',
      title: 'CyberShield Sentinel',
      stack: 'Python · Docker · Network Forensics',
      year: '2025',
      subtitle: '2025 · 1st Place Winner (Team Bug_Slayers) · Supraja Technologies CTF',
      summary: 'Automated network vulnerability scanner and intrusion detection triage system built during the Supraja Technologies CTF Hackathon.',
      flowNodes: ['packet sniff', 'anomaly detection', 'cve matcher', 'threat score', 'triage alert'],
      failureNodes: ['isolated sandbox', 'quarantine ip', 'static alert'],
      sims: [
        { label: 'Normal run', note: 'Zero-day vulnerability flag isolated; severity 8.9 assigned.' },
        { label: 'Packet flood (DDoS)', note: 'Rate-limiter auto-engaged; suspicious subnet throttled.' }
      ],
      facts: [
        '1st Place Winner on official scoreboard (ctfhackathon.great-site.net) as Team Bug_Slayers (223 pts).',
        'Awarded "Best Student of the Cybersecurity Level-1 CTF Hackathon" (5-star Certificate of Excellence).',
        'Presented by Santosh Chaluvadi, Founder & CEO of Supraja Technologies, in collaboration with NBKRIST CSE & IEEE SB.',
        'Real-time packet inspection, threat severity evaluation, and automated Docker sandbox quarantine.'
      ],
      chips: ['Python', 'Docker', 'Network Forensics', 'CTF Security', 'REST APIs', 'Spring Boot'],
      liveUrl: '/assets/supraja-excellence-cert.jpg',
      githubUrl: 'https://github.com/guru2005-z',
      sourcePath: 'source · cybershield: packet_analyzer.py, threat_eval.py',
      agentPrompt: 'What did Guravaiah build for the Supraja Technologies Cybersecurity Hackathon?',
      preview: {
        tag: 'SUPRAJA TECHNOLOGIES CTF',
        domain: 'ctfhackathon.great-site.net',
        heading: '1st Place Winner · Team Bug_Slayers (223 pts)',
        rows: [
          { k: 'Scoreboard', v: 'Rank #1: Bug_Slayers (223 Points)' },
          { k: 'Award', v: 'Best Student of the Hackathon (5 Stars)' },
          { k: 'Presented by', v: 'Santosh Chaluvadi, CEO Supraja Tech' }
        ],
        status: '1st Place Trophy & Excellence Cert',
        accent: '#ef4444',
        image: '/assets/supraja-scoreboard.jpg'
      }
    },
    {
      id: 'medicare',
      index: 'P/07',
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
      agentPrompt: 'Tell me about the MediCare Connect Pro award-winning project',
      preview: {
        tag: 'MEDICARE PRO · 2ND PLACE',
        domain: 'medicare-connect.org',
        heading: 'Clinic Appointment Queue & EHR Portal',
        rows: [
          { k: 'Triage', v: 'Live Patient Queue & Wait Time Estimator' },
          { k: 'Privacy', v: 'HIPAA-Compliant AES-256 Encrypted Records' },
          { k: 'Stack', v: 'Spring Boot REST + React UI' }
        ],
        status: '2nd Place Competition Winner',
        accent: '#14b8a6'
      }
    }
  ];

  const hoveredProject = projectsData.find((p) => p.id === hoveredId);

  return (
    <section 
      id="projects" 
      onMouseMove={handleContainerMouseMove}
      className="relative py-16 sm:py-24 border-b border-[#e6e3da] grid-bg overflow-visible"
    >
      {/* Floating Preview Card Window following cursor - Exact Match to mohammad-rizwan.tech */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
            exit={{ opacity: 0, scale: 0.85, rotate: -4 }}
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
              {/* Purple VIEW Badge in top-left matching mohammad-rizwan.tech */}
              <div className="absolute -top-3.5 -left-3.5 z-20 w-11 h-11 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold text-[11px] uppercase tracking-wider shadow-2xl ring-4 ring-white/10 select-none">
                VIEW
              </div>

              {/* Floating Preview Window Card */}
              <div className="w-[360px] rounded-xl overflow-hidden border border-[#3b3561] bg-[#161426] shadow-2xl p-3.5 text-left flex flex-col gap-2.5">
                {/* Top Bar with window controls */}
                <div className="flex items-center justify-between border-b border-[#2b274c] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    <span className="font-mono text-[10px] text-[#a5a0cb] ml-2 truncate max-w-[210px]">
                      {hoveredProject.preview.domain}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-semibold shrink-0">
                    {hoveredProject.year}
                  </span>
                </div>

                {/* Project Starting Page: High-Res Real Screenshot if available, else Mock UI */}
                {hoveredProject.preview.image ? (
                  <div className="relative w-full h-[190px] rounded-lg overflow-hidden bg-black/90 border border-[#2b274c] shadow-inner group">
                    <img
                      src={hoveredProject.preview.image}
                      alt={hoveredProject.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10">
                      <span className="text-emerald-400 font-bold truncate">● {hoveredProject.preview.status}</span>
                      <span className="text-white/80 shrink-0 font-medium">Starting Page ↗</span>
                    </div>
                  </div>
                ) : (
                  /* Project Starting Page Live Screen Mockup */
                  <div className="w-full rounded-lg bg-[#0d0b1a] border border-[#2b274c] p-2.5 flex flex-col gap-1.5 font-mono shadow-inner text-xs">
                    {hoveredProject.id === 'nbkrist-ieee' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                          <span className="font-bold text-sky-400 flex items-center gap-1">🌐 NBKRISTIEEE.IN</span>
                          <span className="text-neutral-400 text-[9px]">VICE CHAIR LEAD</span>
                        </div>
                        <div className="bg-[#1e1b38] p-1.5 rounded border border-white/10 flex flex-col gap-0.5">
                          <span className="text-white font-bold text-[10px]">Official IEEE Student Branch Portal</span>
                          <span className="text-neutral-300 text-[9px]">Memberships · Officer Directory · Symposiums</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300">
                          <span>Global Edge Delivery: &lt;1s</span>
                          <span className="text-sky-400">100% Responsive</span>
                        </div>
                      </div>
                    )}

                    {hoveredProject.id === 'hackspirit' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                          <span className="font-bold text-purple-400 flex items-center gap-1">⚡ HACKSPIRIT.FUN</span>
                          <span className="text-neutral-400 text-[9px]">CAMPUS ARENA</span>
                        </div>
                        <div className="bg-[#1e1b38] p-1.5 rounded border border-white/10 flex items-center justify-between">
                          <span className="text-purple-300 font-bold text-xs tracking-widest">[ 36 : 00 : 00 ]</span>
                          <span className="px-1 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px] border border-purple-500/40">SPRINT LIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300">
                          <span>45+ Teams Checked In</span>
                          <span className="text-purple-400">Tracks: AI, Web3, Cyber</span>
                        </div>
                      </div>
                    )}

                    {hoveredProject.id === 'khetconnect' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                          <span className="font-bold text-amber-400 flex items-center gap-1">🌾 KHETCONNECT</span>
                          <span className="text-neutral-400 text-[9px]">AGRARIAN RADAR</span>
                        </div>
                        <div className="bg-[#1e1b38] p-1.5 rounded border border-white/10 flex flex-col gap-0.5">
                          <span className="text-white font-bold text-[10px]">5.0 km Geospatial Proximity Match</span>
                          <span className="text-amber-200 text-[9px]">4 Local Field Labourers Available</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300">
                          <span>Spring Security JWT Auth</span>
                          <span className="text-amber-400">Low-bandwidth Mode</span>
                        </div>
                      </div>
                    )}

                    {hoveredProject.id === 'medicare' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                          <span className="font-bold text-teal-400 flex items-center gap-1">🏥 MEDICARE CONNECT</span>
                          <span className="text-neutral-400 text-[9px]">2ND PLACE WINNER</span>
                        </div>
                        <div className="bg-[#1e1b38] p-1.5 rounded border border-white/10 flex flex-col gap-0.5">
                          <span className="text-white font-bold text-[10px]">Current Token: #042 · Dr. Consultation</span>
                          <span className="text-teal-200 text-[9px]">Est. Wait: 12 Minutes Remaining</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300">
                          <span>HIPAA Encrypted EHR</span>
                          <span className="text-teal-400">Emergency Bed Sync</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Tag */}
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#a5a0cb]">
                    {hoveredProject.preview.tag}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                    {hoveredProject.preview.heading}
                  </h4>
                </div>

                {/* Metrics / Details Table */}
                <div className="flex flex-col gap-1 py-1 text-[11px] font-mono border-t border-[#2b274c]/80">
                  {hoveredProject.preview.rows.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center justify-between gap-2">
                      <span className="text-[#847ea8] text-[10px] uppercase">{row.k}:</span>
                      <span className="text-[#f1f0f8] font-semibold truncate max-w-[210px] text-[10px]">
                        {row.v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-0.5 border-t border-[#2b274c]/60">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{hoveredProject.preview.status}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#a5a0cb]">
                    Click to view ↗
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
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-5xl mx-auto px-4 sm:px-6 text-left"
      >
        
        {/* Section Header */}
        <motion.div variants={itemFadeUp} className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-4">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">03</span>
            <span>Projects</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            {projectsData.length} projects, 2025–2026
          </span>
        </motion.div>

        {/* Project List matching mohammad-rizwan.tech */}
        <ul className="flex flex-col border-t border-[#e6e3da]">
          {projectsData.map((project) => {
            const isExpanded = expandedId === project.id;
            const isHovered = hoveredId === project.id;
            const currentSim = simulations[project.id] ?? 0;
            const activeSimData = project.sims[currentSim] || project.sims[0];

            return (
              <motion.li variants={itemFadeUp} key={project.id} className="border-b border-[#e6e3da]">
                
                {/* Large Title Project Row Button */}
                <div
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => toggleExpand(project.id)}
                  className="group relative w-full py-6 sm:py-8 px-2 sm:px-4 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-150 hover:bg-[#f6f4ed]/60 select-none"
                >
                  <div className="flex items-baseline gap-3 sm:gap-8 min-w-0">
                    <span className="font-mono text-xs sm:text-sm text-[#9c988d] shrink-0 font-medium">
                      {project.index}
                    </span>
                    <h3
                      className={`text-2xl sm:text-4xl md:text-5xl font-bold font-sans tracking-tight transition-colors duration-200 truncate ${
                        isHovered ? 'text-[#6366f1]' : 'text-[#161514]'
                      }`}
                    >
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                    <span className="font-mono text-xs sm:text-sm text-[#6e6b63] group-hover:text-[#161514] transition-colors hidden sm:inline">
                      {project.stack} {project.year}
                    </span>
                    <span
                      className={`font-mono text-base sm:text-xl transition-all duration-200 ${
                        isHovered ? 'text-[#6366f1] translate-x-1 -translate-y-1' : 'text-[#9c988d]'
                      } ${isExpanded ? 'rotate-90 text-[#161514]' : ''}`}
                    >
                      ↗
                    </span>
                  </div>
                </div>

                {/* Expanded Drawer */}
                {isExpanded && (
                  <div className="bg-[#ffffff] border-t border-[#e6e3da] p-4 sm:p-6 flex flex-col gap-6 animate-in fade-in duration-200">
                    
                    {/* Live Screenshot Starting Page Banner when available */}
                    {project.preview.image && (
                      <div className="relative rounded-xl overflow-hidden border border-[#d5d1c5] bg-[#0d0b1a] shadow-md group">
                        <img 
                          src={project.preview.image} 
                          alt={project.title} 
                          className="w-full h-[220px] sm:h-[300px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col sm:flex-row sm:items-end justify-between p-4 sm:p-5 gap-3">
                          <div>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Live Starting Page UI · {project.preview.tag}
                            </span>
                            <h4 className="text-white text-base sm:text-xl font-bold mt-0.5">
                              {project.preview.heading}
                            </h4>
                          </div>
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] text-white text-xs font-mono font-bold hover:bg-[#4f46e5] transition-all shadow-lg shrink-0 w-fit"
                            >
                              <span>Open Live Application</span>
                              <span>↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interactive Architecture Flow Panel */}
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
