// ============================================
// AstraAssistant — Settings Panel
// Language selector + AI Personality
// ============================================

'use client';

import { Language, languages, t } from '@/lib/i18n';
import { PersonalityId, personalities } from '@/lib/personality';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  personality: PersonalityId;
  onLanguageChange: (lang: Language) => void;
  onPersonalityChange: (p: PersonalityId) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  language,
  personality,
  onLanguageChange,
  onPersonalityChange,
}: Props) {
  if (!isOpen) return null;

  const tr = t(language);

  const personalityNames: Record<PersonalityId, string> = {
    friendly: tr.personalityFriendly,
    professional: tr.personalityProfessional,
    casual: tr.personalityCasual,
    anime: tr.personalityAnime,
  };

  return (
    <>
      <div className="settings-backdrop" onClick={onClose} />
      <div className="settings-panel">
        <div className="settings-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            {tr.settings}
          </h3>
          <button className="settings-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Language */}
        <div className="settings-section">
          <label className="settings-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            {tr.language}
          </label>
          <div className="settings-options">
            {languages.map(lang => (
              <button
                key={lang.id}
                className={`settings-option ${language === lang.id ? 'active' : ''}`}
                onClick={() => onLanguageChange(lang.id)}
              >
                <span className="option-flag">{lang.flag}</span>
                <div className="option-info">
                  <span className="option-name">{lang.nativeName}</span>
                  <span className="option-sub">{lang.name}</span>
                </div>
                {language === lang.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div className="settings-section">
          <label className="settings-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {tr.personality}
          </label>
          <p className="settings-desc">{tr.personalityDesc}</p>
          <div className="settings-options">
            {personalities.map(p => (
              <button
                key={p.id}
                className={`settings-option ${personality === p.id ? 'active' : ''}`}
                onClick={() => onPersonalityChange(p.id)}
              >
                <span className="option-flag">{p.icon}</span>
                <div className="option-info">
                  <span className="option-name">{personalityNames[p.id]}</span>
                </div>
                {personality === p.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
