// ============================================
// AstraAssistant — Welcome Screen
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { ModelId } from '@/lib/types';
import { modelList } from '@/lib/models';
import ModelIcon from './ModelIcon';
import { t, Language, getStoredLanguage, setStoredLanguage } from '@/lib/i18n';
import SettingsPanel from './SettingsPanel';
import { PersonalityId, getStoredPersonality, setStoredPersonality } from '@/lib/personality';

interface Props {
  onStart: (model: ModelId) => void;
}

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
}

export default function WelcomeScreen({ onStart }: Props) {
  // Generate particles client-side only to avoid hydration mismatch
  const [particles, setParticles] = useState<ParticleStyle[]>([]);
  const [lang, setLang] = useState<Language>('id');
  const [personality, setPersonality] = useState<PersonalityId>('friendly');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setLang(getStoredLanguage());
    setPersonality(getStoredPersonality());
    
    const generated: ParticleStyle[] = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
      width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`,
    }));
    setParticles(generated);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setStoredLanguage(newLang);
  };

  const handlePersonalityChange = (newP: PersonalityId) => {
    setPersonality(newP);
    setStoredPersonality(newP);
  };

  const tr = t(lang);

  return (
    <div className="welcome-screen">
      {/* Animated background particles — rendered client-side only */}
      <div className="particles">
        {particles.map((style, i) => (
          <div key={i} className="particle" style={style} />
        ))}
      </div>

      <div className="welcome-topbar" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button 
          onClick={() => setSettingsOpen(true)}
          style={{ 
            background: 'var(--surface-1)', 
            border: '1px solid var(--border-color)', 
            padding: '8px 16px', 
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          {tr.settings}
        </button>
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={lang}
        personality={personality}
        onLanguageChange={handleLanguageChange}
        onPersonalityChange={handlePersonalityChange}
      />

      <div className="welcome-content">
        {/* Hero */}
        <div className="welcome-hero">
          <div className="hero-icon" style={{ background: 'transparent', boxShadow: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" width="120" height="120" style={{ borderRadius: '20px', objectFit: 'cover' }} />
          </div>
          <h1 className="hero-title">
            <span className="title-gradient">{tr.welcomeTitle}</span>
          </h1>
          <p className="hero-subtitle" style={{ whiteSpace: 'pre-wrap' }}>
            {tr.welcomeSubtitle}
          </p>
        </div>

        {/* Model Cards */}
        <div className="model-cards">
          {modelList.map((model, index) => (
            <button
              key={model.id}
              id={`welcome-model-${model.id}`}
              className="model-card"
              onClick={() => onStart(model.id)}
              style={{
                animationDelay: `${index * 0.15}s`,
                '--model-color': model.color,
                '--model-gradient': model.gradient,
              } as React.CSSProperties}
            >
              <div className="card-glow" />
              <div className="card-content">
                <span className="card-icon"><ModelIcon modelId={model.id} size={32} /></span>
                <h3 className="card-name">{model.name}</h3>
                <p className="card-desc">{model.description}</p>
              </div>
              <div className="card-action">
                <span>{tr.startChat}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="welcome-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Multi-model AI</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎌</span>
            <span className="feature-text">Anime Streaming</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📷</span>
            <span className="feature-text">Image Upload</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span className="feature-text">Real-time Chat</span>
          </div>
        </div>

        <p className="welcome-hint">
          Type <code>!help</code> in chat to see available commands
        </p>
      </div>
    </div>
  );
}
