// ============================================
// AstraAssistant — useChat Hook
// Central chat state management
// ============================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ModelId, ChatState, Conversation } from '@/lib/types';
import { defaultModel } from '@/lib/models';
import { parseCommand, executeCommand, getHelpResult } from '@/lib/commands';
import { Language, getStoredLanguage, setStoredLanguage } from '@/lib/i18n';
import { PersonalityId, getStoredPersonality, setStoredPersonality, buildSystemPrompt } from '@/lib/personality';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const STORAGE_KEY = 'astra_conversations';
const ACTIVE_KEY = 'astra_active_conversation';

function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable
  }
}

export function useChat(initialModel?: ModelId) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentModel: initialModel || defaultModel,
    error: null,
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [language, setLanguageState] = useState<Language>('id');
  const [personality, setPersonalityState] = useState<PersonalityId>('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    const activeId = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_KEY) : null;
    if (activeId && loaded.find(c => c.id === activeId)) {
      const conv = loaded.find(c => c.id === activeId)!;
      setActiveConversationId(activeId);
      setState(prev => ({ ...prev, messages: conv.messages, currentModel: conv.model }));
    }

    // Load language + personality
    setLanguageState(getStoredLanguage());
    setPersonalityState(getStoredPersonality());
  }, []);

  // Save conversations when they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  const setPersonality = useCallback((p: PersonalityId) => {
    setPersonalityState(p);
    setStoredPersonality(p);
  }, []);

  const updateConversation = useCallback((messages: Message[], model: ModelId, convId: string | null) => {
    if (!convId) return;
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === convId
          ? { ...c, messages, model, updatedAt: Date.now(), title: messages[0]?.content.slice(0, 40) || 'New Chat' }
          : c
      );
      return updated;
    });
  }, []);

  const setModel = useCallback((model: ModelId) => {
    setState(prev => ({ ...prev, currentModel: model }));
  }, []);

  const newConversation = useCallback(() => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: 'New Chat',
      messages: [],
      model: state.currentModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(id);
    if (typeof window !== 'undefined') localStorage.setItem(ACTIVE_KEY, id);
    setState(prev => ({ ...prev, messages: [], error: null }));
    return id;
  }, [state.currentModel]);

  const loadConversation = useCallback((id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      if (typeof window !== 'undefined') localStorage.setItem(ACTIVE_KEY, id);
      setState(prev => ({
        ...prev,
        messages: conv.messages,
        currentModel: conv.model,
        error: null,
      }));
    }
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setState(prev => ({ ...prev, messages: [], error: null }));
      if (typeof window !== 'undefined') localStorage.removeItem(ACTIVE_KEY);
    }
  }, [activeConversationId]);

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    let convId = activeConversationId;

    // Auto-create conversation if none active
    if (!convId) {
      const id = generateId();
      const conv: Conversation = {
        id,
        title: content.slice(0, 40),
        messages: [],
        model: state.currentModel,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations(prev => [conv, ...prev]);
      setActiveConversationId(id);
      if (typeof window !== 'undefined') localStorage.setItem(ACTIVE_KEY, id);
      convId = id;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      imageUrl,
    };

    const newMessages = [...state.messages, userMessage];
    setState(prev => ({ ...prev, messages: newMessages, isLoading: true, error: null }));

    // Check for commands
    const parsed = parseCommand(content);
    if (parsed) {
      try {
        const result = parsed.command === '!help'
          ? getHelpResult()
          : await executeCommand(parsed.command, parsed.args);

        const commandMessage: Message = {
          id: generateId(),
          role: 'command',
          content: parsed.command === '!help' ? 'Available Commands' : `Results for "${parsed.args}"`,
          timestamp: Date.now(),
          commandResult: result,
        };

        const finalMessages = [...newMessages, commandMessage];
        setState(prev => ({ ...prev, messages: finalMessages, isLoading: false }));
        updateConversation(finalMessages, state.currentModel, convId);
      } catch {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Command execution failed',
        }));
      }
      return;
    }

    // Regular chat message — include personality system prompt
    try {
      const queryText = imageUrl
        ? `[User uploaded an image] ${content || 'Please analyze this image.'}`
        : content;

      const systemPrompt = buildSystemPrompt(personality, language);

      const res = await fetch(
        `/api/chat?q=${encodeURIComponent(queryText)}&model=${state.currentModel}&system=${encodeURIComponent(systemPrompt)}`
      );
      const data = await res.json();

      if (data.error) {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.error,
          model: state.currentModel,
          timestamp: Date.now(),
          isError: true,
        };
        const finalMessages = [...newMessages, errorMessage];
        setState(prev => ({
          ...prev,
          messages: finalMessages,
          isLoading: false,
          error: data.error,
        }));
        updateConversation(finalMessages, state.currentModel, convId);
        return;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message || 'No response received.',
        model: state.currentModel,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setState(prev => ({
        ...prev,
        messages: finalMessages,
        isLoading: false,
      }));
      updateConversation(finalMessages, state.currentModel, convId);
    } catch {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
        model: state.currentModel,
        timestamp: Date.now(),
        isError: true,
      };
      const finalMessages = [...newMessages, errorMessage];
      setState(prev => ({
        ...prev,
        messages: finalMessages,
        isLoading: false,
        error: 'Network error',
      }));
      updateConversation(finalMessages, state.currentModel, convId);
    }
  }, [state.messages, state.currentModel, activeConversationId, updateConversation, personality, language]);

  return {
    ...state,
    conversations,
    activeConversationId,
    messagesEndRef,
    language,
    personality,
    sendMessage,
    setModel,
    setLanguage,
    setPersonality,
    newConversation,
    loadConversation,
    deleteConversation,
  };
}
