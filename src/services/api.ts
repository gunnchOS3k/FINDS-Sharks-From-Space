import type { GenerateResponse } from '../../shared/types';

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '');

export async function fetchHotspots(region: string, n: number, signal?: AbortSignal): Promise<GenerateResponse> {
  if (!API_BASE) {
    throw new Error('NO_API');
  }
  const response = await fetch(`${API_BASE}/api/hotspots`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ region, n }),
    signal,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API ${response.status}`);
  }
  return data as GenerateResponse;
}

export async function fetchDemo(): Promise<GenerateResponse> {
  const response = await fetch('/demo.json');
  if (!response.ok) throw new Error('Demo data missing');
  return (await response.json()) as GenerateResponse;
}
