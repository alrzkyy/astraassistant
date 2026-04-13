// ============================================
// AstraAssistant — Video Stream Proxy
// Proxies video from pixeldrain through our
// server to bypass CORS for <video> playback
// Uses Edge Runtime for streaming support
// ============================================

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Only allow pixeldrain URLs for security
  if (!url.includes('pixeldrain.com')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Forward Range header for video seeking support
    const headers: HeadersInit = {};
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const response = await fetch(url, { headers });

    // Build response headers
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    if (response.headers.get('Content-Length')) {
      responseHeaders.set('Content-Length', response.headers.get('Content-Length')!);
    }
    if (response.headers.get('Content-Range')) {
      responseHeaders.set('Content-Range', response.headers.get('Content-Range')!);
    }

    // Stream the response body
    return new Response(response.body, {
      status: response.status, // 200 or 206 for partial content
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Stream Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to stream video' }, { status: 500 });
  }
}
