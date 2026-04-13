// ============================================
// AstraAssistant — AI Model Definitions
// ============================================

import { AIModel, ModelId } from './types';

export const models: Record<ModelId, AIModel> = {
  claude: {
    id: 'claude',
    name: 'Claude 3',
    description: 'Anthropic\'s most capable model — precise, thoughtful, and creative.',
    icon: '🔵',
    color: '#58a6ff',
    gradient: 'linear-gradient(135deg, #2f81f7, #58a6ff)',
    endpoint: 'claude',
  },
  gpt: {
    id: 'gpt',
    name: 'GPT-3',
    description: 'OpenAI\'s versatile model — fast, reliable, and knowledgeable.',
    icon: '🟢',
    color: '#3fb950',
    gradient: 'linear-gradient(135deg, #238636, #3fb950)',
    endpoint: 'gpt-pro',
  },
  blackbox: {
    id: 'blackbox',
    name: 'Blackbox AI',
    description: 'Code-focused AI — optimized for developers and technical tasks.',
    icon: '🟠',
    color: '#f0883e',
    gradient: 'linear-gradient(135deg, #d47616, #f0883e)',
    endpoint: 'blackbox',
  },
};

export const modelList: AIModel[] = Object.values(models);

export const getModel = (id: ModelId): AIModel => models[id];

export const defaultModel: ModelId = 'claude';
