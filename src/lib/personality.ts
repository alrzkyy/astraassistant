// ============================================
// AstraAssistant — AI Personality System
// System prompts that shape AI behavior
// ============================================

import { Language } from './i18n';

export type PersonalityId = 'friendly' | 'professional' | 'casual' | 'anime';

export interface PersonalityOption {
  id: PersonalityId;
  icon: string;
}

export const personalities: PersonalityOption[] = [
  { id: 'friendly', icon: '😊' },
  { id: 'professional', icon: '💼' },
  { id: 'casual', icon: '😎' },
  { id: 'anime', icon: '🎌' },
];

const languageInstruction: Record<Language, string> = {
  id: 'Use Bahasa Indonesia.',
  en: 'Use English.',
  ja: 'Use Japanese.',
};

const personalityPrompts: Record<PersonalityId, string> = {
  friendly: 'Act as a warm & friendly assistant. Use emoji 😊.',
  professional: 'Act as a strictly formal & professional assistant. No emoji.',
  casual: 'Act as a chill best friend. Use casual slang 😎.',
  anime: 'Act as an Otaku. Use Japanese words like "Senpai" and "Sugoi" 🎌.',
};

export function buildSystemPrompt(personality: PersonalityId, language: Language): string {
  return `[${personalityPrompts[personality]} ${languageInstruction[language]}]`;
}

export function getStoredPersonality(): PersonalityId {
  if (typeof window === 'undefined') return 'friendly';
  return (localStorage.getItem('astra_personality') as PersonalityId) || 'friendly';
}

export function setStoredPersonality(p: PersonalityId) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('astra_personality', p);
  }
}
