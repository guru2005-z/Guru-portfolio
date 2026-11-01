export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Freelance' | 'Full-Stack' | 'AI / ML' | 'Hackathon';
  featured: boolean;
  description: string;
  longDescription: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl: string;
  metrics: string[];
  keyFeatures: string[];
  architectureNotes?: string;
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: string;
    experience: string;
    highlight?: boolean;
  }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  certificationNumber?: string;
  imageUrl?: string;
  verifyUrl?: string;
  description: string;
  badgeText: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Guravaiah Katta",
    avatar: "/guravaiah-katta.png",
    handle: "@guru2005-z",
    role: "Full-Stack Software Engineer & AI Systems Developer",
    tagline: "Building scalable enterprise backends with Java & Spring Boot, high-performance React frontends, and intelligent AI/ML pipelines.",
    email: "kattaguravaiah00@gmail.com",
    phone: "+91-9491501919",
    location: "Andhra Pradesh, India",
    education: {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "N.B.K.R Institute of Science and Technology",
      timeline: "2023 – 2027",
      cgpa: "8.17 / 10"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/guravaiah-katta/",
      github: "https://github.com/guru2005-z",
      githubAlt: "https://github.com/guravaiahkatta/",
      freelanceLive: "https://gully-united-xlv.vercel.app/"
    },
    resumePath: "/Guravaiah_Katta_Resume.pdf",
    resumeOriginalPath: "/assets/aistudio/Guravaiah_Resume__1__3d47e717.pdf",
    themeInspiration: {
      palette: {
        obsidianBlack: "#080808",
        chromeSilver: "#CDCBCA",
        laserCrimson: "#D41514"
      },
      vibe: "Futuristic Cybernetic High-Tech Engineering"
    }
  },

  stats: [
    { label: "DSA Problems Solved", value: "300+", sub: "LeetCode & CodeChef" },
    { label: "Engineering CGPA", value: "8.17/10", sub: "NBKRIST CSE" },
    { label: "Production Deployments", value: "100%", sub: "Live on Vercel & Cloud" },
    { label: "Hackathon Podiums", value: "Top 2", sub: "1st Cyber / 2nd Health" }
  ],

  projects: [
    {
      id: "gully-united",
      title: "Gully United",
      subtitle: "Full-Stack Cricket Ground Booking & Venue Reservation Platform",
      category: "Freelance",
      featured: true,
      description: "A production-grade sports venue reservation system enabling players to view real-time slot availability, reserve cricket turfs, and complete secure payments.",
      longDescription: "Developed as a client freelance solution for commercial cricket venue owners. The platform handles end-to-end scheduling with automated double-booking prevention, Razorpay payment gateway integration, QR-code based ticket check-in at the turf gate, interactive Google Maps venue navigation, and a comprehensive admin management dashboard.",
      technologies: ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "JPA/Hibernate", "Spring Security", "JWT", "Razorpay", "Google Maps API", "Tailwind CSS"],
      liveUrl: "https://gully-united-xlv.vercel.app/",
      githubUrl: "https://github.com/guru2005-z",
      imageUrl: "/assets/gully-united-preview.jpg",
      metrics: [
        "100% double-booking collision prevention via atomic transactions",
        "Sub-250ms booking API response time on PostgreSQL",
        "Instant digital ticket QR code delivery upon payment"
      ],
      keyFeatures: [
        "Real-time calendar slot visualizer with hourly availability matrix",
        "Razorpay checkout with webhook-driven payment verification",
        "QR-based attendance and check-in confirmation for ground operators",
        "Role-based access control (Admin, Turf Manager, Registered Player)",
        "Google Maps interactive coordinates and directions integration"
      ],
      architectureNotes: "Layered Spring Boot architecture using DTO patterns, Spring Security stateless JWT filters, transactional booking lock isolation, and a decoupled React 19 client deployed on Vercel."
    },
    {
      id: "khetconnect",
      title: "KhetConnect",
      subtitle: "Hyperlocal Agricultural Labour & Farm Work Marketplace",
      category: "Full-Stack",
      featured: true,
      description: "Full-stack location-aware platform bridging the gap between local farmers and agricultural labourers within a 5 km proximity radius.",
      longDescription: "KhetConnect addresses rural labour coordination challenges by providing a mobile-first digital labor exchange. Farmers can publish crop harvesting or field preparation requirements, while daily-wage workers can discover proximate job opportunities, track work records, and establish verified reputations through ratings.",
      technologies: ["Java", "Spring Boot", "Spring Security", "JWT", "React", "PostgreSQL", "JPA/Hibernate", "REST APIs", "Tailwind CSS"],
      githubUrl: "https://github.com/guru2005-z",
      metrics: [
        "5 km geospatial radius query matching",
        "Decentralized peer review and wage rating system",
        "Bilingual accessible interface for rural field workers"
      ],
      keyFeatures: [
        "Hyperlocal radius discovery matching laborers with immediate farm tasks",
        "Role-based JWT authentication separating Farm Owners and Labour Crews",
        "Verified work history ledger and mutual reputation scoring",
        "Transparent wage expectations and job duration tracking",
        "Lightweight mobile responsive UI optimized for low-bandwidth connections"
      ],
      architectureNotes: "PostgreSQL relational schema modeling workers, employers, farm coordinates, and contract states with Hibernate ORM and Spring Security endpoint protection."
    },
    {
      id: "ai-market-forecaster",
      title: "AI Consumer Sentiment & Market Forecaster",
      subtitle: "Infosys Internship · NLP, RAG & Streamlit Pipeline",
      category: "AI / ML",
      featured: true,
      description: "Machine learning system for sentiment classification and consumer market trend predictions equipped with RAG and vector database contextual retrieval.",
      longDescription: "Engineered during the Infosys Springboard Virtual Internship. End-to-end data processing and model inference pipeline applying advanced NLP, text normalization, and transformer embeddings to consumer sentiment streams. Integrated Retrieval-Augmented Generation (RAG) with Pinecone vector database and deployed an interactive dashboard on Streamlit Cloud.",
      technologies: ["Python", "Streamlit", "Scikit-learn", "NLP", "LLMs", "RAG", "Pinecone", "Pandas", "NumPy", "Hugging Face"],
      liveUrl: "https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/",
      githubUrl: "https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster",
      imageUrl: "/assets/ai-sentiment-forecaster-preview.jpg",
      metrics: [
        "High accuracy sentiment classification on benchmark consumer feedback",
        "Sub-150ms semantic search latency via Pinecone indexing",
        "Automated pipeline for tokenization, lemmatization and TF-IDF feature sets"
      ],
      keyFeatures: [
        "Interactive Streamlit web dashboard for live sentiment querying",
        "Multi-class sentiment prediction (Bullish, Neutral, Bearish)",
        "RAG-augmented contextual question answering across quarterly reports",
        "Pinecone vector index integration for continuous similarity search",
        "Confusion matrix and model evaluation reporting suite"
      ],
      architectureNotes: "Python ML architecture utilizing scikit-learn model serialization, Pinecone vector embeddings for RAG retrieval, and Streamlit cloud deployment."
    },
    {
      id: "cybershield-sentinel",
      title: "CyberShield Sentinel",
      subtitle: "1st Place Winner – Cybersecurity Hackathon 2025",
      category: "Hackathon",
      featured: false,
      description: "Automated network vulnerability scanner and intrusion detection triage system built during a 36-hour competitive hackathon.",
      longDescription: "Won 1st Place overall for developing a real-time security telemetry auditor that flags anomalous network traffic patterns, insecure API endpoints, and potential CVE zero-day vectors.",
      technologies: ["Python", "Docker", "REST APIs", "Spring Boot", "Network Forensics"],
      githubUrl: "https://github.com/guru2005-z",
      imageUrl: "/assets/supraja-scoreboard.jpg",
      metrics: [
        "1st Place Hackathon Winner among 40+ engineering teams",
        "Real-time packet inspection and threat severity scoring",
        "Automated PDF compliance audit report generation"
      ],
      keyFeatures: [
        "Zero-day signature heuristic scanning",
        "Automated vulnerability mitigation recommendations",
        "Low-overhead containerized deployment with Docker"
      ]
    },
    {
      id: "medicare-connect",
      title: "MediCare Connect Pro",
      subtitle: "2nd Place Winner – Medicare Web Application Competition",
      category: "Hackathon",
      featured: false,
      description: "Patient EHR consultation portal and automated clinic appointment queuing system with encrypted health records.",
      longDescription: "Awarded 2nd Place for designing a streamlined clinic workflow platform that minimizes patient wait times, encrypts patient history under HIPAA standards, and provides physicians with an instant clinical summary.",
      technologies: ["React", "Spring Boot", "PostgreSQL", "Tailwind CSS", "REST APIs"],
      githubUrl: "https://github.com/guru2005-z",
      metrics: [
        "2nd Place Award Winner in health-tech innovation category",
        "Interactive virtual triage queue with live wait-time estimates",
        "Role-based Doctor / Patient / Receptionist portal"
      ],
      keyFeatures: [
        "Real-time queue tracking for walk-in and booked appointments",
        "Secure prescription download with digital physician signature",
        "Responsive medical records portal accessible on any mobile device"
      ]
    }
  ] as Project[],

  skills: [
    {
      title: "Backend & Systems",
      icon: "Server",
      skills: [
        { name: "Java", level: "Advanced", experience: "Core, Multithreading, OOP", highlight: true },
        { name: "Spring Boot", level: "Advanced", experience: "REST APIs, Dependency Injection", highlight: true },
        { name: "Spring Security", level: "Proficient", experience: "JWT, RBAC, OAuth2 Filters", highlight: true },
        { name: "JPA / Hibernate", level: "Proficient", experience: "Entity Relationships, Caching", highlight: false },
        { name: "RESTful Architecture", level: "Advanced", experience: "API Design, DTOs, Error Handling", highlight: true }
      ]
    },
    {
      title: "Frontend Engineering",
      icon: "Layout",
      skills: [
        { name: "React", level: "Advanced", experience: "Hooks, Context, Component Design", highlight: true },
        { name: "TypeScript", level: "Proficient", experience: "Type Safety, Generics, Interfaces", highlight: true },
        { name: "Tailwind CSS", level: "Advanced", experience: "Responsive Design, Custom Themes", highlight: true },
        { name: "JavaScript (ES6+)", level: "Advanced", experience: "Async/Await, DOM, Event Loops", highlight: false },
        { name: "HTML5 & CSS3", level: "Advanced", experience: "Modern Semantics, Flexbox, Grid", highlight: false }
      ]
    },
    {
      title: "Databases & Storage",
      icon: "Database",
      skills: [
        { name: "PostgreSQL", level: "Advanced", experience: "Complex Queries, Indexing, Transactions", highlight: true },
        { name: "SQL", level: "Advanced", experience: "Joins, Aggregations, DDL/DML", highlight: true },
        { name: "Pinecone Vector DB", level: "Proficient", experience: "Vector Embeddings, Similarity Search", highlight: true },
        { name: "H2 Database", level: "Proficient", experience: "In-memory Unit & Integration Testing", highlight: false }
      ]
    },
    {
      title: "Cloud & AI / ML",
      icon: "Cloud",
      skills: [
        { name: "Microsoft Azure", level: "Certified", experience: "AZ-900 Certified, App Services", highlight: true },
        { name: "Azure AI Services", level: "Proficient", experience: "Cognitive Services, Vision, NLP", highlight: true },
        { name: "Machine Learning & NLP", level: "Proficient", experience: "Scikit-learn, Sentiment Analysis", highlight: true },
        { name: "LLMs & RAG", level: "Proficient", experience: "Context Augmentation, Vector Reranking", highlight: true },
        { name: "Python", level: "Proficient", experience: "NumPy, Pandas, Model Pipelines", highlight: false }
      ]
    },
    {
      title: "DevOps & Tooling",
      icon: "Wrench",
      skills: [
        { name: "Git & GitHub", level: "Advanced", experience: "Version Control, Pull Requests, CI", highlight: true },
        { name: "VS Code & IntelliJ IDEA", level: "Advanced", experience: "Spring Tools, Debugging, Profiling", highlight: false },
        { name: "Postman", level: "Proficient", experience: "API Testing, Automated Collections", highlight: false },
        { name: "Vite & Modern Bundlers", level: "Proficient", experience: "Build Optimization, Dev Servers", highlight: false }
      ]
    }
  ] as SkillCategory[],

  certifications: [
    {
      id: "azure-az900",
      title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
      issuer: "Microsoft",
      date: "July 3, 2026",
      credentialId: "5B48115BB42E21FC",
      certificationNumber: "A10BH5-156616",
      imageUrl: "/assets/aistudio/image_dedf00ae.png",
      verifyUrl: "https://learn.microsoft.com/users/guravaiah-katta/credentials",
      description: "Demonstrates foundational knowledge of cloud services, security, privacy, compliance, trust, and Azure core architectural components.",
      badgeText: "Online Verifiable • Signed by Satya Nadella"
    },
    {
      id: "microsoft-mlsa-2026",
      title: "Microsoft Student Ambassadors | 2026 (Associate)",
      issuer: "Microsoft",
      date: "2026",
      credentialId: "MLSA-2026-ASSOCIATE",
      imageUrl: "/assets/mlsa-certificate.jpg",
      description: "Recognized as a Microsoft Student Ambassador (Associate) in recognition of hard work and dedication to the global student community. Signed by Pablo Veramendi (Global Director).",
      badgeText: "Associate • Signed by Pablo Veramendi"
    },
    {
      id: "infosys-internship-6.0",
      title: "Infosys Springboard Internship 6.0 Certificate of Completion",
      issuer: "Infosys Limited",
      date: "April 8, 2026",
      credentialId: "Internship 6.0 (B 11)",
      imageUrl: "/assets/infosys-certificate.jpg",
      verifyUrl: "https://verify.onwingspan.com",
      description: "Completed Internship 6.0 (B 11): Intelligent Forecasting System for Consumer Behavior and Industry Trends (Dec 22, 2025 – Feb 25, 2026). Signed by Satheesha B. Nanjappa (SVP & Head, Infosys Limited).",
      badgeText: "Verified on Wingspan • Signed by Satheesha B. Nanjappa"
    },
    {
      id: "supraja-ctf-excellence",
      title: "Certificate of Excellence: Best Student of Cybersecurity CTF Hackathon",
      issuer: "Supraja Technologies & NBKRIST",
      date: "April 10, 2025",
      credentialId: "23KB1A0597",
      imageUrl: "/assets/supraja-excellence-cert.jpg",
      description: "Awarded 5-Star Certificate of Excellence as Best Student of the Cybersecurity Level-1 CTF Hackathon. Team Bug_Slayers finished Rank #1 with 223 points on live scoreboard. Awarded by Santosh Chaluvadi (Founder & CEO, Supraja Technologies).",
      badgeText: "1st Place Winner • Best Student Award"
    },
    {
      id: "kaggle-genai-2025",
      title: "Kaggle GenAI 2025 Agents Intensive Capstone",
      issuer: "Kaggle & Google",
      date: "2025",
      description: "Rigorous specialization in building autonomous GenAI agents, function calling architectures, retrieval systems, and multi-agent coordination.",
      badgeText: "GenAI Specialization"
    }
  ] as Certification[],

  achievements: [
    {
      icon: "Code",
      title: "300+ DSA Problems Solved",
      description: "Demonstrated strong computer science fundamentals across arrays, dynamic programming, trees, and graph algorithms on LeetCode & CodeChef."
    },
    {
      icon: "Trophy",
      title: "1st Place & Best Student – Supraja CTF Hackathon",
      description: "Led Team Bug_Slayers to Rank #1 (223 points) on the live scoreboard at the Cybersecurity Level-1 CTF Hackathon. Awarded 5-star Certificate of Excellence by Santosh Chaluvadi, CEO of Supraja Technologies."
    },
    {
      icon: "Award",
      title: "2nd Place – Medicare Web App Competition",
      description: "Honored with 2nd place for building an accessible healthcare appointment queue and EHR system."
    },
    {
      icon: "Users",
      title: "IEEE Vice Chairperson – NBKRIST",
      description: "Vice Chairperson of IEEE Student Branch. Engineered and deployed two live production websites: nbkristieee.in (official IEEE branch portal) and hackspirit.fun (campus hackathon platform)."
    },
    {
      icon: "Globe",
      title: "Microsoft Learn Student Ambassador",
      description: "Empowered fellow students in cloud computing, Azure fundamentals, and modern developer technologies."
    }
  ],

  experiences: [
    {
      role: "Freelance Software Developer",
      company: "Gully United",
      location: "Remote / Hybrid",
      period: "2026 – Present",
      liveLink: "https://gully-united-xlv.vercel.app/",
      bullets: [
        "Architecting and delivering a production-ready sports venue reservation system using Java, Spring Boot, React, TypeScript, and PostgreSQL.",
        "Implemented secure Razorpay payment processing and real-time webhook verifications with zero double-booking tolerance.",
        "Engineered role-based JWT authentication, automated QR-based ticket verification, and Google Maps venue locator.",
        "Designed and shipped an intuitive owner admin dashboard for slot pricing, schedule overrides, and financial analytics."
      ],
      tech: ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Razorpay", "JWT", "Google Maps"]
    },
    {
      role: "Infosys Springboard Virtual Internship",
      company: "Infosys Springboard",
      location: "Virtual",
      period: "Jan 2026 – Mar 2026",
      liveLink: "https://guru2005-z-ai-powered-market-trend-consumer-sen-srcuiapp-dzdssq.streamlit.app/",
      githubUrl: "https://github.com/guru2005-z/AI-Powered-Market-Trend-Consumer-Sentiment-Forecaster",
      bullets: [
        "Developed an AI-based consumer sentiment analysis pipeline using NLP and machine learning techniques deployed live on Streamlit Cloud.",
        "Executed data preprocessing, feature engineering (TF-IDF & embedding representations), and cross-validation.",
        "Gained direct industry experience evaluating AI solutions for production enterprise use cases."
      ],
      tech: ["Python", "Streamlit", "NLP", "Machine Learning", "Scikit-learn", "Pandas"]
    },
    {
      role: "Vice Chairperson & Lead Web Developer",
      company: "IEEE Student Branch – NBKRIST",
      location: "NBKRIST, Vidyanagar",
      period: "2024 – 2026",
      liveLink: "https://nbkristieee.in",
      secondaryLiveLink: "https://hackspirit.fun",
      bullets: [
        "Served as Vice Chairperson of the university IEEE Student Branch, spearheading campus-wide developer workshops and hackathons.",
        "Engineered and shipped the official IEEE Student Branch portal (nbkristieee.in) for member directories and event archives.",
        "Architected and deployed the HackSpirit hackathon platform (hackspirit.fun), managing team registrations and problem tracks."
      ],
      tech: ["React", "TypeScript", "Tailwind CSS", "Web Architecture", "Event Platforms", "Vercel"]
    }
  ]
};
