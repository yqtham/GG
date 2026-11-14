import { Loader2, MessageSquare, Send, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ConciergeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  'What does the 1-year warranty cover?',
  'How do 100-unit school bulk orders work?',
  'Which bottle fits runners best?',
];

export function ConciergeDrawer({ isOpen, onClose }: ConciergeDrawerProps) {
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      role: 'assistant',
      content:
        'Ask anything about KINETA materials, custom laser engraving, school/corporate bulk tiers, or pop-up store schedules.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ConciergeMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Concierge request failed.');
      }
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to Gear Specialist.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="KINETA Gear Specialist"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-zinc-900/10">
        <div className="px-6 py-4 border-b border-zinc-900/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#141416]">
                Gear Specialist
              </h2>
              <p className="text-[11px] text-zinc-500">Product specs, B2B quotes &amp; warranty</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Gear Specialist"
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-[#141416] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1D4ED8] text-white'
                    : 'bg-[#F7F7F5] text-[#141416] border border-zinc-900/8'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F7F7F5] border border-zinc-900/8 rounded-2xl px-4 py-3 text-xs text-zinc-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D4ED8]" aria-hidden="true" />
                <span>Checking catalog specs...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-900/10 bg-[#F7F7F5] space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-white border border-zinc-900/10 hover:border-zinc-900/30 rounded-lg transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sizing, drop rating, bulk..."
              aria-label="Ask the Gear Specialist"
              className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-zinc-900/15 rounded-xl text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="px-4 py-2.5 bg-[#141416] hover:bg-[#1D4ED8] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
