// ============================================
// AstraAssistant — Chat API Route
// Proxies requests to NEOXR AI endpoints
// Now includes personality system prompt
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const model = searchParams.get('model') || 'claude';
  const systemPrompt = searchParams.get('system') || '';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEOXR_API_KEY;
  const baseUrl = process.env.NEOXR_BASE_URL || 'https://api.neoxr.eu/api';

  // Map model to NEOXR endpoint
  const endpointMap: Record<string, string> = {
    claude: 'claude',
    gpt: 'gpt-pro',
    blackbox: 'blackbox',
  };

  const endpoint = endpointMap[model] || 'claude';

  // Prepend system prompt to the query if personality is set
  const fullQuery = systemPrompt
    ? `[System Instructions: ${systemPrompt}]\n\nUser: ${query}`
    : query;

  try {
    const response = await axios.get(`${baseUrl}/${endpoint}`, {
      params: {
        q: fullQuery,
        apikey: apiKey,
      },
      timeout: 30000,
    });

    if (response.data.status && response.data.data?.message) {
      return NextResponse.json({
        message: response.data.data.message,
        model,
      });
    }

    // Try alternate response shape
    if (response.data.data?.result) {
      return NextResponse.json({
        message: response.data.data.result,
        model,
      });
    }

    return NextResponse.json({
      message: response.data.data?.message || response.data.message || 'No response received.',
      model,
    });
  } catch (error) {
    console.error(`[Chat API] Error with ${endpoint}:`, error);
    return NextResponse.json(
      { error: `Failed to get response from ${model}. Please try again.` },
      { status: 500 }
    );
  }
}
