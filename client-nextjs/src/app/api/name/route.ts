import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';
import { parseJsonSafe } from '@/lib/http';

export async function GET() {
  const upstream = await fetch(`${API_BASE}/name`, { cache: 'no-store' });
  if (upstream.status === 204) return NextResponse.json({ success: true }, { status: 200 });
  const data = await parseJsonSafe(upstream);
  return NextResponse.json(data, { status: upstream.ok ? upstream.status : 500 });
}

export async function POST(req: Request) {
  const body = await req.text();
  const upstream = await fetch(`${API_BASE}/name/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (upstream.status === 204) return NextResponse.json({ success: true }, { status: 200 });
  const data = await parseJsonSafe(upstream);
  return NextResponse.json(data, { status: upstream.ok ? upstream.status : 500 });
}
