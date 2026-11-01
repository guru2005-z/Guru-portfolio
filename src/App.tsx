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
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string>('');

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
          <EducationSection onOpenCertModal={() => setIsCertModalOpen(true)} />

          {/* 08 Contact */}
          <ContactSection onOpenAgent={() => setCurrentMode('agent')} />
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
        onClose={() => setIsCertModalOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
