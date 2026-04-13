// ============================================
// AstraAssistant — Film Search API Route
// Proxies film search requests to NEOXR
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
    const response = await axios.get(`${baseUrl}/film`, {
      params: { q: query, apikey: apiKey },
      timeout: 15000,
    });

    if (response.data.status && response.data.data) {
      return NextResponse.json({
        status: true,
        data: response.data.data,
      });
    }

    return NextResponse.json({
      status: false,
      error: 'No film results found',
    });
  } catch (error) {
    console.error('[Film API] Error:', error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Film search service is currently unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search films. Please try again.' },
      { status: 500 }
    );
  }
}
