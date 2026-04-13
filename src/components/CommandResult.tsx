// ============================================
// AstraAssistant — Command Result Card
// Anime viewer with video player, episode list,
// quality switcher, and Mega/Pixeldrain support
// ============================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  CommandResult as CommandResultType,
  HelpResult,
  AnimeSearchItem,
  AnimeDetailResult,
  AnimeWatchResult,
  AnimeEpisodeItem,
  FilmResult,
} from '@/lib/types';
import { fetchAnimeDetail, fetchAnimeWatch } from '@/lib/commands';

interface Props {
  result: CommandResultType;
}

// Stream video through our proxy to bypass CORS
// Our /api/stream route fetches from pixeldrain and pipes it
function getProxyStreamUrl(url: string): string {
  return `/api/stream?url=${encodeURIComponent(url)}`;
}

// ========================
// ANIME DETAIL VIEWER
// ========================
function AnimeDetailViewer({ animeUrl, onBack }: { animeUrl: string; onBack: () => void }) {
  const [detail, setDetail] = useState<AnimeDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<AnimeEpisodeItem | null>(null);
  const [watchData, setWatchData] = useState<AnimeWatchResult | null>(null);
  const [watchLoading, setWatchLoading] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetchAnimeDetail(animeUrl);
        if (cancelled) return;
        if (res.status && res.data) {
          setDetail(res.data);
        } else {
          setError(res.error || res.msg || 'Failed to load anime details');
        }
      } catch {
        if (!cancelled) setError('Network error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [animeUrl]);

  const handleWatchEpisode = useCallback(async (ep: AnimeEpisodeItem, q: string) => {
    setSelectedEpisode(ep);
    setWatchLoading(true);
    setWatchData(null);
    setShowPlayer(false);
    setError(null);

    try {
      const res = await fetchAnimeWatch(ep.url, q);
      if (res.status && res.data) {
        setWatchData({ ...res.data, quality: q, episodeTitle: ep.episode });
        setShowPlayer(true);
      } else {
        setError(res.error || res.msg || `Quality ${q} not available. Try another.`);
      }
    } catch {
      setError('Failed to load episode');
    } finally {
      setWatchLoading(false);
    }
  }, []);

  const handleQualityChange = useCallback((newQuality: string) => {
    setQuality(newQuality);
    if (selectedEpisode) {
      handleWatchEpisode(selectedEpisode, newQuality);
    }
  }, [selectedEpisode, handleWatchEpisode]);

  if (loading) {
    return (
      <div className="command-card anime-loading">
        <div className="anime-loader">
          <span className="loader-icon">🎌</span>
          <p>Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="command-card command-error">
        <div className="command-card-header">
          <span className="command-icon">⚠️</span>
          <span className="command-title">Error</span>
        </div>
        <p className="command-text">{error}</p>
        <button className="anime-back-btn" onClick={onBack}>← Back to results</button>
      </div>
    );
  }

  if (!detail) return null;

  // Get individual episode list (skip batch groups)
  const episodeGroup = detail.episodes.find(g =>
    g.lists.length > 1 && (g.name.toLowerCase().includes('episode list') || g.name.toLowerCase().includes('link download episode'))
  ) || detail.episodes.find(g => g.lists.length > 0);

  return (
    <div className="command-card anime-detail-card">
      {/* Header with thumbnail */}
      <div className="anime-detail-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={detail.thumbnail} alt={detail.title} className="anime-detail-thumb" />
        <div className="anime-detail-info">
          <h3 className="anime-detail-title">{detail.title}</h3>
          {detail.japanese && <p className="anime-detail-jp">{detail.japanese}</p>}
          <div className="anime-detail-badges">
            <span className="command-badge">⭐ {detail.rating}</span>
            <span className="command-badge">📺 {detail.episode} eps</span>
            <span className="command-badge badge-status">{detail.status}</span>
            <span className="command-badge">🎬 {detail.studio}</span>
          </div>
          <p className="anime-detail-meta">{detail.genre}</p>
          <p className="anime-detail-meta">{detail.duration} • {detail.release} • {detail.type}</p>
        </div>
      </div>

      <button className="anime-back-btn" onClick={onBack}>← Back to search</button>

      {/* Video Player */}
      {showPlayer && watchData && (
        <div className="anime-player-section">
          <div className="anime-player-header">
            <h4>▶ {watchData.episodeTitle?.replace(/subtitle indonesia/gi, '').trim() || 'Now Playing'}</h4>
            <span className="anime-file-info">
              {watchData.filename} • {watchData.size} • {watchData.quality}
            </span>
          </div>

          <div className="anime-player-frame">
            <video
              src={getProxyStreamUrl(watchData.url)}
              controls
              autoPlay
              playsInline
              className="anime-video"
            >
              Your browser does not support video playback.
            </video>
          </div>

          <div className="anime-player-actions">
            <a
              href={watchData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-download-btn"
            >
              ⬇️ Download ({watchData.quality})
            </a>
            <a
              href={watchData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-open-btn"
            >
              🔗 Open in new tab
            </a>
          </div>
        </div>
      )}

      {/* Quality selector */}
      <div className="anime-quality-bar">
        <span className="quality-label">Quality:</span>
        {['360p', '480p', '720p', '1080p'].map(q => (
          <button
            key={q}
            className={`quality-btn ${quality === q ? 'active' : ''}`}
            onClick={() => handleQualityChange(q)}
            disabled={watchLoading}
          >
            {q}
          </button>
        ))}
      </div>

      {watchLoading && (
        <div className="anime-loader small">
          <span className="loader-icon">⏳</span>
          <p>Loading {quality}...</p>
        </div>
      )}

      {error && detail && (
        <div className="anime-inline-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Episode list */}
      {episodeGroup && episodeGroup.lists.length > 0 && (
        <div className="anime-episodes">
          <h4 className="episodes-title">📋 Episodes ({episodeGroup.lists.length})</h4>
          <div className="episodes-grid">
            {episodeGroup.lists.map((ep, i) => {
              const isActive = selectedEpisode?.url === ep.url;
              return (
                <button
                  key={i}
                  className={`episode-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleWatchEpisode(ep, quality)}
                  disabled={watchLoading}
                  title={ep.episode}
                >
                  <span className="ep-name">{ep.episode.replace(/subtitle indonesia/gi, '').trim()}</span>
                  <span className="ep-date">{ep.release}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function CommandResult({ result }: Props) {
  const [viewingDetail, setViewingDetail] = useState<string | null>(null);

  if (result.error) {
    return (
      <div className="command-card command-error">
        <div className="command-card-header">
          <span className="command-icon">⚠️</span>
          <span className="command-title">Error</span>
        </div>
        <p className="command-text">{result.error}</p>
      </div>
    );
  }

  if (result.type === 'help' && result.data) {
    const helpData = result.data as HelpResult;
    return (
      <div className="command-card command-help">
        <div className="command-card-header">
          <span className="command-icon">📖</span>
          <span className="command-title">Available Commands</span>
        </div>
        <div className="command-list">
          {helpData.commands.map((cmd: { command: string; description: string }, i: number) => (
            <div key={i} className="command-item">
              <code className="command-code">{cmd.command}</code>
              <span className="command-desc">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Anime Search Results
  if (result.type === 'anime' && result.data && Array.isArray(result.data)) {
    const searchResults = result.data as AnimeSearchItem[];

    if (viewingDetail) {
      return (
        <AnimeDetailViewer
          animeUrl={viewingDetail}
          onBack={() => setViewingDetail(null)}
        />
      );
    }

    return (
      <div className="command-card command-anime">
        <div className="command-card-header">
          <span className="command-icon">🎌</span>
          <span className="command-title">Anime Results ({searchResults.length})</span>
        </div>
        <div className="anime-search-results">
          {searchResults.map((item, i) => (
            <div key={i} className="anime-search-item">
              <div className="anime-search-info">
                <h4 className="anime-search-title">{item.title}</h4>
                <div className="anime-search-badges">
                  <span className="command-badge">⭐ {item.rating}</span>
                  <span className="command-badge badge-status">{item.status}</span>
                </div>
                <p className="anime-search-genre">{item.genre}</p>
              </div>
              <button className="anime-view-btn" onClick={() => setViewingDetail(item.url)}>
                View Episodes →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Film
  if (result.type === 'film' && result.data && !Array.isArray(result.data)) {
    const d = result.data as FilmResult;
    return (
      <div className="command-card command-film">
        <div className="command-card-header">
          <span className="command-icon">🎬</span>
          <span className="command-title">{d.title || 'Film Result'}</span>
        </div>
        {d.image && (
          <div className="command-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image} alt={d.title} />
          </div>
        )}
        <div className="command-details">
          {d.rating && <div className="command-badge">⭐ {d.rating}</div>}
          {d.year && <div className="command-badge">📅 {d.year}</div>}
          {d.director && <div className="command-badge">🎥 {d.director}</div>}
          {d.genre && <div className="command-badge">🏷️ {d.genre}</div>}
        </div>
        {d.synopsis && <p className="command-text">{d.synopsis}</p>}
      </div>
    );
  }

  return (
    <div className="command-card">
      <p className="command-text">No results to display.</p>
    </div>
  );
}
