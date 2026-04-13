// ============================================
// AstraAssistant — Main Page (SPA)
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { ModelId } from '@/lib/types';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [started, setStarted] = useState(false);
  const [initialModel, setInitialModel] = useState<ModelId>('claude');

  const handleStart = useCallback((model: ModelId) => {
    setInitialModel(model);
    setStarted(true);
  }, []);

  if (!started) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return <ChatInterface initialModel={initialModel} />;
}
