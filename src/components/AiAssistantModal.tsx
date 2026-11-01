import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ArrowRight, 
  Mail, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am Guru AI, Guravaiah Katta's technical representative. Ask me anything about Guravaiah's engineering background, his freelance cricket booking platform 'Gully United', technical skills in Spring Boot and React, or explore hiring him for your team!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Tell me about the Gully United cricket platform",
    "What are Guravaiah's key backend & Spring Boot skills?",
    "Is he available for an engineering internship or freelance?",
    "What did he build for the Cybersecurity Hackathon?"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: newMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          }))
        })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.reply || "Guravaiah is ready to contribute to your engineering team. Contact him at kattaguravaiah00@gmail.com!"
      }]);
    } catch {
      // Offline fallback
      let fallback = "Guravaiah Katta is a Full-Stack Software Engineer specializing in Java, Spring Boot, React, and PostgreSQL. You can email him at kattaguravaiah00@gmail.com or explore his live freelance project Gully United at https://gully-united-xlv.vercel.app/!";
      
      const lower = text.toLowerCase();
      if (lower.includes('gully') || lower.includes('cricket') || lower.includes('freelance')) {
        fallback = "Guravaiah engineered 'Gully United' (live at https://gully-united-xlv.vercel.app/), a commercial sports booking platform. He implemented transactional double-booking prevention, Razorpay payments, QR ticket verification, and Google Maps venue navigation with Spring Boot & React.";
      } else if (lower.includes('azure') || lower.includes('cert')) {
        fallback = "Guravaiah holds the official Microsoft Certified: Azure Fundamentals (AZ-900) certification (Credential ID: 5B48115BB42E21FC) and the Kaggle GenAI 2025 Agents Intensive Capstone.";
      } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email')) {
        fallback = "You can contact Guravaiah directly at kattaguravaiah00@gmail.com or call +91-9491501919. He is actively interviewing for software engineering roles and freelance contracts!";
      }

      setMessages([...newMessages, { role: 'assistant', content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation reset. How can I help you learn more about Guravaiah Katta's software engineering background?"
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] rounded-2xl border border-[#2b2b2b] bg-[#0d0d0d] shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#222222] bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D41514]/15 border border-[#D41514]/40 flex items-center justify-center text-[#D41514]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                  Guru AI Representative
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#1c1c1c] text-[#D41514] border border-[#D41514]/30">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs font-mono text-[#8E8D8C]">
                Trained on Guravaiah's Resume, Architecture Specs & Projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-[#262626] bg-[#141414] text-[#8E8D8C] hover:text-white"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#262626] bg-[#141414] text-[#8E8D8C] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-[#222] text-white border border-[#333]'
                    : 'bg-[#181010] text-[#D41514] border border-[#D41514]/40'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-[#1a1a1a] border border-[#2e2e2e] text-white rounded-tr-none'
                    : 'bg-[#141414] border border-[#242424] text-[#CDCBCA] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#181010] text-[#D41514] border border-[#D41514]/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#141414] border border-[#242424] text-xs font-mono text-[#8E8D8C] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D41514] animate-ping" />
                <span>Guru AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 border-t border-[#1c1c1c] bg-[#101010] flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#181818] border border-[#282828] text-[#CDCBCA] hover:border-[#D41514] hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#222222] bg-[#111111]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Guravaiah's projects, experience, or hire him..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#161616] border border-[#262626] focus:border-[#D41514] rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-[#555] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#D41514] hover:bg-[#b0100f] disabled:opacity-40 text-white font-mono text-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
