import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';
import { parseJsonSafe } from '@/lib/http';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.text();
  const upstream = await fetch(`${API_BASE}/sacha/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (upstream.status === 204) return NextResponse.json({ success: true }, { status: 200 });
  const data = await parseJsonSafe(upstream);
  return NextResponse.json(data, { status: upstream.ok ? upstream.status : 500 });
}
