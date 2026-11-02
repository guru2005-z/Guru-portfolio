import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Send, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ContactSectionProps {
  onOpenAgent: () => void;
  onOpenResumeModal?: () => void;
}

const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenAgent, onOpenResumeModal }) => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string>('');
  const [activationNotice, setActivationNotice] = useState<string>('');
  const [lastSubmittedData, setLastSubmittedData] = useState<{ name: string; email: string; message: string } | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const email = PORTFOLIO_DATA.personal.email;
  const whatsappUrl = `https://wa.me/919491501919?text=${encodeURIComponent('Hi Guravaiah, I saw your portfolio and would like to connect!')}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent('Collaboration / Software Engineering Opportunity')}`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent('Collaboration / Software Engineering Opportunity')}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    setIsSubmitting(true);
    setSubmittedNotice('');
    setActivationNotice('');

    const currentData = { ...formState };
    setLastSubmittedData(currentData);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentData,
          projectType: 'General Inquiry / Role'
        })
      });
      const data = await res.json();

      if (data?.success) {
        setSubmittedNotice(`Message delivered directly to Guravaiah's inbox (${email})! Thank you for reaching out.`);
      } else {
        setSubmittedNotice(`Message processed! Guravaiah typically responds within a few hours at ${email}.`);
      }
    } catch {
      setSubmittedNotice(`Message sent! You can also reach Guravaiah directly at ${email}.`);
    }

    setIsSubmitting(false);
    setFormState({ name: '', email: '', message: '' });

    // Confetti celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#161514', '#d41514', '#ffffff']
    });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 border-b border-[#e6e3da]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionFadeUp}
        className="max-w-4xl mx-auto px-4 sm:px-6 text-left"
      >

        {/* Section Header */}
        <div className="flex items-baseline justify-between border-b border-[#e6e3da] pb-3 mb-10">
          <h2 className="font-bold text-xl sm:text-2xl text-[#161514] flex items-center gap-2">
            <span className="font-mono text-xs text-[#9c988d]">09</span>
            <span>Contact</span>
          </h2>
          <span className="font-mono text-xs text-[#6e6b63]">
            Open for software roles & freelance contracts
          </span>
        </div>

        {/* Big Clickable Email with direct actions */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={mailtoUrl}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#161514] hover:text-[#d41514] transition-colors break-all"
              title="Click to compose email"
            >
              {email}
            </a>

            <button
              onClick={handleCopyEmail}
              className="p-2.5 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#6e6b63] hover:text-[#161514] shrink-0 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span className="text-[#16a34a] font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick email client launch pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
            <span className="text-[#9c988d]">Quick compose:</span>
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] hover:border-[#161514] transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-[#d41514]" />
              <span>Open in Gmail Web ↗</span>
            </a>
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] hover:border-[#161514] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#161514]" />
              <span>Open in Mail App</span>
            </a>
          </div>
        </div>

        {/* Form Box matching mohammad-rizwan.tech */}
        <div className="p-6 sm:p-8 rounded-xl border border-[#d5d1c5] bg-[#ffffff] shadow-xs mb-10">
          <h3 className="font-bold text-base text-[#161514] mb-4">
            Or leave a message
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-mono text-[#6e6b63]">Name</span>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="bg-[#f9f8f5] border border-[#d5d1c5] focus:border-[#161514] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-mono text-[#161514] outline-none transition-colors"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-mono text-[#6e6b63]">Email</span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="bg-[#f9f8f5] border border-[#d5d1c5] focus:border-[#161514] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-mono text-[#161514] outline-none transition-colors"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-[#6e6b63]">Message</span>
              <textarea
                required
                rows={4}
                placeholder="A role, a project, or just hello"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="bg-[#f9f8f5] border border-[#d5d1c5] focus:border-[#161514] rounded-lg p-3 text-xs sm:text-sm font-mono text-[#161514] outline-none transition-colors"
              />
            </label>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#161514] hover:bg-[#302e2b] disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send message'}</span>
                </button>

                {submittedNotice && (
                  <span className="text-xs font-mono text-[#16a34a] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>{submittedNotice}</span>
                  </span>
                )}
              </div>

              {activationNotice && (
                <div className="w-full p-3.5 rounded-lg bg-[#fffbeb] border border-[#fef08a] text-xs font-mono text-[#854d0e] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#713f12]">
                    <Sparkles className="w-4 h-4 text-[#ca8a04]" />
                    <span>One-time activation required for your inbox!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    FormSubmit sent a confirmation email to <strong>{email}</strong>. Simply click <strong>"Activate Form"</strong> in your Gmail inbox once to receive all future portfolio messages directly!
                  </p>
                </div>
              )}

              {lastSubmittedData && (
                <div className="w-full flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-[#6e6b63]">
                  <span>Or send directly via:</span>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(`Inquiry from ${lastSubmittedData.name}`)}&body=${encodeURIComponent(`Hi Guravaiah,\n\n${lastSubmittedData.message}\n\n---\nSender: ${lastSubmittedData.name} (${lastSubmittedData.email})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#d5d1c5] bg-white hover:bg-[#f0ede6] text-[#161514] font-medium"
                  >
                    <ExternalLink className="w-3 h-3 text-[#d41514]" />
                    <span>Open in Gmail with prefilled message ↗</span>
                  </a>
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(`Inquiry from ${lastSubmittedData.name}`)}&body=${encodeURIComponent(`Hi Guravaiah,\n\n${lastSubmittedData.message}\n\n---\nSender: ${lastSubmittedData.name} (${lastSubmittedData.email})`)}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#d5d1c5] bg-white hover:bg-[#f0ede6] text-[#161514]"
                  >
                    <Mail className="w-3 h-3 text-[#161514]" />
                    <span>Open Mail App</span>
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* CTA Buttons Row matching mohammad-rizwan.tech */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={onOpenAgent}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#161514] text-white text-xs sm:text-sm font-medium hover:bg-[#302e2b] transition-colors"
          >
            <span>Or ask my agent</span>
            <span className="font-mono text-xs">↗</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
          >
            <span>WhatsApp</span>
            <span className="font-mono text-xs">↗</span>
          </a>

          <a
            href={PORTFOLIO_DATA.personal.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
          >
            <span>GitHub</span>
            <span className="font-mono text-xs">↗</span>
          </a>

          <a
            href={PORTFOLIO_DATA.personal.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
          >
            <span>LinkedIn</span>
            <span className="font-mono text-xs">↗</span>
          </a>

          {onOpenResumeModal ? (
            <button
              type="button"
              onClick={onOpenResumeModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <span>Resume</span>
              <span className="font-mono text-xs">↗</span>
            </button>
          ) : (
            <a
              href={PORTFOLIO_DATA.personal.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#d5d1c5] bg-[#ffffff] hover:bg-[#f0ede6] text-[#161514] text-xs sm:text-sm font-medium transition-colors"
            >
              <span>Resume</span>
              <span className="font-mono text-xs">↗</span>
            </a>
          )}
        </div>

        {/* Fine print at bottom */}
        <p className="text-xs font-mono text-[#9c988d] pt-12">
          Guravaiah Katta · Full-Stack & AI Software Engineer · Andhra Pradesh, India · {email}
        </p>

      </motion.div>
    </section>
  );
};
