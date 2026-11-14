import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { runConcierge, runDesignBuild, runRecommendKit } from './server/aiLogic.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/ai/design-build', async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      const preferredCategory = typeof req.body?.category === 'string' ? req.body.category : undefined;
      if (!prompt) {
        res.status(400).json({ error: 'Please describe the style, activity, or vibe you want to generate.' });
        return;
      }
      const parsed = await runDesignBuild(prompt, preferredCategory);
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate custom build';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ai/recommend-kit', async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      if (!prompt) {
        res.status(400).json({ error: 'Describe your routine, devices, or who you are shopping for.' });
        return;
      }
      const parsed = await runRecommendKit(prompt);
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to recommend kit';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ai/concierge', async (req, res) => {
    try {
      const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
      const lastUserMessage = [...messages].reverse().find((m) => m?.role === 'user')?.content;
      if (!lastUserMessage || typeof lastUserMessage !== 'string') {
        res.status(400).json({ error: 'Message content is required.' });
        return;
      }
      const reply = await runConcierge(messages);
      res.json({ reply });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Concierge unavailable';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KINETA server listening on http://localhost:${PORT}`);
  });
}

startServer();
