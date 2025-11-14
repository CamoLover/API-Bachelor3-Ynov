import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';
import { parseJsonSafe } from '@/lib/http';

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const upstream = await fetch(`${API_BASE}/name/${id}`, { cache: 'no-store' });
  if (upstream.status === 204) return NextResponse.json({ success: true }, { status: 200 });
  const data = await parseJsonSafe(upstream);
  return NextResponse.json(data, { status: upstream.ok ? upstream.status : 500 });
}
