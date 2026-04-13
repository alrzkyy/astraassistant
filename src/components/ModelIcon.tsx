// ============================================
// AstraAssistant — Model Icon Component
// Custom SVG icons for each AI model
// ============================================

'use client';

import { ModelId } from '@/lib/types';

interface Props {
  modelId: ModelId;
  size?: number;
  className?: string;
}

export default function ModelIcon({ modelId, size = 20, className = '' }: Props) {
  switch (modelId) {
    case 'claude':
      // Claude - Brain/Neural icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="10" stroke="#58a6ff" strokeWidth="1.5" fill="rgba(88,166,255,0.1)" />
          <path d="M12 6C9.24 6 7 8.24 7 11c0 1.64.8 3.1 2.03 4.01L8.5 18h7l-.53-2.99A5.005 5.005 0 0017 11c0-2.76-2.24-5-5-5z" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18v1a2 2 0 004 0v-1" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="11" r="1" fill="#58a6ff" />
          <circle cx="14" cy="11" r="1" fill="#58a6ff" />
        </svg>
      );
    case 'gpt':
      // GPT - Hexagonal/Spark icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#3fb950" strokeWidth="1.5" fill="rgba(63,185,80,0.1)" strokeLinejoin="round" />
          <path d="M12 8v8" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 10l4 2 4-2" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14l4-2 4 2" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" fill="#3fb950" opacity="0.6" />
        </svg>
      );
    case 'blackbox':
      // Blackbox - Terminal/Code icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="#f0883e" strokeWidth="1.5" fill="rgba(240,136,62,0.1)" />
          <path d="M7 9l3 3-3 3" stroke="#f0883e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 15h4" stroke="#f0883e" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7" cy="7" r="1" fill="#f0883e" opacity="0.5" />
          <circle cx="10" cy="7" r="1" fill="#f0883e" opacity="0.5" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="10" stroke="#8b949e" strokeWidth="1.5" />
          <path d="M8 12h8M12 8v8" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
