import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const upstream = await fetch(`${API_BASE}/hobbies/delete/${id}`, { method: 'DELETE' });
  if (upstream.status < 400) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  const text = await upstream.text();
  return NextResponse.json({ error: text || 'Delete failed' }, { status: 500 });
}
