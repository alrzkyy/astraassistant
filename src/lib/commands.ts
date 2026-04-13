// ============================================
// AstraAssistant — Command Parser
// ============================================

import { CommandResult, HelpResult } from './types';

interface ParsedCommand {
  command: string;
  args: string;
}

const COMMANDS = ['!anime', '!film', '!help'];

export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('!')) return null;

  const spaceIndex = trimmed.indexOf(' ');
  const command = spaceIndex === -1 ? trimmed.toLowerCase() : trimmed.slice(0, spaceIndex).toLowerCase();
  const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1).trim();

  if (!COMMANDS.includes(command)) return null;

  return { command, args };
}

export function getHelpResult(): CommandResult {
  const data: HelpResult = {
    commands: [
      { command: '!anime <title>', description: 'Search anime from Otakudesu — browse episodes & watch' },
      { command: '!film <title>', description: 'Search for movie/film information' },
      { command: '!help', description: 'Show this help message' },
    ],
  };
  return { type: 'help', data };
}

export async function executeCommand(command: string, args: string): Promise<CommandResult> {
  if (command === '!help') {
    return getHelpResult();
  }

  if (command === '!anime') {
    if (!args) {
      return { type: 'anime', data: null, error: 'Please provide a search query. Usage: !anime <title>' };
    }

    try {
      const res = await fetch(`/api/anime?q=${encodeURIComponent(args)}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        return { type: 'anime', data: null, error: json.error || 'Search failed' };
      }

      if (!json.data || json.data.length === 0) {
        return { type: 'anime', data: null, error: `No results found for "${args}"` };
      }

      return { type: 'anime', data: json.data };
    } catch {
      return { type: 'anime', data: null, error: 'Failed to search anime. Please try again.' };
    }
  }

  if (command === '!film') {
    if (!args) {
      return { type: 'film', data: null, error: 'Please provide a search query. Usage: !film <title>' };
    }

    try {
      const res = await fetch(`/api/film?q=${encodeURIComponent(args)}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        return { type: 'film', data: null, error: json.error || 'Search failed' };
      }

      return { type: 'film', data: json.data };
    } catch {
      return { type: 'film', data: null, error: 'Failed to fetch results. Please try again.' };
    }
  }

  return { type: 'help', data: null, error: 'Unknown command' };
}

// Additional async functions for anime detail flow
export async function fetchAnimeDetail(animeUrl: string) {
  const res = await fetch(`/api/anime-detail?url=${encodeURIComponent(animeUrl)}`);
  return res.json();
}

export async function fetchAnimeWatch(episodeUrl: string, quality: string = '720p') {
  const res = await fetch(`/api/anime-watch?url=${encodeURIComponent(episodeUrl)}&quality=${encodeURIComponent(quality)}`);
  return res.json();
}
