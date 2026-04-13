// ============================================
// AstraAssistant — Chat Interface Component
// ============================================

'use client';

import { useState, useRef, useCallback } from 'react';
import { ModelId } from '@/lib/types';
import { t } from '@/lib/i18n';
import { useChat } from '@/hooks/useChat';
import Sidebar from './Sidebar';
import ModelSwitcher from './ModelSwitcher';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ImageUpload from './ImageUpload';
import SettingsPanel from './SettingsPanel';

interface Props {
  initialModel: ModelId;
}

export default function ChatInterface({ initialModel }: Props) {
  const {
    messages,
    isLoading,
    currentModel,
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
  } = useChat(initialModel);

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tr = t(language);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text && !pendingImage) return;
    if (isLoading) return;

    sendMessage(text || 'Analyze this image', pendingImage || undefined);
    setInput('');
    setPendingImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, pendingImage, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, []);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setPendingImage(imageUrl);
  }, []);

  return (
    <div className="chat-layout">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={loadConversation}
        onDelete={deleteConversation}
        onNew={newConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={language}
        personality={personality}
        onLanguageChange={setLanguage}
        onPersonalityChange={setPersonality}
      />

      <main className="chat-main">
        {/* Header */}
        <header className="chat-header" id="chat-header">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            id="sidebar-toggle"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <ModelSwitcher currentModel={currentModel} onModelChange={setModel} />

          <div className="header-model-indicator">
            <span className="header-dot"></span>
            <span className="header-status">{tr.online}</span>
          </div>

          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={() => setSettingsOpen(true)}
              title={tr.settings}
              id="settings-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
            <button
              className="icon-btn"
              onClick={newConversation}
              title={tr.newChat}
              id="new-chat-header"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="chat-messages" id="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat">
              <div className="empty-chat-glow"></div>
              <div className="empty-chat-icon">✦</div>
              <h2>{tr.startConversation}</h2>
              <p>{tr.sendOrCommand}</p>
              <div className="quick-prompts">
                <button className="quick-prompt" onClick={() => setInput(tr.whatCanYouDo)}>
                  <span className="qp-icon">💬</span>
                  <span>{tr.whatCanYouDo}</span>
                </button>
                <button className="quick-prompt" onClick={() => setInput('!help')}>
                  <span className="qp-icon">📖</span>
                  <span>{tr.showCommands}</span>
                </button>
                <button className="quick-prompt" onClick={() => setInput('!anime naruto')}>
                  <span className="qp-icon">🎌</span>
                  <span>{tr.searchAnime}</span>
                </button>
                <button className="quick-prompt" onClick={() => setInput(tr.writePoem)}>
                  <span className="qp-icon">✨</span>
                  <span>{tr.writePoem}</span>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator model={currentModel} />}

          <div ref={messagesEndRef} />
        </div>

        {/* Pending image preview */}
        {pendingImage && (
          <div className="pending-image-bar">
            <div className="pending-image-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingImage} alt="Pending upload" />
              <button className="pending-image-remove" onClick={() => setPendingImage(null)}>✕</button>
            </div>
            <span className="pending-label">Image attached</span>
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-bar" id="chat-input-bar">
          <div className="input-container">
            <ImageUpload onUpload={handleImageUpload} disabled={isLoading} />

            <textarea
              ref={textareaRef}
              id="chat-input"
              className="chat-textarea"
              placeholder={tr.typeMessage}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />

            <button
              id="send-btn"
              className={`send-btn ${(input.trim() || pendingImage) && !isLoading ? 'active' : ''}`}
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !pendingImage)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
