// ============================================
// AstraAssistant — Model Switcher Component
// ============================================

'use client';

import { useState } from 'react';
import { ModelId } from '@/lib/types';
import { modelList, getModel } from '@/lib/models';
import ModelIcon from './ModelIcon';

interface Props {
  currentModel: ModelId;
  onModelChange: (model: ModelId) => void;
}

export default function ModelSwitcher({ currentModel, onModelChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const current = getModel(currentModel);

  return (
    <div className="model-switcher">
      <button
        id="model-switcher-btn"
        className="model-current"
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderColor: current.color + '40' }}
      >
        <span className="model-icon"><ModelIcon modelId={current.id} size={18} /></span>
        <span className="model-name">{current.name}</span>
        <svg
          className={`model-chevron ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="model-backdrop" onClick={() => setIsOpen(false)} />
          <div className="model-dropdown">
            {modelList.map((model) => (
              <button
                key={model.id}
                id={`model-option-${model.id}`}
                className={`model-option ${model.id === currentModel ? 'active' : ''}`}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
              >
                <span className="model-option-icon">
                  <ModelIcon modelId={model.id} size={24} />
                </span>
                <div className="model-option-info">
                  <span className="model-option-name">{model.name}</span>
                  <span className="model-option-desc">{model.description}</span>
                </div>
                {model.id === currentModel && (
                  <span className="model-check">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                     </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
