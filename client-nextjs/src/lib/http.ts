export async function parseJsonSafe(res: Response) {
  const text = await res.text();
  // Fast path
  try { return JSON.parse(text); } catch {}
  // Tolerant extraction
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  const first = [firstBrace, firstBracket].filter(i => i !== -1).sort((a, b) => a - b)[0] ?? -1;
  if (first !== -1) {
    const lastBrace = text.lastIndexOf('}');
    const lastBracket = text.lastIndexOf(']');
    const last = Math.max(lastBrace, lastBracket);
    if (last > first) {
      const candidate = text.slice(first, last + 1);
      try { return JSON.parse(candidate); } catch {}
    }
  }
  const preview = text.slice(0, 300).replace(/\s+/g, ' ').trim();
  throw new Error(`Invalid JSON (status ${res.status}). Body preview: ${preview}`);
}

export async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 200).replace(/\s+/g, ' ').trim(); } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${typeof input === 'string' ? input : (input as URL).toString()}${detail ? `: ${detail}` : ''}`);
  }
  return parseJsonSafe(res);
}
