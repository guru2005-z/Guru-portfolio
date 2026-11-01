export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'Project' | 'Architecture' | 'Skill' | 'Certification' | 'Education' | 'Contact' | 'Hackathon';
  keywords: string[];
  content: string;
  highlight: string;
}

export interface RagRetrievalResult {
  chunk: KnowledgeChunk;
  score: number; // 0 to 1
  matchedKeywords: string[];
}

export const RAG_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'gully-united-overview',
    title: 'Gully United - Commercial Cricket Ground Booking Platform',
    category: 'Project',
    keywords: ['gully', 'cricket', 'united', 'booking', 'freelance', 'platform', 'turf', 'live', 'vercel'],
    content: 'Gully United is Guravaiah Katta\'s flagship commercial freelance web application live at https://gully-united-xlv.vercel.app/. It is an end-to-end sports facility reservation platform connecting cricket enthusiasts with venue operators.',
    highlight: 'Production web app live at https://gully-united-xlv.vercel.app/ with real-time venue search and booking.'
  },
  {
    id: 'gully-united-concurrency',
    title: 'Gully United - Concurrency & Double-Booking Prevention Architecture',
    category: 'Architecture',
    keywords: ['concurrency', 'double-booking', 'lock', 'atomic', 'postgresql', 'select for update', 'race condition', 'isolation'],
    content: 'To prevent simultaneous booking collisions when two users attempt to reserve the same pitch at the exact same millisecond, Guravaiah designed atomic database transactions with PostgreSQL row-level locks (SELECT FOR UPDATE) and Spring Boot @Transactional boundaries. Unsuccessful concurrent requests receive immediate, non-corrupting rollback exceptions.',
    highlight: 'Zero race conditions guaranteed via row-level locks and ACID database isolation.'
  },
  {
    id: 'gully-united-payments',
    title: 'Gully United - Payment Gateway & Webhook Idempotency',
    category: 'Architecture',
    keywords: ['razorpay', 'webhook', 'payment', 'hmac', 'idempotency', 'security', 'refund'],
    content: 'Payment processing is integrated with Razorpay. Webhooks are cryptographically authenticated using HMAC-SHA256 signature verification. State transitions utilize idempotency keys to eliminate duplicate charge processing during network retries.',
    highlight: 'HMAC-SHA256 verified webhooks with strict idempotency keys.'
  },
  {
    id: 'gully-united-qr-tickets',
    title: 'Gully United - QR Ticket Generation & Ground Navigation',
    category: 'Architecture',
    keywords: ['qr', 'ticket', 'scanner', 'pass', 'maps', 'google maps', 'verification', 'venue'],
    content: 'Confirmed reservations generate dynamic encrypted QR tickets with one-time validation codes for ground security staff. Venues integrate Google Maps Geolocation for turn-by-turn navigation.',
    highlight: 'Dynamic QR ticket passes and Google Maps navigation.'
  },
  {
    id: 'khetconnect-platform',
    title: 'KhetConnect - Hyperlocal Agricultural Labour Hiring Platform',
    category: 'Project',
    keywords: ['khetconnect', 'agriculture', 'labour', 'hyperlocal', 'farm', 'radius', 'spring boot', 'farmers'],
    content: 'KhetConnect is an agrarian workforce coordination system connecting farm owners with local agricultural workers within a 5km geo-radius. Built with Java, Spring Boot, React, and PostgreSQL, featuring localized SMS alerts and multilingual support.',
    highlight: '5km radius geolocation-based agricultural job discovery and hiring.'
  },
  {
    id: 'ai-sentiment-forecaster',
    title: 'AI Market Trend & Consumer Sentiment Forecaster (Infosys Springboard)',
    category: 'Project',
    keywords: ['sentiment', 'forecaster', 'nlp', 'llm', 'rag', 'pinecone', 'scikit-learn', 'python', 'vector', 'infosys', 'internship', 'streamlit', 'live'],
    content: 'An end-to-end predictive analytics engine analyzing customer sentiment from 50,000+ unstructured financial news articles and reviews. Developed during Guravaiah\'s Infosys Springboard Virtual Internship. Built with Python, Scikit-learn, RoBERTa/LLMs, and Pinecone vector database for RAG retrieval. Deployed live as an interactive Streamlit web application at https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/. Open source GitHub code: https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster.',
    highlight: 'Infosys Internship project live at Streamlit Cloud with RAG retrieval pipeline and Pinecone vector DB.'
  },
  {
    id: 'experience-infosys-springboard',
    title: 'Infosys Springboard Virtual Internship 6.0 - AI Research Intern',
    category: 'Project',
    keywords: ['infosys', 'springboard', 'internship', 'intern', 'ai', 'research', 'sentiment', 'market', 'trend', 'forecaster', 'streamlit', 'certificate', 'wingspan'],
    content: 'Guravaiah completed Infosys Springboard Internship 6.0 (B 11): "Intelligent Forecasting System for Consumer Behavior and Industry Trends" (Dec 22, 2025 – Feb 25, 2026, issued April 8, 2026). Certified by Satheesha B. Nanjappa (Senior Vice President and Head, Education, Training and Assessment, Infosys Limited) and verifiable via QR code at https://verify.onwingspan.com. During this internship, he engineered the AI Consumer Sentiment Forecaster deployed live on Streamlit Cloud (https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/) with GitHub code at https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster.',
    highlight: 'Infosys Springboard Internship 6.0 certified by SVP Satheesha B. Nanjappa; verifiable on Wingspan.'
  },
  {
    id: 'nbkrist-ieee-portal',
    title: 'NBKRIST IEEE Official Portal (nbkristieee.in) - Vice Chair Web Development',
    category: 'Project',
    keywords: ['nbkristieee', 'nbkristieee.in', 'ieee', 'nbkrist', 'vice chair', 'chairperson', 'portal', 'website', 'leadership'],
    content: 'Guravaiah Katta served as the Vice Chairperson of the IEEE Student Branch at NBKRIST. In this leadership role, he designed, developed, and deployed the official university branch portal live at https://nbkristieee.in. The platform centralizes student memberships, executive committee directories, upcoming technical workshops, and resource archives.',
    highlight: 'Official IEEE Student Branch portal live at https://nbkristieee.in built by Guravaiah as Vice Chair.'
  },
  {
    id: 'hackspirit-hackathon-platform',
    title: 'HackSpirit Hackathon Platform (hackspirit.fun) - Vice Chair Web Development',
    category: 'Project',
    keywords: ['hackspirit', 'hackspirit.fun', 'hackathon', 'competition', 'vice chair', 'chairperson', 'website', 'portal', 'fun'],
    content: 'Guravaiah Katta developed and launched the official website for HackSpirit at https://hackspirit.fun. Built as Vice Chairperson and lead web developer, the platform manages hackathon team registrations, challenge tracks, live countdowns, rules, judging rubrics, and sponsor showcases.',
    highlight: 'Production hackathon web platform live at https://hackspirit.fun built by Guravaiah as Vice Chair.'
  },
  {
    id: 'hackathon-cybershield',
    title: 'CyberShield Sentinel - 1st Place Cybersecurity Hackathon Winner',
    category: 'Hackathon',
    keywords: ['cybershield', 'sentinel', 'cybersecurity', 'hackathon', '1st place', 'winner', 'vulnerability', 'waf'],
    content: 'Awarded 1st Place among 45+ teams. Engineered an automated vulnerability detection system analyzing incoming HTTP traffic in real-time to mitigate SQL injection, XSS, and CSRF attacks.',
    highlight: 'Won 1st Place in Inter-College Cybersecurity Hackathon.'
  },
  {
    id: 'hackathon-medicare',
    title: 'MediCare Connect Pro - 2nd Place Medicare Web Application Competition',
    category: 'Hackathon',
    keywords: ['medicare', 'hospital', 'doctor', 'patient', 'triage', '2nd place', 'winner'],
    content: 'Clinched 2nd Place for a HIPAA-compliant healthcare triage and appointment scheduling dashboard with automated doctor slot allocation and emergency bed availability monitoring.',
    highlight: '2nd Place winner for real-time healthcare scheduling.'
  },
  {
    id: 'skills-backend-spring',
    title: 'Backend Engineering: Java, Spring Boot & Microservices',
    category: 'Skill',
    keywords: ['java', 'spring', 'spring boot', 'spring security', 'jpa', 'hibernate', 'rest', 'api', 'backend'],
    content: 'Guravaiah specializes in Java (17/21) and Spring Boot enterprise architectures. Experienced in Controller-Service-Repository patterns, Spring Security JWT stateless authentication, DTO validation, JPA/Hibernate ORM, and connection pool optimization with HikariCP.',
    highlight: 'Enterprise Java, Spring Boot, Spring Security JWT, JPA/Hibernate.'
  },
  {
    id: 'skills-database-systems',
    title: 'Database Architecture: PostgreSQL & ACID Transactions',
    category: 'Skill',
    keywords: ['postgresql', 'database', 'sql', 'acid', 'neon', 'transactions', 'index', 'performance'],
    content: 'Deep database design competence in PostgreSQL, complex SQL query planning, schema indexing, transactional isolation levels, foreign key constraints, and serverless databases like Neon.',
    highlight: 'PostgreSQL ACID transactions, indexing, and connection pooling.'
  },
  {
    id: 'skills-frontend-react',
    title: 'Frontend Engineering: React, TypeScript & Modern UI',
    category: 'Skill',
    keywords: ['react', 'typescript', 'tailwind', 'vite', 'frontend', 'framer motion', 'javascript'],
    content: 'Fluent in React 19, TypeScript, modern hooks, state management, Vite build toolchain, Tailwind CSS utility styling, Framer Motion animations, Canvas rendering, and responsive mobile-first UI design.',
    highlight: 'React 19, TypeScript, Tailwind CSS, Vite, and interactive canvas.'
  },
  {
    id: 'skills-ai-rag',
    title: 'AI & Systems: RAG Architectures, Vector Search & LLMs',
    category: 'Skill',
    keywords: ['ai', 'rag', 'llm', 'retrieval', 'vector', 'embeddings', 'pinecone', 'gemini', 'agents', 'python'],
    content: 'Practical hands-on developer in Retrieval-Augmented Generation (RAG), vector similarity search with Pinecone and FAISS, Google GenAI / Gemini APIs, context grounding, prompt engineering, and autonomous agent design.',
    highlight: 'RAG retrieval pipelines, vector embeddings, Gemini APIs, and autonomous agents.'
  },
  {
    id: 'certifications-azure-az900',
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    category: 'Certification',
    keywords: ['azure', 'microsoft', 'az-900', 'certification', 'cloud', 'credential', '5b48115bb42e21fc'],
    content: 'Certified in Microsoft Azure cloud architectures, resource groups, Virtual Networks, Azure App Services, security benchmarks, and cloud governance. Credential ID: 5B48115BB42E21FC.',
    highlight: 'Microsoft Certified: Azure Fundamentals (AZ-900) - ID: 5B48115BB42E21FC.'
  },
  {
    id: 'certifications-microsoft-mlsa',
    title: 'Microsoft Student Ambassadors | 2026 (Associate Certificate)',
    category: 'Certification',
    keywords: ['mlsa', 'microsoft student ambassador', 'ambassador', 'associate', 'pablo veramendi', 'certificate', 'microsoft'],
    content: 'Guravaiah Katta is a recognized Microsoft Student Ambassador (MLSA 2026 Associate). Certified by Pablo Veramendi (Global Director | Microsoft Student Ambassadors) in recognition of hard work and dedication to the global student community. Active in cloud computing mentorship, Azure fundamentals, and student developer workshops. Certificate viewable live on the portfolio.',
    highlight: 'Microsoft Student Ambassadors | 2026 (Associate) signed by Global Director Pablo Veramendi.'
  },
  {
    id: 'certifications-kaggle-genai',
    title: 'Kaggle GenAI 2025 Agents Intensive Capstone',
    category: 'Certification',
    keywords: ['kaggle', 'genai', 'agents', 'capstone', 'intensive', '2025', 'machine learning'],
    content: 'Graduated the comprehensive Kaggle GenAI 2025 Agents Intensive program, demonstrating verified mastery of multi-agent orchestration, tool calling, and RAG pipelines.',
    highlight: 'Kaggle GenAI 2025 Agents Intensive Capstone certified.'
  },
  {
    id: 'dsa-problem-solving',
    title: 'Algorithms & Data Structures: 300+ Problems Solved',
    category: 'Skill',
    keywords: ['dsa', 'leetcode', 'codechef', 'algorithms', 'data structures', 'problem solving', '300'],
    content: 'Strong analytical foundation with 300+ solved algorithmic challenges across LeetCode and CodeChef, focusing on graphs, dynamic programming, binary trees, recursion, and space-time complexity optimization.',
    highlight: '300+ DSA problems solved across LeetCode and CodeChef.'
  },
  {
    id: 'education-degree',
    title: 'Education: B.Tech in CSE at NBKRIST (8.17 / 10 CGPA)',
    category: 'Education',
    keywords: ['education', 'degree', 'b.tech', 'college', 'nbkrist', 'cgpa', 'cse', '2027'],
    content: 'Pursuing Bachelor of Technology in Computer Science and Engineering (2023 - 2027) at N.B.K.R Institute of Science and Technology. Current CGPA: 8.17 / 10.',
    highlight: 'B.Tech in CSE (2023 - 2027) at NBKRIST with 8.17 / 10 CGPA.'
  },
  {
    id: 'contact-and-availability',
    title: 'Contact Details & Hiring Availability',
    category: 'Contact',
    keywords: ['contact', 'hire', 'email', 'phone', 'location', 'available', 'internship', 'job', 'freelance'],
    content: 'Guravaiah Katta is actively open to Software Engineering internships, full-time junior developer roles, and freelance contracts. Email: kattaguravaiah00@gmail.com | Phone: +91-9491501919 | Location: Andhra Pradesh, India | LinkedIn: https://www.linkedin.com/in/guravaiah-katta/ | GitHub: https://github.com/guru2005-z',
    highlight: 'Actively available for junior engineering roles, internships, and freelance contracts.'
  }
];

// In-memory Hybrid Semantic & Keyword RAG Retriever
export function retrieveRelevantKnowledge(query: string, topK: number = 3): RagRetrievalResult[] {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const terms = Array.from(new Set(cleanQuery.split(/\s+/).filter(t => t.length > 2)));

  const scored: RagRetrievalResult[] = RAG_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    const matchedKeywords: string[] = [];
    const chunkText = (chunk.title + ' ' + chunk.content + ' ' + chunk.keywords.join(' ')).toLowerCase();

    for (const term of terms) {
      if (chunk.keywords.some(k => k === term || k.includes(term))) {
        score += 3.0;
        matchedKeywords.push(term);
      } else if (chunk.title.toLowerCase().includes(term)) {
        score += 2.0;
        matchedKeywords.push(term);
      } else if (chunkText.includes(term)) {
        score += 1.0;
        matchedKeywords.push(term);
      }
    }

    // Baseline normalization
    const normalizedScore = terms.length > 0 
      ? Math.min(0.99, Math.max(0.20, (score / (terms.length * 2.5))))
      : 0.35;

    return {
      chunk,
      score: parseFloat(normalizedScore.toFixed(2)),
      matchedKeywords: Array.from(new Set(matchedKeywords))
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return topK results
  return scored.slice(0, topK);
}

