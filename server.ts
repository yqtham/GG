import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const VALID_CATEGORIES = ['Phones', 'Earbuds', 'Laptops', 'Bottles'] as const;
const VALID_SHELL_COLORS = ['obsidian', 'chalk', 'cobalt', 'coral', 'lilac', 'butter', 'sage'] as const;
const VALID_ACCENT_COLORS = ['cobalt', 'lime', 'coral', 'butter', 'lilac', 'chalk', 'graphite'] as const;
const VALID_PATTERNS = ['Smooth Matte', 'Grip Ribbed', 'Carbon Weave', 'Topo Contour'] as const;
const VALID_PROTECTION_TIERS = ['Impact', 'Bounce', 'Ultra Bounce'] as const;
const VALID_TEXT_LAYOUTS = ['Bottom', 'Diagonal', 'Spine', 'Center'] as const;
const VALID_TEXT_FONTS = ['Mono', 'Display', 'Serif'] as const;
const VALID_STAMPS = ['None', 'Bolt', 'Checker', 'Sunburst', 'Stars', 'Wave'] as const;

const CATALOG_CONTEXT = [
  { id: 'apex-phone-custom', name: 'Bounce Corner Phone Armor', category: 'Phones', protectionTier: 'Bounce', segments: ['Runners', 'Gym', 'Students'], price: 52, series: 'Custom Studio' },
  { id: 'pace-phone-designer', name: 'Pace 01 Ultra Bounce Case', category: 'Phones', protectionTier: 'Ultra Bounce', segments: ['Runners', 'Office'], price: 62, series: 'Designer Series (Maya Lin KOL)' },
  { id: 'pulse-earbud-custom', name: 'Pulse Impact Earbud Case', category: 'Earbuds', protectionTier: 'Impact', segments: ['Gym', 'Runners', 'Students'], price: 28, series: 'Custom Studio' },
  { id: 'studio-earbud-designer', name: 'Lilac Wave Earbud Vault', category: 'Earbuds', protectionTier: 'Bounce', segments: ['Office', 'Students'], price: 38, series: 'Designer Series (Sora Kim)' },
  { id: 'stride-laptop-custom', name: 'Stride Bounce Laptop Sleeve', category: 'Laptops', protectionTier: 'Bounce', segments: ['Students', 'Office'], price: 64, series: 'Custom Studio' },
  { id: 'commute-laptop-designer', name: 'Monolith Ultra Bounce Folio 16"', category: 'Laptops', protectionTier: 'Ultra Bounce', segments: ['Office', 'Students'], price: 76, series: 'Designer Series (Kenji Sato)' },
  { id: 'hydro-bottle-custom', name: 'Hydro-Shield Bounce Bottle', category: 'Bottles', protectionTier: 'Bounce', segments: ['Gym', 'Runners', 'Kids', 'Students'], price: 52, series: 'Custom Studio' },
  { id: 'junior-bottle-kids', name: 'Junior Ultra Bounce Bottle 500ml', category: 'Bottles', protectionTier: 'Ultra Bounce', segments: ['Kids', 'Students'], price: 42, series: 'Custom Studio' },
  { id: 'trail-bottle-designer', name: 'Trailhead Co-Lab Bottle 750ml', category: 'Bottles', protectionTier: 'Impact', segments: ['Runners', 'Gym'], price: 50, series: 'Designer Series (Devon Brooks KOL)' },
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. AI Custom Build Stylist
  app.post('/api/ai/design-build', async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      const preferredCategory = typeof req.body?.category === 'string' ? req.body.category : undefined;

      if (!prompt) {
        res.status(400).json({ error: 'Please describe the style, activity, or vibe you want to generate.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Design a lively, youthful custom KINETA protective gear build for this request: "${prompt}".${
          preferredCategory ? ` User currently has ${preferredCategory} selected, keep it unless the prompt clearly asks for a different category.` : ''
        }`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            'You are KINETA’s youth-culture & athletic product stylist. Map the user prompt to valid vibrant shell colorways, bumper accents, patterns, graphic stamp (Bolt, Checker, Sunburst, Stars, Wave, None), protectionTier (Impact 2.5m, Bounce 4.0m, Ultra Bounce 6.5m), textLayout, textFont, category, and a short 1-10 character uppercase engraving. Keep rationale energetic and crisp (1-2 sentences).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: [...VALID_CATEGORIES] },
              protectionTier: { type: Type.STRING, enum: [...VALID_PROTECTION_TIERS] },
              shellColorId: { type: Type.STRING, enum: [...VALID_SHELL_COLORS] },
              accentColorId: { type: Type.STRING, enum: [...VALID_ACCENT_COLORS] },
              pattern: { type: Type.STRING, enum: [...VALID_PATTERNS] },
              stamp: { type: Type.STRING, enum: [...VALID_STAMPS] },
              engraving: { type: Type.STRING, description: 'Short uppercase monogram max 10 chars, e.g. RUN 26 or VIBE' },
              textLayout: { type: Type.STRING, enum: [...VALID_TEXT_LAYOUTS] },
              textFont: { type: Type.STRING, enum: [...VALID_TEXT_FONTS] },
              buildTitle: { type: Type.STRING, description: 'Concise 2-4 word build title' },
              rationale: { type: Type.STRING, description: '1-2 sentence rationale explaining protection tier, stamp, and color choices' },
            },
            required: ['category', 'protectionTier', 'shellColorId', 'accentColorId', 'pattern', 'stamp', 'engraving', 'textLayout', 'textFont', 'buildTitle', 'rationale'],
          },
        },
      });

      const raw = (response.text ?? '{}').trim();
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate custom build';
      res.status(500).json({ error: message });
    }
  });

  // 2. AI Active-Kit Recommender
  app.post('/api/ai/recommend-kit', async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      if (!prompt) {
        res.status(400).json({ error: 'Describe your routine, devices, or who you are shopping for.' });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Shopper request: "${prompt}"\n\nAvailable KINETA Catalog:\n${JSON.stringify(CATALOG_CONTEXT)}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            'You are KINETA’s active-lifestyle kit curator. Recommend 2 to 4 exact product IDs from the provided catalog that solve the shopper’s request. Never invent product IDs. Provide a concise kit name and a crisp 2-sentence explanation.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kitTitle: { type: Type.STRING },
              summary: { type: Type.STRING },
              productIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: CATALOG_CONTEXT.map((p) => p.id) },
              },
            },
            required: ['kitTitle', 'summary', 'productIds'],
          },
        },
      });

      const raw = (response.text ?? '{}').trim();
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to recommend kit';
      res.status(500).json({ error: message });
    }
  });

  // 3. AI Gear & B2B Concierge
  app.post('/api/ai/concierge', async (req, res) => {
    try {
      const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
      const lastUserMessage = [...messages].reverse().find((m) => m?.role === 'user')?.content;

      if (!lastUserMessage || typeof lastUserMessage !== 'string') {
        res.status(400).json({ error: 'Message content is required.' });
        return;
      }

      const historyText = messages
        .slice(-8)
        .map((m: { role?: string; content?: string }) => `${m.role === 'user' ? 'Customer' : 'Specialist'}: ${m.content ?? ''}`)
        .join('\n');

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${historyText}\n\nRespond to the Customer's latest message concisely and helpfully.`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: `You are KINETA's Gear & Bulk Order Specialist.
Facts you know:
- Products: Phones (3m drop-tested, Mag-ring), Earbuds (carabiner snap-lock), Laptops (14"-16" corner armor), Insulated Bottles (partner-forged 18/8 steel, 24h cold / 12h hot, silicone impact boot).
- Catalog: ${JSON.stringify(CATALOG_CONTEXT)}
- Warranty: Every item includes a 1-year manufacturing defect warranty.
- Free shipping threshold: $65+ (otherwise $6.95 standard). Cash on Delivery & Card supported.
- B2B / Schools / Corporate Collabs: Bulk discounts at 25+ units (10% off), 100+ units (18% off), 250+ units (25% off) with custom school crest / corporate logo engraving.
- Pop-Up Stores: Nov 21-23 Campus Custom Lab, Dec 05-06 City Half-Marathon Expo, Dec 12 Midtown Tech & Wellness Showcase.
Keep answers concise (2-4 short sentences or crisp bullets), plain language, no hype.`,
        },
      });

      res.json({ reply: (response.text ?? 'How can I help with your gear setup?').trim() });
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
