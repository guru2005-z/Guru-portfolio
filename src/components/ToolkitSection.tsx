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

export const ToolkitSection: React.FC = () => {
  const marquee1 = [
    'Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 
    'Microsoft Azure', 'Pinecone', 'Python', 'REST APIs', 'Docker', 'Git'
  ];

  const marquee2 = [
    'Azure AI Services', 'Spring Security', 'JPA/Hibernate', 'Scikit-learn', 
    'Razorpay', 'Google Maps', 'Tailwind CSS', 'Vite', 'JWT Auth'
  ];

  const categories = [
    {
      title: 'Backend & systems',
      items: [
        'Java (Core, Multithreading, OOP)',
        'Spring Boot (Dependency Injection, REST)',
        'Spring Security (JWT, Role-Based Access)',
        'JPA / Hibernate ORM',
        'RESTful API Architecture & DTOs',
        'Pessimistic & Optimistic Concurrency Locks'
      ]
    },
    {
      title: 'Frontend & web',
      items: [
        'React (Hooks, Custom Hooks, Context)',
        'TypeScript (Type Safety & Interfaces)',
        'Tailwind CSS (Responsive & Modern Themes)',
        'JavaScript (ES6+, Async/Await)',
        'HTML5 & Modern Web Semantics',
        'Vite Bundler & Dev Optimization'
      ]
    },
    {
      title: 'Databases & storage',
      items: [
        'PostgreSQL (Transactions, Indexing, Joins)',
        'SQL (Complex Queries, DDL/DML)',
        'Pinecone Vector Database (Embeddings)',
        'H2 Database (In-Memory Testing)',
        'Database Migration & ACID Guarantees'
      ]
    },
    {
      title: 'Cloud & AI / ML',
      items: [
        'Microsoft Azure (AZ-900 Certified)',
        'Azure AI Services & Cognitive APIs',
        'Machine Learning & NLP (Scikit-learn)',
        'Retrieval-Augmented Generation (RAG)',
        'Python (Pandas, NumPy, TF-IDF)',
        'Git, GitHub Actions & CI/CD'
      ]
    }
  ];

  const Star = () => (
    <svg className="w-3.5 h-3.5 text-[#d41514] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  );

  return (
    <section id="toolkit" className="py-16 sm:py-24 border-b border-[#e6e3da]">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={itemFadeUp}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left"
      >
        {/* Section Header */}
        <div className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-8">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">06</span>
            <span>Toolkit</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            30+ skills and tools across 4 areas
          </span>
        </div>
      </motion.div>

      {/* Marquee Track 1 (Left to Right) */}
      <div className="w-full border-y border-[#e6e3da] bg-[#ffffff] py-3 overflow-hidden select-none mb-2" aria-hidden="true">
        <div className="animate-marquee-ltr flex items-center gap-8 font-mono text-sm sm:text-base font-bold text-[#161514]">
          {[0, 1].map((cIdx) => (
            <div key={cIdx} className="flex items-center gap-8 shrink-0">
              {marquee1.map((item, i) => (
                <React.Fragment key={i}>
                  <span>{item}</span>
                  <Star />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Track 2 (Right to Left - Serif font) */}
      <div className="w-full border-b border-[#e6e3da] bg-[#fdfcf9] py-3 overflow-hidden select-none mb-12" aria-hidden="true">
        <div className="animate-marquee-rtl flex items-center gap-8 font-serif text-base sm:text-lg italic text-[#6e6b63]">
          {[0, 1].map((cIdx) => (
            <div key={cIdx} className="flex items-center gap-8 shrink-0">
              {marquee2.map((item, i) => (
                <React.Fragment key={i}>
                  <span>{item}</span>
                  <Star />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Skills Grid */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <motion.div 
              variants={itemFadeUp}
              key={cat.title} 
              className="p-4 rounded-xl border border-[#e6e3da] bg-[#ffffff] shadow-xs flex flex-col gap-3"
            >
              <h3 className="font-bold text-sm text-[#161514] border-b border-[#f0ede6] pb-2 font-mono uppercase tracking-wider text-[11px]">
                {cat.title}
              </h3>
              <ul className="flex flex-col gap-2 text-xs text-[#6e6b63] leading-snug">
                {cat.items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <span className="text-[#161514] mt-0.5">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
