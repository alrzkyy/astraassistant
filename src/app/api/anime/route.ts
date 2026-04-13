// ============================================
// AstraAssistant — Anime API Route (Otakudesu)
// Search anime via NEOXR otakudesu endpoint
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEOXR_API_KEY;
  const baseUrl = process.env.NEOXR_BASE_URL || 'https://api.neoxr.eu/api';

  try {
    const response = await axios.get(`${baseUrl}/otakudesu`, {
      params: { q: query, apikey: apiKey },
      timeout: 15000,
    });

    if (response.data.status && response.data.data) {
      return NextResponse.json({
        status: true,
        data: response.data.data, // Array of search results
      });
    }

    return NextResponse.json({
      status: false,
      error: 'No anime results found',
    });
  } catch (error) {
    console.error('[Anime Search API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to search anime. Please try again.' },
      { status: 500 }
    );
  }
}
