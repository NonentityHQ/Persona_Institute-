const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(message: string, public status?: number) { super(message); this.name = 'ApiError'; }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new ApiError('API is not configured. Set NEXT_PUBLIC_API_BASE_URL when backend details are available.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
      signal: init?.signal ?? controller.signal,
      cache: init?.cache ?? 'no-store'
    });
    if (!response.ok) throw new ApiError(`API request failed (${response.status})`, response.status);
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') throw new ApiError('The API request timed out.');
    throw new ApiError('Could not connect to the API. Please try again.');
  } finally { clearTimeout(timeout); }
}
