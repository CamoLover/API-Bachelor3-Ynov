import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const upstream = await fetch(`${API_BASE}/name/delete/${id}`, { method: 'DELETE' });
  if (upstream.status < 400) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  const text = await upstream.text();
  const preview = (text || '').slice(0, 300).replace(/\s+/g, ' ').trim();
  return NextResponse.json({ error: preview || 'Delete failed' }, { status: upstream.status });
}
