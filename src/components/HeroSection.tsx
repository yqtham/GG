import { ArrowRight, ShieldCheck, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Product, ProductCategory } from '../types/store';
import { ProductVisual } from './ProductVisual';

interface HeroSectionProps {
  featuredKit: Product[];
  onCustomizeCategory: (category: ProductCategory) => void;
  onInspectProduct: (product: Product) => void;
  onOpenConcierge: () => void;
}

const MARQUEE_ITEMS = [
  'DROP TESTED UP TO 6.5M',
  'CUSTOM STICKER STAMPS',
  '1-YEAR DEFECT WARRANTY',
  'CAMPUS & RUN CLUB CO-LABS',
  'PARTNER-FORGED STEEL BOTTLES',
  'AI KIT & STYLE BUILDER',
];

export function HeroSection({
  featuredKit,
  onCustomizeCategory,
  onInspectProduct,
  onOpenConcierge,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = featuredKit[activeIndex] ?? featuredKit[0];

  return (
    <>
      <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Lively Editorial Hook */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2 lg:py-4">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <span>Phones</span>
                <span aria-hidden="true" className="text-zinc-400">·</span>
                <span>Earbuds</span>
                <span aria-hidden="true" className="text-zinc-400">·</span>
                <span>Laptops</span>
                <span aria-hidden="true" className="text-zinc-400">·</span>
                <span>Insulated Bottles</span>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.85rem] font-extrabold tracking-tight text-[#141416] leading-[1.03] max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                Drop-proof gear, styled by you.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                Impact-tested phone armor, snap-lock earbuds, bounce laptop sleeves, and insulated steel bottles built for campus runs, gym floors, and everyday adventures. Customize colors, graphic stamps, and bold text—or let AI build your vibe.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  href="#shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  <span>Shop the Drop</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  href="#customize"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#141416] bg-[#A3E635] hover:bg-[#84CC16] rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <Wand2 className="w-4 h-4 text-[#141416]" aria-hidden="true" />
                  <span>Design Yours</span>
                </motion.a>

                <button
                  type="button"
                  onClick={onOpenConcierge}
                  className="px-4 py-3 text-sm font-semibold text-zinc-600 hover:text-[#141416] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Ask Specialist
                </button>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-zinc-900/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#141416]">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                1-Year Defect Warranty
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Co-Lab Artist Drops</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Campus &amp; Team Orders</span>
            </div>
          </div>

          {/* Right: Vibrant Interactive Hardware Stage */}
          <div className="lg:col-span-6 relative overflow-hidden bg-[#111114] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[450px] border border-zinc-900/10">
            {/* Vibrant dual-tone athletic glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.34),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(163,230,53,0.18),transparent_50%)]"
            />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="text-xs font-mono tracking-wide text-zinc-300">
                <span className="text-[#A3E635] font-semibold">{activeItem.protectionTier}</span>
                <span className="mx-2 text-zinc-500" aria-hidden="true">/</span>
                <span>{activeItem.deviceModel}</span>
              </div>
              <span className="font-mono tabular-nums text-sm font-bold text-white">
                ${activeItem.price.toFixed(2)}
              </span>
            </div>

            <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 12, rotate: -3, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                whileHover={{ rotate: 2, scale: 1.03 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center cursor-pointer"
                onClick={() => onInspectProduct(activeItem)}
              >
                <ProductVisual
                  category={activeItem.category}
                  shellColorId={activeItem.baseColorId}
                  accentColorId={activeItem.accentColorId}
                  pattern={activeItem.pattern}
                  protectionTier={activeItem.protectionTier}
                  stamp={activeItem.stamp ?? 'Bolt'}
                  engraving={activeItem.series === 'Designer Series' ? 'PACE 01' : 'MOVE'}
                  textLayout={activeItem.series === 'Designer Series' ? 'Diagonal' : 'Center'}
                  textFont="Display"
                  className="w-full max-w-[320px] h-[250px]"
                />
              </motion.div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {activeItem.name}
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1">
                    Loved by {activeItem.segments.join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCustomizeCategory(activeItem.category)}
                    className="px-3.5 py-2 text-xs font-bold text-[#141416] bg-[#A3E635] hover:bg-[#84CC16] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Customize
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectProduct(activeItem)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-white/12 hover:bg-white/22 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Specs
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10">
                {featuredKit.map((item, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`py-2 px-2.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap truncate cursor-pointer ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white/8 text-zinc-300 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {item.category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinetic Ticker Strip */}
      <div className="border-y border-zinc-900/10 bg-[#A3E635] text-[#141416] py-2.5 overflow-hidden">
        <div className="animate-marquee font-mono text-xs font-bold tracking-wider">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 whitespace-nowrap">
              <span>{item}</span>
              <span aria-hidden="true">/</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
