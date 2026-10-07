import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nyaiqwxdmfaiyrtdvoqj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Proxies all Supabase traffic through our own domain so browsers/networks
// that block *.supabase.co can still reach the database.
async function proxy(req: NextRequest, path: string[]) {
  const target = `${SUPABASE_URL}/${path.join('/')}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  // Forward relevant headers
  const forward = ['apikey', 'authorization', 'content-type', 'prefer', 'range', 'x-client-info'];
  req.headers.forEach((value, key) => {
    if (forward.includes(key.toLowerCase())) headers[key] = value;
  });
  if (!headers['apikey'] && SUPABASE_ANON_KEY) headers['apikey'] = SUPABASE_ANON_KEY;
  if (!headers['authorization'] && SUPABASE_ANON_KEY) headers['authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;

  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.arrayBuffer();
  }

  try {
    const res = await fetch(target, { method: req.method, headers, body });
    const resBody = await res.arrayBuffer();
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (['content-type', 'content-range', 'prefer', 'range'].includes(k)) resHeaders[key] = value;
    });
    return new NextResponse(resBody, { status: res.status, headers: resHeaders });
  } catch (e: any) {
    return NextResponse.json({ error: 'Proxy to database failed: ' + (e?.message || 'unknown') }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'apikey,authorization,content-type,prefer,range,x-client-info',
    },
  });
}
