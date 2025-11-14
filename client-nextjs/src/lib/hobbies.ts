export type Hobby = { id: number; name: string; description?: string; created_at?: string; updated_at?: string };
import { fetchJson, parseJsonSafe } from './http';

export async function getAll() {
  return fetchJson(`/api/hobbies`, { cache: 'no-store' });
}

export async function getOne(id: number | string) {
  return fetchJson(`/api/hobbies/${id}`, { cache: 'no-store' });
}

export async function create(data: Partial<Hobby>) {
  return fetchJson(`/api/hobbies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function update(id: number | string, data: Partial<Hobby>) {
  return fetchJson(`/api/hobbies/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function remove(id: number | string) {
  const res = await fetch(`/api/hobbies/delete/${id}`, { method: 'DELETE' });
  if (res.status === 204) return null;
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 200).replace(/\s+/g, ' ').trim(); } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText} for /api/hobbies/delete/${id}${detail ? `: ${detail}` : ''}`);
  }
  return parseJsonSafe(res);
}
