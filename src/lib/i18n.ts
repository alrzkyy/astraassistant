// ============================================
// AstraAssistant — Internationalization
// Supports: Indonesia, English, Japanese
// ============================================

export type Language = 'id' | 'en' | 'ja';

export interface LanguageOption {
  id: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

type TranslationKeys = {
  // Welcome
  welcomeTitle: string;
  welcomeSubtitle: string;
  startChat: string;

  // Chat
  newChat: string;
  recentChats: string;
  noConversations: string;
  noConversationsSub: string;
  typeMessage: string;
  startConversation: string;
  sendOrCommand: string;
  showCommands: string;
  searchAnime: string;
  writePoem: string;
  whatCanYouDo: string;

  // Header
  online: string;

  // Settings
  settings: string;
  language: string;
  personality: string;
  personalityDesc: string;

  // Model
  modelSwitcher: string;

  // Actions
  copy: string;
  copied: string;
  like: string;
  dislike: string;
  download: string;
  openNewTab: string;
  backToSearch: string;
  backToResults: string;
  viewEpisodes: string;
  episodes: string;
  quality: string;
  loading: string;
  error: string;
  noResults: string;
  availableCommands: string;
  animeResults: string;
  filmResult: string;
  nowPlaying: string;

  // Personality names
  personalityFriendly: string;
  personalityProfessional: string;
  personalityCasual: string;
  personalityAnime: string;
};

const translations: Record<Language, TranslationKeys> = {
  id: {
    welcomeTitle: 'AstraAssistant',
    welcomeSubtitle: 'Asisten AI premium kamu — didukung berbagai model bahasa.\nPilih mesin dan mulai eksplorasi.',
    startChat: 'Mulai Chat',
    newChat: 'Chat Baru',
    recentChats: 'Chat Terbaru',
    noConversations: 'Belum ada percakapan',
    noConversationsSub: 'Mulai chat untuk melihat riwayat',
    typeMessage: 'Ketik pesan atau perintah...',
    startConversation: 'Mulai percakapan',
    sendOrCommand: 'Kirim pesan atau coba perintah !help',
    showCommands: 'Lihat perintah',
    searchAnime: 'Cari anime',
    writePoem: 'Tulis puisi',
    whatCanYouDo: 'Apa yang bisa kamu lakukan?',
    online: 'Online',
    settings: 'Pengaturan',
    language: 'Bahasa',
    personality: 'Kepribadian AI',
    personalityDesc: 'Pilih gaya bicara AI',
    modelSwitcher: 'Model AI',
    copy: 'Salin',
    copied: 'Tersalin!',
    like: 'Suka',
    dislike: 'Tidak suka',
    download: 'Unduh',
    openNewTab: 'Buka di tab baru',
    backToSearch: '← Kembali ke pencarian',
    backToResults: '← Kembali ke hasil',
    viewEpisodes: 'Lihat Episode →',
    episodes: 'Episode',
    quality: 'Kualitas',
    loading: 'Memuat...',
    error: 'Kesalahan',
    noResults: 'Tidak ada hasil.',
    availableCommands: 'Perintah Tersedia',
    animeResults: 'Hasil Anime',
    filmResult: 'Hasil Film',
    nowPlaying: 'Sedang Diputar',
    personalityFriendly: 'Ramah & Hangat',
    personalityProfessional: 'Profesional',
    personalityCasual: 'Santai & Gaul',
    personalityAnime: 'Weeb / Otaku',
  },
  en: {
    welcomeTitle: 'AstraAssistant',
    welcomeSubtitle: 'Your premium AI companion — powered by multiple language models.\nChoose your engine and start exploring.',
    startChat: 'Start Chat',
    newChat: 'New Chat',
    recentChats: 'Recent Chats',
    noConversations: 'No conversations yet',
    noConversationsSub: 'Start chatting to see history here',
    typeMessage: 'Type a message or command...',
    startConversation: 'Start a conversation',
    sendOrCommand: 'Send a message or try !help',
    showCommands: 'Show commands',
    searchAnime: 'Search anime',
    writePoem: 'Write a poem',
    whatCanYouDo: 'What can you do?',
    online: 'Online',
    settings: 'Settings',
    language: 'Language',
    personality: 'AI Personality',
    personalityDesc: 'Choose the AI speaking style',
    modelSwitcher: 'AI Model',
    copy: 'Copy',
    copied: 'Copied!',
    like: 'Like',
    dislike: 'Dislike',
    download: 'Download',
    openNewTab: 'Open in new tab',
    backToSearch: '← Back to search',
    backToResults: '← Back to results',
    viewEpisodes: 'View Episodes →',
    episodes: 'Episodes',
    quality: 'Quality',
    loading: 'Loading...',
    error: 'Error',
    noResults: 'No results to display.',
    availableCommands: 'Available Commands',
    animeResults: 'Anime Results',
    filmResult: 'Film Result',
    nowPlaying: 'Now Playing',
    personalityFriendly: 'Friendly & Warm',
    personalityProfessional: 'Professional',
    personalityCasual: 'Casual & Chill',
    personalityAnime: 'Weeb / Otaku',
  },
  ja: {
    welcomeTitle: 'AstraAssistant',
    welcomeSubtitle: 'プレミアムAIアシスタント — 複数のAIモデル搭載。\nエンジンを選んで探索を始めましょう。',
    startChat: 'チャット開始',
    newChat: '新しいチャット',
    recentChats: '最近のチャット',
    noConversations: 'まだ会話がありません',
    noConversationsSub: 'チャットを始めると履歴が表示されます',
    typeMessage: 'メッセージまたはコマンドを入力...',
    startConversation: '会話を始めましょう',
    sendOrCommand: 'メッセージを送るか !help を試してください',
    showCommands: 'コマンド表示',
    searchAnime: 'アニメ検索',
    writePoem: '詩を書く',
    whatCanYouDo: '何ができますか？',
    online: 'オンライン',
    settings: '設定',
    language: '言語',
    personality: 'AIの性格',
    personalityDesc: 'AIの話し方を選択',
    modelSwitcher: 'AIモデル',
    copy: 'コピー',
    copied: 'コピーしました！',
    like: 'いいね',
    dislike: 'よくない',
    download: 'ダウンロード',
    openNewTab: '新しいタブで開く',
    backToSearch: '← 検索に戻る',
    backToResults: '← 結果に戻る',
    viewEpisodes: 'エピソード一覧 →',
    episodes: 'エピソード',
    quality: '画質',
    loading: '読み込み中...',
    error: 'エラー',
    noResults: '表示する結果がありません。',
    availableCommands: '利用可能なコマンド',
    animeResults: 'アニメ検索結果',
    filmResult: '映画検索結果',
    nowPlaying: '再生中',
    personalityFriendly: 'フレンドリー',
    personalityProfessional: 'プロフェッショナル',
    personalityCasual: 'カジュアル',
    personalityAnime: 'オタク / ウィーブ',
  },
};

export function t(lang: Language): TranslationKeys {
  return translations[lang] || translations.en;
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'id';
  return (localStorage.getItem('astra_language') as Language) || 'id';
}

export function setStoredLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('astra_language', lang);
  }
}
