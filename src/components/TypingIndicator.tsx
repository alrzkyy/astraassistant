// ============================================
// AstraAssistant — Typing Indicator
// ============================================

'use client';

import { ModelId } from '@/lib/types';
import { getModel } from '@/lib/models';

interface Props {
  model: ModelId;
}

export default function TypingIndicator({ model }: Props) {
  const modelInfo = getModel(model);

  return (
    <div className="message-row assistant">
      <div className="message-avatar" style={{ background: modelInfo.gradient }}>
        {modelInfo.icon}
      </div>
      <div className="message-bubble assistant-bubble">
        <div className="typing-indicator">
          <span className="typing-dot" style={{ animationDelay: '0ms' }}></span>
          <span className="typing-dot" style={{ animationDelay: '150ms' }}></span>
          <span className="typing-dot" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}
