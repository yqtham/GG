import { runDesignBuild } from '../../server/aiLogic.ts';

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
    const category = typeof req.body?.category === 'string' ? req.body.category : undefined;
    if (!prompt) {
      res.status(400).json({ error: 'Please describe the style, activity, or vibe you want to generate.' });
      return;
    }

    const result = await runDesignBuild(prompt, category);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate custom build';
    res.status(500).json({ error: message });
  }
}
