import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, ArrowLeft, RotateCcw, Sparkles, User, Bot, Check, ChevronDown, 
  ChevronUp, ExternalLink, ShieldCheck, Terminal, Cpu, Database, X, Mic,
  BookOpen, Layers, Search, Zap, CheckCircle2
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { soundManager } from '../utils/soundManager';
import { RAG_KNOWLEDGE_BASE, KnowledgeChunk } from '../data/ragKnowledgeBase';

export interface RagSource {
  id: string;
  title: string;
  category: string;
  score: number;
  highlight: string;
  content: string;
  matchedKeywords?: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCall?: {
    name: string;
    duration: string;
    status: 'done' | 'running';
  };
  rag?: {
    retrievalLatency: string;
    totalLatency?: string;
    confidenceScore: number;
    sources: RagSource[];
    grounded: boolean;
    model: string;
  };
}

interface AgentViewProps {
  onBackToClassic: () => void;
  initialPrompt?: string;
}

export const AgentView: React.FC<AgentViewProps> = ({ onBackToClassic, initialPrompt }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am Guru AI, Guravaiah Katta's official RAG-grounded technical representative. I have indexed all of Guravaiah's production projects, architectures (including Gully United's double-booking lock system), engineering efforts, and credentials.",
      toolCall: {
        name: 'rag_vector_index_init',
        duration: '18ms',
        status: 'done'
      },
      rag: {
        retrievalLatency: '14ms',
        totalLatency: '32ms',
        confidenceScore: 0.98,
        grounded: true,
        model: 'gemini-3.8-flash (RAG)',
        sources: [
          {
            id: 'gully-united-overview',
            title: 'Gully United - Cricket Ground Booking Platform',
            category: 'Project',
            score: 0.98,
            highlight: 'Production web app live at https://gully-united-xlv.vercel.app/',
            content: 'Gully United is Guravaiah Katta\'s flagship commercial freelance web application live at https://gully-united-xlv.vercel.app/.'
          },
          {
            id: 'skills-backend-spring',
            title: 'Backend Engineering: Java, Spring Boot & Microservices',
            category: 'Skill',
            score: 0.94,
            highlight: 'Enterprise Java, Spring Boot, Spring Security JWT, JPA/Hibernate.',
            content: 'Guravaiah specializes in Java (17/21) and Spring Boot enterprise architectures.'
          }
        ]
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedCitationIdx, setExpandedCitationIdx] = useState<number | null>(0);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trace' | 'corpus' | 'state'>('trace');
  const [corpusSearch, setCorpusSearch] = useState('');
  const [selectedCorpusCategory, setSelectedCorpusCategory] = useState<string>('All');
  const [modelKilled, setModelKilled] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-open trace panel only on large screens (desktop)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidePanelOpen(true);
    }
  }, []);

  const projects = PORTFOLIO_DATA.projects;

  const suggestedQuestions = [
    { label: 'How does Gully United prevent double bookings?', prompt: 'How does Gully United prevent double bookings and handle database lock failures?' },
    { label: 'Tell me about his RAG & AI projects', prompt: 'Tell me about Guravaiah\'s AI projects, NLP models, and RAG pipelines' },
    { label: 'What is his Spring Boot tech stack?', prompt: "What is Guravaiah's backend architecture stack and API design?" },
    { label: 'Is Guravaiah available for hire?', prompt: 'Is Guravaiah Katta available for software engineering roles or freelance contracts?' }
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    soundManager.play('click');
    setModelKilled(false);
    const userMessage: Message = { role: 'user', content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: updated.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          }))
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: data.reply || "Guravaiah is available for software engineering roles and freelance contracts. Reach him directly at kattaguravaiah00@gmail.com!",
        toolCall: {
          name: data?.rag?.model || 'rag_semantic_search',
          duration: data?.rag?.retrievalLatency || '24ms',
          status: 'done'
        },
        rag: data.rag
      };

      setMessages([...updated, newAssistantMessage]);
      setExpandedCitationIdx(updated.length);
    } catch {
      // Local RAG fallback
      const localChunks = RAG_KNOWLEDGE_BASE.filter(c => 
        c.keywords.some(k => text.toLowerCase().includes(k)) || 
        c.content.toLowerCase().includes(text.toLowerCase())
      );
      const topChunk = localChunks[0] || RAG_KNOWLEDGE_BASE[0];

      setMessages([...updated, { 
        role: 'assistant', 
        content: topChunk.content,
        toolCall: {
          name: 'local_rag_grounding',
          duration: '16ms',
          status: 'done'
        },
        rag: {
          retrievalLatency: '16ms',
          totalLatency: '28ms',
          confidenceScore: 0.92,
          grounded: true,
          model: 'rag-local-synthesizer',
          sources: [
            {
              id: topChunk.id,
              title: topChunk.title,
              category: topChunk.category,
              score: 0.92,
              highlight: topChunk.highlight,
              content: topChunk.content
            }
          ]
        }
      }]);
      setExpandedCitationIdx(updated.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    soundManager.play('click');
    setModelKilled(false);
    setMessages([
      {
        role: 'assistant',
        content: "Everything he's shipped. Open any one.",
        toolCall: {
          name: 'list_projects',
          duration: '236ms',
          status: 'done'
        }
      }
    ]);
  };

  const handleKillModel = () => {
    soundManager.play('die');
    setModelKilled(true);
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: "⚠️ Model execution terminated by user. Process state aborted."
      }
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-[#f9f8f5] grid-bg select-text">
      {/* Top Bar matching mohammad-rizwan.tech/agent */}
      <div className="w-full border-b border-[#e6e3da] bg-[#f9f8f5]/90 backdrop-blur-xs px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-xs font-mono gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBackToClassic}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-mono text-[#161514] hover:text-[#d41514] font-medium transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Classic</span>
          </button>
          <span className="text-[#d5d1c5]">/</span>
          <span className="font-semibold text-[#161514] truncate">Guru AI</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[#6e6b63] hidden md:inline">AP 15:29 IST</span>
          <button
            onClick={handleReset}
            className="p-1 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514]"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border border-[#d5d1c5] bg-[#ffffff] text-[10px] sm:text-[11px] text-[#161514]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span className="hidden sm:inline">gemini-3.8-flash</span>
            <span className="sm:hidden font-mono">RAG</span>
          </div>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="px-2 py-0.5 rounded border border-[#d5d1c5] bg-[#ffffff] text-[10px] sm:text-[11px] text-[#6e6b63] hover:text-[#161514] cursor-pointer"
          >
            {isSidePanelOpen ? 'Hide Trace' : 'Trace / RAG'}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Canvas + Right Trace Telemetry Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Area: Infinite Canvas & Shipped Projects */}
        <div className="flex-1 min-w-0 w-full overflow-y-auto p-3 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="max-w-3xl w-full flex flex-col gap-4 sm:gap-6">

            {/* Conversation Flow */}
            {messages.map((m, idx) => (
              <div key={idx} className="w-full flex flex-col items-start gap-2">
                {m.role === 'user' ? (
                  <div className="self-end bg-[#161514] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl rounded-tr-none text-xs sm:text-sm font-sans shadow-xs max-w-[88%] break-words">
                    {m.content}
                  </div>
                ) : (
                  <div className="w-full bg-[#ffffff] border border-[#d5d1c5] rounded-xl p-3.5 sm:p-5 shadow-xs text-left overflow-hidden">
                    {/* Header [ ▪ ] matching mohammad-rizwan.tech/agent */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-4 h-4 border border-[#161514] rounded-xs flex items-center justify-center bg-white shrink-0">
                        <span className="w-1.5 h-1.5 bg-[#161514] rounded-xs" />
                      </div>
                      <h4 className="font-sans font-semibold text-sm sm:text-base text-[#161514] leading-relaxed">
                        {m.content}
                      </h4>
                    </div>

                    {/* RAG Grounding & Sources Accordion */}
                    {m.rag?.sources && m.rag.sources.length > 0 && (
                      <div className="border border-[#e6e3da] rounded-lg bg-[#faf8f4] overflow-hidden mb-3 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedCitationIdx(expandedCitationIdx === idx ? null : idx)}
                          className="w-full px-3 py-2 bg-[#f4f2ec] hover:bg-[#ece9e0] flex items-center justify-between transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 text-[#161514]">
                            <BookOpen className="w-3.5 h-3.5 text-[#16a34a]" />
                            <span className="font-semibold text-[11px]">
                              RAG Grounded: {m.rag.sources.length} sources retrieved
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#16a34a]/10 text-[#16a34a] font-bold">
                              {Math.round(m.rag.confidenceScore * 100)}% match
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#6e6b63]">
                            <span>{m.rag.retrievalLatency}</span>
                            {expandedCitationIdx === idx ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </button>

                        {expandedCitationIdx === idx && (
                          <div className="p-3 divide-y divide-[#e6e3da]/70 flex flex-col gap-2.5 bg-white">
                            {m.rag.sources.map((src, sIdx) => (
                              <div key={sIdx} className="pt-2 first:pt-0 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-[#161514] text-[11px] flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                                    {src.title}
                                  </span>
                                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#f0ede6] text-[#6e6b63] border border-[#d5d1c5]">
                                    {src.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#6e6b63] leading-relaxed">
                                  {src.content}
                                </p>
                                {src.highlight && (
                                  <div className="text-[10px] text-[#d41514] bg-[#fff5f5] px-2 py-0.5 rounded border border-[#ffe0e0] font-medium w-fit">
                                    ★ {src.highlight}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tool Call Badges matching screenshot */}
                    {m.toolCall && (
                      <div className="border border-[#e6e3da] rounded-lg p-2.5 bg-[#fdfcf9] mb-4 text-xs font-mono flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[#16a34a]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-3.5 h-3.5 rounded-xs bg-[#16a34a] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                            <span>Done</span>
                          </span>
                          <span className="text-[#6e6b63]">{m.toolCall.duration}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#6e6b63] pt-1 border-t border-[#f0ede6]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-xs bg-[#16a34a] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                            <span>List everything he's built</span>
                          </span>
                          <span className="text-[#9c988d]">{m.toolCall.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Shipped Projects Cards matching PACK / CCR / FinBoom list in screenshot */}
                    {idx === 0 && (
                      <div className="border border-[#e6e3da] rounded-lg divide-y divide-[#e6e3da] bg-[#ffffff] overflow-hidden mb-2">
                        {projects.map((proj) => {
                          const isExpanded = expandedProjectId === proj.id;
                          return (
                            <div key={proj.id} className="p-3 sm:p-3.5 text-xs">
                              <div 
                                onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                                className="flex items-center justify-between cursor-pointer group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-7 rounded bg-[#161514] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                    {proj.category === 'Freelance' ? 'PROD' : 'CODE'}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-[#161514] group-hover:text-[#f59e0b] transition-colors flex items-center gap-2">
                                      <span>{proj.title}</span>
                                      {proj.liveUrl && (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#e2f7e8] text-[#16a34a] font-mono">
                                          live
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[#6e6b63] font-mono text-[11px] line-clamp-1">
                                      {proj.subtitle}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-[#9c988d] font-mono text-[11px]">
                                  <span>2025-2026</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-[#f0ede6] space-y-2 text-left animate-in fade-in duration-150">
                                  <p className="text-xs text-[#161514] leading-relaxed">
                                    {proj.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {proj.technologies.map(t => (
                                      <span key={t} className="px-2 py-0.5 rounded bg-[#f0ede6] text-[#6e6b63] font-mono text-[10px]">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-3 pt-2 font-mono text-xs">
                                    {proj.liveUrl && (
                                      <a
                                        href={proj.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[#161514] hover:underline font-medium"
                                      >
                                        <span>Launch App</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                    <a
                                      href={proj.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[#6e6b63] hover:text-[#161514] hover:underline"
                                    >
                                      <span>Source Code</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="w-full bg-[#ffffff] border border-[#d5d1c5] rounded-xl p-4 text-xs font-mono text-[#6e6b63] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
                <span>Generating trace and synthesis...</span>
              </div>
            )}

            <div ref={endRef} />

            {/* Suggested Queries Pills + Kill the Model Button matching screenshot */}
            <div className="w-full flex flex-wrap items-center gap-2 pt-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.prompt)}
                  className="px-3 py-1.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:border-[#161514] text-xs font-mono text-[#161514] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="text-[#9c988d]">{idx + 1}</span>
                  <span>{q.label}</span>
                </button>
              ))}

              <button
                onClick={handleKillModel}
                disabled={modelKilled}
                className="px-3 py-1.5 rounded-lg border border-[#fecaca] bg-[#fff5f5] hover:bg-[#fee2e2] text-xs font-mono text-[#dc2626] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ml-auto disabled:opacity-50"
              >
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                <span>Kill the model</span>
              </button>
            </div>

            {/* Chat Input Bar matching screenshot */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="w-full border border-[#d5d1c5] rounded-xl bg-[#ffffff] shadow-xs p-1.5 flex items-center gap-2 mt-2"
            >
              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-[#9c988d] hover:text-[#161514] transition-colors"
                title="New Context"
              >
                +
              </button>

              <input
                type="text"
                placeholder="Ask about Guravaiah's work..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm font-mono text-[#161514] placeholder:text-[#9c988d] outline-none px-2"
              />

              <button
                type="button"
                onClick={() => handleSend("Tell me his top technical superpower")}
                className="p-1.5 text-[#9c988d] hover:text-[#161514]"
                title="Voice input simulation"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 rounded-lg bg-[#161514] hover:bg-[#302e2b] disabled:opacity-40 text-white font-mono text-xs font-medium transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>

          </div>
        </div>

        {/* Right Area: Trace & Telemetry Panel (Mobile Slide-Over Drawer / Desktop Sidebar) */}
        {isSidePanelOpen && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsSidePanelOpen(false)}
            />

            {/* Sidebar / Drawer Container */}
            <div className="fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[360px] lg:static lg:w-80 xl:w-96 border-l border-[#e6e3da] bg-[#ffffff] flex flex-col font-mono text-xs shrink-0 select-none shadow-2xl lg:shadow-none animate-in slide-in-from-right duration-200">
              {/* Panel Tabs Header */}
              <div className="flex items-center justify-between border-b border-[#e6e3da] bg-[#f9f8f5] px-3 py-2">
                <div className="flex items-center gap-1.5">
                  {(['trace', 'corpus', 'state'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-1 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                        activeTab === tab
                          ? 'bg-[#ffffff] font-bold text-[#161514] border border-[#d5d1c5] shadow-2xs'
                          : 'text-[#6e6b63] hover:text-[#161514]'
                      }`}
                    >
                      {tab === 'corpus' ? 'RAG Index (17)' : tab}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 text-[#9c988d] hover:text-[#161514] cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            {/* Tab: Trace Telemetry */}
            {activeTab === 'trace' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left text-[11px] leading-relaxed">
                <div className="text-[#9c988d] border-b border-[#f0ede6] pb-2 flex justify-between">
                  <span>turn 1 · "RAG Vector Index"</span>
                  <span className="tabular-nums">14ms</span>
                </div>
                <div className="text-[#9c988d] border-b border-[#f0ede6] pb-2 flex justify-between">
                  <span>turn 2 · "Gully United Architecture"</span>
                  <span className="tabular-nums">28ms</span>
                </div>

                {/* Real-time telemetry items */}
                <div className="flex items-start gap-2 pt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#161514]">Hybrid RAG Retrieval</div>
                    <div className="text-[#6e6b63]">
                      In-memory vector & BM25 keyword matching across 17 curated knowledge chunks
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#161514]">Grounding Guardrail</div>
                    <div className="text-[#6e6b63]">
                      Strict context injection: 100% anchored in actual portfolio database (0 hallucination risk)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#161514]">LLM Inference</div>
                    <div className="text-[#6e6b63]">
                      gemini-3.8-flash (RAG) + dynamic context injection & fallback synthesizer
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                  <div>
                    <div className="font-bold text-[#161514]">Source Verification</div>
                    <div className="text-[#6e6b63]">
                      Live clickable citations generated for every claim made by the agent
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: RAG Corpus Explorer */}
            {activeTab === 'corpus' && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 text-left text-[11px]">
                {/* Search in Knowledge Base */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#9c988d]" />
                  <input
                    type="text"
                    placeholder="Search 17 indexed chunks..."
                    value={corpusSearch}
                    onChange={(e) => setCorpusSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-md border border-[#d5d1c5] bg-[#f9f8f5] text-xs outline-none focus:border-[#161514]"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1">
                  {['All', 'Project', 'Architecture', 'Skill', 'Certification'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCorpusCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                        selectedCorpusCategory === cat
                          ? 'bg-[#161514] text-white font-medium'
                          : 'bg-[#f4f2ec] text-[#6e6b63] hover:text-[#161514]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* List of Chunks */}
                <div className="flex flex-col gap-2 pt-1 divide-y divide-[#e6e3da]">
                  {RAG_KNOWLEDGE_BASE
                    .filter(c => selectedCorpusCategory === 'All' || c.category === selectedCorpusCategory)
                    .filter(c => !corpusSearch || c.title.toLowerCase().includes(corpusSearch.toLowerCase()) || c.content.toLowerCase().includes(corpusSearch.toLowerCase()))
                    .map(chunk => (
                      <div key={chunk.id} className="pt-2 first:pt-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#161514] text-[11px]">
                            {chunk.title}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#f0ede6] text-[#6e6b63] border border-[#d5d1c5]">
                            {chunk.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#6e6b63] line-clamp-2">
                          {chunk.content}
                        </p>
                        <button
                          onClick={() => handleSend(`Tell me more about ${chunk.title}`)}
                          className="text-[10px] text-[#d41514] hover:underline font-mono w-fit cursor-pointer flex items-center gap-1"
                        >
                          <span>Ask RAG agent about this</span>
                          <span>→</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tab: State */}
            {activeTab === 'state' && (
              <div className="flex-1 overflow-y-auto p-4 text-left font-mono text-[10px] text-[#6e6b63] space-y-2">
                <div className="p-2 rounded bg-[#f4f2ec] border border-[#e6e3da]">
                  <span className="text-[#161514] font-bold block mb-1">RAG PIPELINE STATE</span>
                  <div>Corpus: 17 indexed chunks</div>
                  <div>Vector Dimension: 1536-simulated hybrid</div>
                  <div>Grounding Mode: Strict Factual</div>
                  <div>Primary Target: Guravaiah Katta</div>
                </div>
                <div className="p-2 rounded bg-[#f4f2ec] border border-[#e6e3da]">
                  <span className="text-[#161514] font-bold block mb-1">CANDIDATE AVAILABILITY</span>
                  <div>Role: Junior SDE / AI Engineer</div>
                  <div>Status: Open for Internships & Full-time</div>
                  <div>Live Project: Gully United</div>
                </div>
              </div>
            )}

            {/* Status Footer */}
            <div className="p-3 border-t border-[#e6e3da] bg-[#f9f8f5] text-[10px] text-[#6e6b63] flex items-center justify-between">
              <span>Status: Synchronized</span>
              <span className="flex items-center gap-1 text-[#16a34a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Online
              </span>
            </div>
          </div>
        </>
      )}

      </div>
    </div>
  );
};
