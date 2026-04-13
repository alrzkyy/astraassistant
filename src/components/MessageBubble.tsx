// ============================================
// AstraAssistant — Message Bubble Component
// Shows messages with action buttons
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';
import { modelList } from '@/lib/models';
import CommandResult from './CommandResult';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const [copied, setCopied] = useState(false);

  const model = message.model ? modelList.find(m => m.id === message.model) : null;
  const time = new Date(message.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  // Command result message
  if (message.role === 'command' && message.commandResult) {
    return (
      <div className="message-row command fade-in">
        <div className="message-avatar command-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="message-content">
          <div className="message-bubble command-bubble">
            <CommandResult result={message.commandResult} />
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // User message
  if (message.role === 'user') {
    return (
      <div className="message-row user fade-in">
        <div className="message-avatar user-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="message-content">
          {message.imageUrl && (
            <div className="message-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={message.imageUrl} alt="Uploaded" />
            </div>
          )}
          <div className="message-bubble user-bubble">
            <p>{message.content}</p>
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="message-row assistant fade-in">
      <div
        className="message-avatar"
        style={{ background: model?.gradient || 'var(--gradient-send)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="message-content">
        {model && (
          <span className="message-model-tag" style={{ color: model.color }}>
            {model.name}
          </span>
        )}
        <div className={`message-bubble assistant-bubble ${message.isError ? 'error-bubble' : ''}`}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>

        {/* Action buttons */}
        {!message.isError && (
          <div className="message-actions">
            <button
              className={`msg-action-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
            <button className="msg-action-btn" title="Like">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </button>
            <button className="msg-action-btn" title="Dislike">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
              </svg>
            </button>
          </div>
        )}

        <span className="message-time">{time}</span>
      </div>
    </div>
  );
}
