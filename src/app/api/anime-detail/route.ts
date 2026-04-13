// ============================================
// AstraAssistant — Anime Detail API Route
// Gets anime details + episode list
// Fixes domain: search returns .blog, API needs .cloud
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

function fixAnimeUrl(url: string): string {
  // The search API returns otakudesu.blog URLs
  // but otakudesu-get only accepts otakudesu.cloud
  return url
    .replace('otakudesu.blog', 'otakudesu.cloud')
    .replace('otakudesu.best', 'otakudesu.cloud')
    .replace('otakudesu.net', 'otakudesu.cloud');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Query parameter "url" is required' },
      { status: 400 }
    );
  }

  const fixedUrl = fixAnimeUrl(url);
  const apiKey = process.env.NEOXR_API_KEY;
  const baseUrl = process.env.NEOXR_BASE_URL || 'https://api.neoxr.eu/api';

  try {
    const response = await axios.get(`${baseUrl}/otakudesu-get`, {
      params: { url: fixedUrl, apikey: apiKey },
      timeout: 20000,
    });

    if (response.data.status && response.data.data) {
      // Fix episode URLs too — convert .blog to .best for download API
      const data = response.data.data;
      if (data.episodes) {
        data.episodes = data.episodes.map((group: { name: string; lists: { episode: string; release: string; url: string }[] }) => ({
          ...group,
          lists: group.lists.map((ep: { episode: string; release: string; url: string }) => ({
            ...ep,
            url: ep.url
              .replace('otakudesu.blog', 'otakudesu.best')
              .replace('otakudesu.cloud', 'otakudesu.best')
              .replace('otakudesu.net', 'otakudesu.best'),
          })),
        }));
      }

      return NextResponse.json({
        status: true,
        data,
      });
    }

    return NextResponse.json({
      status: false,
      error: response.data.msg || 'Failed to get anime details',
    });
  } catch (error) {
    console.error('[Anime Detail API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get anime details. Please try again.' },
      { status: 500 }
    );
  }
}
