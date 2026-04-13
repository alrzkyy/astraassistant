// ============================================
// AstraAssistant — Anime Watch/Download API Route
// Gets download link with quality selection
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '720p';

  if (!url) {
    return NextResponse.json(
      { error: 'Query parameter "url" is required' },
      { status: 400 }
    );
  }

  const validQualities = ['360p', '480p', '720p', '1080p'];
  if (!validQualities.includes(quality)) {
    return NextResponse.json(
      { error: `Invalid quality. Use: ${validQualities.join(', ')}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEOXR_API_KEY;
  const baseUrl = process.env.NEOXR_BASE_URL || 'https://api.neoxr.eu/api';

  try {
    const response = await axios.get(`${baseUrl}/otakudesu-dl`, {
      params: { url, quality, apikey: apiKey },
      timeout: 20000,
    });

    if (response.data.status && response.data.data) {
      return NextResponse.json({
        status: true,
        data: {
          ...response.data.data,
          quality,
        },
      });
    }

    return NextResponse.json({
      status: false,
      error: `No download available for quality ${quality}. Try a different resolution.`,
    });
  } catch (error) {
    console.error('[Anime Watch API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get download link. Please try again.' },
      { status: 500 }
    );
  }
}
