import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '#shop', label: 'Shop' },
    { href: '#customize', label: 'Customize' },
    { href: '#designer', label: 'Designer Series' },
    { href: '#b2b', label: 'B2B & Schools' },
    { href: '#popups', label: 'Pop-Ups' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-zinc-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark only */}
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#141416] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
        >
          KINETA
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#141416] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="font-mono tabular-nums text-xs">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-lg text-zinc-700 hover:bg-zinc-200/70 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-zinc-900/10 bg-[#F7F7F5] px-4 py-3 flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-medium text-zinc-800 hover:text-[#1D4ED8]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
