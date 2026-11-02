import React, { useState } from 'react';
import { Header } from './components/Header';
import { Ticker } from './components/Ticker';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { EngineeringEfforts } from './components/EngineeringEfforts';
import { WorkSection } from './components/WorkSection';
import { ProjectsSection } from './components/ProjectsSection';
import { PrinciplesSection } from './components/PrinciplesSection';
import { ToolkitSection } from './components/ToolkitSection';
import { EventsSection } from './components/EventsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { AgentView } from './components/AgentView';
import { CertModal } from './components/CertModal';
import { ResumeModal } from './components/ResumeModal';
import { IntroAnimation } from './components/IntroAnimation';
import { ArcadeGameModal } from './components/ArcadeGameModal';
import { GameTheme } from './components/PixelGridCanvas';

import { CursorTrailEffect } from './components/CursorTrailEffect';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'classic' | 'agent'>('classic');
  const [gameTheme, setGameTheme] = useState<GameTheme>('tetris');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<'az900' | 'mlsa' | 'infosys' | 'supraja'>('az900');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string>('');

  const handleOpenCertModal = (certKey?: 'az900' | 'mlsa' | 'infosys' | 'supraja') => {
    if (certKey) setSelectedCert(certKey);
    setIsCertModalOpen(true);
  };

  const handleAskAgentFromProject = (prompt: string) => {
    setAgentInitialPrompt(prompt);
    setCurrentMode('agent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen bg-[#f9f8f5] text-[#161514] font-sans antialiased flex flex-col selection:bg-[#161514] selection:text-white relative">
      {/* Precision Cursor Trail & Click Ripple matching mohammad-rizwan.tech */}
      <CursorTrailEffect />

      {/* Intro Typographic Curtain matching mohammad-rizwan.tech */}
      <IntroAnimation />

      {/* Top Header matching mohammad-rizwan.tech */}
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => setCurrentMode(mode)}
        onOpenArcade={() => setIsArcadeOpen(true)}
        gameTheme={gameTheme}
        onSelectGameTheme={setGameTheme}
      />

      {/* Main Content: Classic Mode or Agent Mode */}
      {currentMode === 'agent' ? (
        <AgentView
          onBackToClassic={() => setCurrentMode('classic')}
          initialPrompt={agentInitialPrompt}
        />
      ) : (
        <main className="flex-1 flex flex-col grid-bg">
          {/* Ticker Tape */}
          <Ticker />

          {/* Hero Section (Contains confined background game canvas matching Image 2) */}
          <Hero
            onOpenAgent={() => setCurrentMode('agent')}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            gameTheme={gameTheme}
            onSelectGameTheme={setGameTheme}
          />

          {/* 01 About (Clean, zero background game clutter, pristine typography & 3D card) */}
          <AboutSection />

          {/* 02 Engineering Efforts (Interactive concurrency lab, webhook idempotency, architecture flow, benchmarks) */}
          <EngineeringEfforts />

          {/* 03 Work */}
          <WorkSection />

          {/* 03 Projects with interactive flowcharts and failure simulations */}
          <ProjectsSection onAskAgent={handleAskAgentFromProject} />

          {/* 04 How I build */}
          <PrinciplesSection />

          {/* 05 Toolkit with dual running marquees */}
          <ToolkitSection />

          {/* 06 Hackathons & Events */}
          <EventsSection />

          {/* 07 Education & Certifications */}
          <EducationSection onOpenCertModal={handleOpenCertModal} />

          {/* 08 Contact */}
          <ContactSection 
            onOpenAgent={() => setCurrentMode('agent')} 
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
          />
        </main>
      )}

      {/* Modals */}
      <ArcadeGameModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        initialGame="snake"
      />

      <CertModal
        isOpen={isCertModalOpen}
        defaultCert={selectedCert}
        onClose={() => setIsCertModalOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* Floating RAG Agent Quick Access Button */}
      {currentMode === 'classic' && (
        <button
          onClick={() => {
            setCurrentMode('agent');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#161514] hover:bg-[#302e2b] text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-[#403e3a] cursor-pointer group hover:scale-105"
          title="Chat with Guravaiah's RAG-grounded AI Agent"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16a34a]" />
          </span>
          <span className="font-mono text-xs font-medium tracking-tight">Ask RAG Agent</span>
          <span className="text-[10px] bg-[#16a34a] text-white px-1.5 py-0.2 rounded font-mono font-bold uppercase">
            Live
          </span>
        </button>
      )}
    </div>
  );
}
