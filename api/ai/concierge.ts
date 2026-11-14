import { runConcierge } from '../../server/aiLogic.ts';

interface ApiRequest {
  method?: string;
  body?: Record<string, unknown>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const messages = Array.isArray(req.body?.messages)
      ? (req.body.messages as Array<{ role?: string; content?: string }>)
      : [];
    const lastUserMessage = [...messages].reverse().find((m) => m?.role === 'user')?.content;

    if (!lastUserMessage || typeof lastUserMessage !== 'string') {
      res.status(400).json({ error: 'Message content is required.' });
      return;
    }

    const reply = await runConcierge(messages);
    res.status(200).json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Concierge unavailable';
    res.status(500).json({ error: message });
  }
}
