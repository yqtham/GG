export async function postApiJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const rawText = await res.text();
  let parsed: Record<string, unknown> | null = null;

  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      parsed = null;
    }
  }

  if (!res.ok) {
    const serverMsg =
      parsed && typeof parsed.error === 'string'
        ? parsed.error
        : res.status === 404
          ? 'AI endpoint (/api/ai/*) was not found on this deployment. Make sure the backend server or /api serverless routes are deployed with GEMINI_API_KEY configured.'
          : `Request failed (${res.status}): ${rawText.slice(0, 120) || res.statusText}`;
    throw new Error(serverMsg);
  }

  if (!parsed) {
    throw new Error('Server returned a non-JSON response. Please verify the API backend is running.');
  }

  return parsed as T;
}
