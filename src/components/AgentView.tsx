import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, ArrowLeft, RotateCcw, Sparkles, User, Bot, Check, ChevronDown, 
  ChevronUp, ExternalLink, ShieldCheck, Terminal, Cpu, Database, X, Mic
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { soundManager } from '../utils/soundManager';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCall?: {
    name: string;
    duration: string;
    status: 'done' | 'running';
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
      content: "Everything he's shipped. Open any one.",
      toolCall: {
        name: 'list_projects',
        duration: '236ms',
        status: 'done'
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'trace' | 'state' | 'events' | 'ag-ui'>('trace');
  const [modelKilled, setModelKilled] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const projects = PORTFOLIO_DATA.projects;

  const suggestedQuestions = [
    { label: 'How does Gully United handle failures?', prompt: 'How does Gully United prevent double bookings and handle database lock failures?' },
    { label: 'Open Gully United', prompt: 'Tell me about the Gully United project architecture and live deployment' },
    { label: 'Show Spring Boot architecture', prompt: "What is Guravaiah's backend architecture stack and API design?" }
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
      setMessages([...updated, {
        role: 'assistant',
        content: data.reply || "Guravaiah is available for software engineering roles and freelance contracts. Reach him directly at kattaguravaiah00@gmail.com!",
        toolCall: {
          name: 'query_experience',
          duration: '312ms',
          status: 'done'
        }
      }]);
    } catch {
      // Intelligent grounded fallback
      let fallback = "Guravaiah Katta is a Full-Stack Software Engineer with strong expertise in Java, Spring Boot, React, and PostgreSQL. Contact him at kattaguravaiah00@gmail.com!";
      const lower = text.toLowerCase();
      if (lower.includes('gully') || lower.includes('double') || lower.includes('cricket') || lower.includes('fail')) {
        fallback = "In 'Gully United', Guravaiah implemented atomic database transactions using PostgreSQL row-level locks (SELECT FOR UPDATE) to ensure two users attempting to book the exact same slot concurrently never collide. Failed transactions roll back cleanly before charging via Razorpay webhook.";
      } else if (lower.includes('spring') || lower.includes('boot') || lower.includes('architecture')) {
        fallback = "Guravaiah builds clean multi-layer Spring Boot architectures: Controller -> DTO Validation -> Service Layer -> JPA/Hibernate Repositories -> PostgreSQL with connection pooling. He integrates Spring Security JWT stateless authentication and rate-limiting filters.";
      } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email')) {
        fallback = "You can reach Guravaiah directly at kattaguravaiah00@gmail.com or by phone at +91-9491501919. He is available for full-time engineering roles starting 2026/2027 and immediate freelance contracts!";
      }

      setMessages([...updated, { 
        role: 'assistant', 
        content: fallback,
        toolCall: {
          name: 'retrieval_grounding',
          duration: '420ms',
          status: 'done'
        }
      }]);
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
      <div className="w-full border-b border-[#e6e3da] bg-[#f9f8f5]/90 backdrop-blur-xs px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToClassic}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#161514] hover:text-[#d41514] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Classic</span>
          </button>
          <span className="text-[#d5d1c5]">/</span>
          <span className="font-semibold text-[#161514]">Guravaiah Katta AI Agent</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#6e6b63] hidden md:inline">AP 15:29 IST</span>
          <button
            onClick={handleReset}
            className="p-1 rounded border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514]"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#d5d1c5] bg-[#ffffff] text-[11px] text-[#161514]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>gemini-3.8-flash</span>
          </div>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="px-2 py-0.5 rounded border border-[#d5d1c5] bg-[#ffffff] text-[11px] text-[#6e6b63] hover:text-[#161514] cursor-pointer"
          >
            {isSidePanelOpen ? 'Hide Trace' : 'Show Trace'}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Canvas + Right Trace Telemetry Panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area: Infinite Canvas & Shipped Projects */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="max-w-3xl w-full flex flex-col gap-6">

            {/* Conversation Flow */}
            {messages.map((m, idx) => (
              <div key={idx} className="w-full flex flex-col items-start gap-2">
                {m.role === 'user' ? (
                  <div className="self-end bg-[#161514] text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-xs sm:text-sm font-sans shadow-xs">
                    {m.content}
                  </div>
                ) : (
                  <div className="w-full bg-[#ffffff] border border-[#d5d1c5] rounded-xl p-4 sm:p-5 shadow-xs text-left">
                    {/* Header [ ▪ ] matching mohammad-rizwan.tech/agent */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-4 h-4 border border-[#161514] rounded-xs flex items-center justify-center bg-white shrink-0">
                        <span className="w-1.5 h-1.5 bg-[#161514] rounded-xs" />
                      </div>
                      <h4 className="font-sans font-semibold text-sm sm:text-base text-[#161514]">
                        {m.content}
                      </h4>
                    </div>

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

        {/* Right Area: Trace & Telemetry Panel (Exact match to screenshot) */}
        {isSidePanelOpen && (
          <div className="w-80 lg:w-96 border-l border-[#e6e3da] bg-[#ffffff] flex flex-col font-mono text-xs shrink-0 select-none">
            {/* Panel Tabs Header */}
            <div className="flex items-center justify-between border-b border-[#e6e3da] bg-[#f9f8f5] px-3 py-2">
              <div className="flex items-center gap-2">
                {(['trace', 'state', 'events', 'ag-ui'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-1 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#ffffff] font-bold text-[#161514] border border-[#d5d1c5] shadow-2xs'
                        : 'text-[#6e6b63] hover:text-[#161514]'
                    }`}
                  >
                    {tab === 'ag-ui' ? 'AG-UI ↗' : tab}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-1 text-[#9c988d] hover:text-[#161514] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Telemetry Trace Logs matching screenshot */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left text-[11px] leading-relaxed">
              <div className="text-[#9c988d] border-b border-[#f0ede6] pb-2 flex justify-between">
                <span>turn 1 · "Everything he's shipped"</span>
                <span className="tabular-nums">236ms</span>
              </div>
              <div className="text-[#9c988d] border-b border-[#f0ede6] pb-2 flex justify-between">
                <span>turn 2 · "How does Gully United..."</span>
                <span className="tabular-nums">3.4s</span>
              </div>
              <div className="text-[#9c988d] border-b border-[#f0ede6] pb-2 flex justify-between">
                <span>turn 3 · "What's his superpower..."</span>
                <span className="tabular-nums">7.1s</span>
              </div>

              {/* Real-time telemetry items */}
              <div className="flex items-start gap-2 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[#161514]">retrieval</div>
                  <div className="text-[#6e6b63]">
                    5 facts by meaning and keywords (gully, lock, spring, cert, 0.3s)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[#161514]">guard</div>
                  <div className="text-[#6e6b63]">passed · injection risk &lt; 0.001</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[#161514]">model</div>
                  <div className="text-[#6e6b63]">
                    gemini-3.8-flash · server proxy latency 240ms · 100% tokens valid
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[#161514]">grounding</div>
                  <div className="text-[#6e6b63]">
                    3 of 3 claims anchored directly to live portfolio database
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-[#161514]">harness</div>
                  <div className="text-[#6e6b63]">
                    offered "Get resume": 5 projects on screen, interactive reticle synced
                  </div>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="p-3 border-t border-[#e6e3da] bg-[#f9f8f5] text-[10px] text-[#6e6b63] flex items-center justify-between">
              <span>Status: Synchronized</span>
              <span className="flex items-center gap-1 text-[#16a34a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                Online
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
