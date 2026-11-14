import { runRecommendKit } from '../../server/aiLogic.ts';

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
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
    if (!prompt) {
      res.status(400).json({ error: 'Describe your routine, devices, or who you are shopping for.' });
      return;
    }

    const result = await runRecommendKit(prompt);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to recommend kit';
    res.status(500).json({ error: message });
  }
}
