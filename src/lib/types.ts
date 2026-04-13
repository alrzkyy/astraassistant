// ============================================
// AstraAssistant — Type Definitions
// ============================================

export type ModelId = 'claude' | 'gpt' | 'blackbox';

export interface AIModel {
  id: ModelId;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  endpoint: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'command';
  content: string;
  model?: ModelId;
  timestamp: number;
  imageUrl?: string;
  commandResult?: CommandResult;
  isError?: boolean;
}

export interface CommandResult {
  type: 'anime' | 'anime-detail' | 'anime-watch' | 'film' | 'help';
  data: AnimeSearchResult[] | AnimeDetailResult | AnimeWatchResult | FilmResult | HelpResult | null;
  error?: string;
}

// --- Otakudesu types ---

export interface AnimeSearchItem {
  title: string;
  genre: string;
  status: string;
  rating: string;
  url: string;
}

export type AnimeSearchResult = AnimeSearchItem;

export interface AnimeEpisodeItem {
  episode: string;
  release: string;
  url: string;
}

export interface AnimeEpisodeGroup {
  name: string;
  lists: AnimeEpisodeItem[];
}

export interface AnimeDetailResult {
  thumbnail: string;
  title: string;
  japanese: string;
  rating: string;
  producer: string;
  type: string;
  status: string;
  episode: string;
  duration: string;
  release: string;
  studio: string;
  genre: string;
  episodes: AnimeEpisodeGroup[];
}

export interface AnimeWatchResult {
  filename: string;
  type: string;
  size: string;
  views: number;
  downloads: number;
  url: string;
  quality: string;
  episodeTitle: string;
}

// --- Film types ---

export interface FilmResult {
  title: string;
  synopsis?: string;
  rating?: string;
  year?: string;
  genre?: string;
  image?: string;
  director?: string;
  [key: string]: unknown;
}

export interface HelpResult {
  commands: { command: string; description: string }[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentModel: ModelId;
  error: string | null;
}

export interface NeoxrResponse {
  creator: string;
  status: boolean;
  data: {
    message?: string;
    [key: string]: unknown;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: ModelId;
  createdAt: number;
  updatedAt: number;
}
