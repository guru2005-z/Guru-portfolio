import React, { useState } from 'react';
import { 
  Server, 
  Layout, 
  Database, 
  Cloud, 
  Wrench, 
  Search,
  CheckCircle,
  Zap,
  Code2
} from 'lucide-react';
import { PORTFOLIO_DATA, SkillCategory } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server': return <Server className="w-4 h-4 text-[#D41514]" />;
      case 'Layout': return <Layout className="w-4 h-4 text-[#D41514]" />;
      case 'Database': return <Database className="w-4 h-4 text-[#D41514]" />;
      case 'Cloud': return <Cloud className="w-4 h-4 text-[#D41514]" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-[#D41514]" />;
      default: return <Code2 className="w-4 h-4 text-[#D41514]" />;
    }
  };

  const currentCategory = PORTFOLIO_DATA.skills[activeCategoryIndex];

  // Filter skills based on search term across all categories if search is active
  const isSearching = searchTerm.trim().length > 0;
  const filteredSkills = isSearching
    ? PORTFOLIO_DATA.skills.flatMap(cat => 
        cat.skills
          .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       s.experience.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(s => ({ ...s, categoryTitle: cat.title }))
      )
    : [];

  return (
    <section id="skills" className="py-20 sm:py-28 border-b border-[#1c1c1c] bg-[#0c0c0c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#161616] border border-[#262626] text-[11px] font-mono text-[#D41514] uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Full-Stack & Cloud Core Competencies</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Technical Stack & Engineering Arsenal
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8C] mt-2 max-w-xl">
              Mastery across the enterprise Java ecosystem, reactive frontends, relational/vector databases, and cloud infrastructure.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8E8D8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (e.g. Java, Azure)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] focus:border-[#D41514] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-[#666] outline-none transition-colors"
            />
          </div>
        </div>

        {/* If Searching */}
        {isSearching ? (
          <div className="bg-[#121212] rounded-2xl border border-[#242424] p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8E8D8C] mb-4">
              Search Results ({filteredSkills.length} matches for "{searchTerm}")
            </h3>
            {filteredSkills.length === 0 ? (
              <p className="text-sm font-mono text-[#666] py-6 text-center">
                No matching skills found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#222222] bg-[#161616] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-white text-base">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202020] text-[#D41514]">
                        {skill.level}
                      </span>
                    </div>
                    <span className="text-xs text-[#8E8D8C]">
                      {skill.experience}
                    </span>
                    <span className="text-[10px] font-mono text-[#555] mt-1">
                      {skill.categoryTitle}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal View: Category Tabs + Active Skills Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Category Navigation (Left 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {PORTFOLIO_DATA.skills.map((category, index) => {
                const isActive = activeCategoryIndex === index;
                return (
                  <button
                    key={category.title}
                    onClick={() => setActiveCategoryIndex(index)}
                    className={`flex items-center justify-between p-4 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'border-[#D41514] bg-[#181010] shadow-[0_0_20px_rgba(212,21,20,0.2)]'
                        : 'border-[#202020] bg-[#121212] hover:bg-[#161616] hover:border-[#303030]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${
                        isActive ? 'bg-[#D41514]/20 border-[#D41514]/40' : 'bg-[#181818] border-[#262626]'
                      }`}>
                        {getCategoryIcon(category.icon)}
                      </div>
                      <div>
                        <h4 className={`text-sm font-display font-bold ${isActive ? 'text-white' : 'text-[#CDCBCA]'}`}>
                          {category.title}
                        </h4>
                        <span className="text-[11px] font-mono text-[#8E8D8C]">
                          {category.skills.length} core technologies
                        </span>
                      </div>
                    </div>

                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#D41514]' : 'bg-[#333]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Skills Cards Grid (Right 8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-[#222222] bg-[#121212] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#202020]">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {currentCategory.title}
                  </h3>
                  <p className="text-xs font-mono text-[#8E8D8C] mt-1">
                    Enterprise patterns, production libraries, and architecture practices
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#181818] border border-[#262626]">
                  {getCategoryIcon(currentCategory.icon)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCategory.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={`p-4 rounded-xl border transition-all ${
                      skill.highlight
                        ? 'border-[#D41514]/50 bg-[#161010] shadow-[0_0_15px_rgba(212,21,20,0.1)]'
                        : 'border-[#222222] bg-[#161616] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-base text-white">
                        {skill.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        skill.highlight
                          ? 'border-[#D41514]/40 bg-[#D41514]/15 text-[#D41514]'
                          : 'border-[#282828] bg-[#202020] text-[#8E8D8C]'
                      }`}>
                        {skill.level}
                      </span>
                    </div>

                    <p className="text-xs text-[#8E8D8C] leading-relaxed">
                      {skill.experience}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#CDCBCA]/80">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D41514]" />
                      <span>Production Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
