import React from 'react';

export const Ticker: React.FC = () => {
  const items = [
    { tag: 'freelance platform', title: 'Gully United (Cricket Turf Booking)' },
    { tag: 'won 1st place', title: 'Cybersecurity Hackathon 2025' },
    { tag: 'won 2nd place', title: 'Medicare Web App Competition' },
    { tag: 'AZ-900 certified', title: 'Microsoft Azure Fundamentals' },
    { tag: 'hyperlocal app', title: 'KhetConnect Agricultural Labour Platform' },
    { tag: '300+ DSA solved', title: 'LeetCode & CodeChef' },
    { tag: '8.17 CGPA', title: 'B.Tech CSE NBKRIST' },
    { tag: 'AI forecaster', title: 'Consumer Sentiment & RAG Pinecone' },
    { tag: 'mini-game break', title: '🐍 Cyber Snake (Recommended) or 🟡 Dev Pac-Man' },
    { tag: 'IEEE leader', title: 'Vice Chairperson, NBKRIST' },
    { tag: 'ambassador', title: 'Microsoft Learn Student Ambassador' },
  ];

  return (
    <div className="w-full border-b border-[#e6e3da] bg-[#ffffff] py-2 overflow-hidden select-none" aria-hidden="true">
      <div className="ticker-track flex items-center gap-8 text-[11px] font-mono text-[#6e6b63]">
        {/* Render twice for continuous loop */}
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-8 shrink-0">
            {items.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <em className="not-italic text-[#161514] font-medium bg-[#f0ede6] px-1.5 py-0.5 rounded">
                  {item.tag}
                </em>
                <span className="text-[#9c988d]">·</span>
                <span className="hover:text-[#161514] transition-colors">{item.title}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
