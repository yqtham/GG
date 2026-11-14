import { ArrowRight, Loader2, Plus, Search, SlidersHorizontal, Wand2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { CustomerSegment, Product, ProductCategory, SeriesType } from '../types/store';
import { ProductVisual } from './ProductVisual';

interface CatalogSectionProps {
  products: Product[];
  onQuickAdd: (product: Product) => void;
  onAddBundle: (products: Product[]) => void;
  onInspectProduct: (product: Product) => void;
  onCustomizeFromProduct: (product: Product) => void;
  activeSeriesFilter: SeriesType | 'All';
  onSeriesFilterChange: (series: SeriesType | 'All') => void;
}

interface AiKitRecommendation {
  kitTitle: string;
  summary: string;
  productIds: string[];
}

const CATEGORIES: (ProductCategory | 'All')[] = ['All', 'Phones', 'Earbuds', 'Laptops', 'Bottles'];
const SEGMENTS: (CustomerSegment | 'All')[] = ['All', 'Runners', 'Gym', 'Students', 'Office', 'Kids'];

const KIT_STARTERS = [
  'Daily bike commute with 16" laptop and gym session',
  'Marathon runner hydration + sweat-proof earbuds',
  'School gear for an active 9-year-old',
];

export function CatalogSection({
  products,
  onQuickAdd,
  onAddBundle,
  onInspectProduct,
  onCustomizeFromProduct,
  activeSeriesFilter,
  onSeriesFilterChange,
}: CatalogSectionProps) {
  const [category, setCategory] = useState<ProductCategory | 'All'>('All');
  const [segment, setSegment] = useState<CustomerSegment | 'All'>('All');
  const [query, setQuery] = useState('');

  // AI Kit Finder state
  const [kitPrompt, setKitPrompt] = useState('');
  const [kitLoading, setKitLoading] = useState(false);
  const [kitError, setKitError] = useState<string | null>(null);
  const [kitResult, setKitResult] = useState<AiKitRecommendation | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (segment !== 'All' && !p.segments.includes(segment)) return false;
      if (activeSeriesFilter !== 'All' && p.series !== activeSeriesFilter) return false;
      if (q) {
        const haystack = `${p.name} ${p.category} ${p.tagline} ${p.designerName ?? ''} ${p.segments.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [products, category, segment, activeSeriesFilter, query]);

  const recommendedProducts = useMemo(() => {
    if (!kitResult) return [];
    return kitResult.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [kitResult, products]);

  const bundleTotal = recommendedProducts.reduce((sum, p) => sum + p.price, 0);

  const runKitFinder = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    setKitLoading(true);
    setKitError(null);
    try {
      const res = await fetch('/api/ai/recommend-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not generate kit recommendation.');
      }
      setKitResult(data as AiKitRecommendation);
    } catch (err) {
      setKitError(err instanceof Error ? err.message : 'Unable to reach AI Kit Finder.');
    } finally {
      setKitLoading(false);
    }
  };

  const handleKitSubmit = (e: FormEvent) => {
    e.preventDefault();
    runKitFinder(kitPrompt);
  };

  const resetFilters = () => {
    setCategory('All');
    setSegment('All');
    onSeriesFilterChange('All');
    setQuery('');
  };

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-zinc-900/10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141416]">
            Protection Catalog
          </h2>
          <p className="text-sm text-zinc-600 mt-1.5 max-w-xl">
            Every shell, sleeve, and insulated bottle includes a 1-year manufacturing defect warranty and optional custom laser engraving.
          </p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gear, runner, bottle..."
            aria-label="Search products"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-900/12 rounded-xl text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#1D4ED8]"
          />
        </div>
      </div>

      {/* AI Kit Finder Module */}
      <div className="mb-8 bg-white border border-zinc-900/10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center shrink-0 mt-0.5">
              <Wand2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#141416]">
                AI Kit Finder
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Describe your daily routine, workout, or gift recipient and Gemini will assemble your matching protection bundle.
              </p>
            </div>
          </div>

          <form onSubmit={handleKitSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto lg:min-w-[460px]">
            <input
              type="text"
              value={kitPrompt}
              onChange={(e) => setKitPrompt(e.target.value)}
              placeholder="E.g. Office commute + evening gym with phone and bottle..."
              aria-label="Describe your lifestyle for AI kit recommendation"
              className="flex-1 px-3.5 py-2.5 text-sm bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="submit"
              disabled={kitLoading || !kitPrompt.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {kitLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <span>Find My Kit</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Starter Prompts */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-500">Try:</span>
          {KIT_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                setKitPrompt(starter);
                runKitFinder(starter);
              }}
              className="px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-[#F7F7F5] hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
            >
              {starter}
            </button>
          ))}
        </div>

        {kitError && (
          <p className="mt-3 text-xs text-red-600 font-medium">{kitError}</p>
        )}

        {kitResult && recommendedProducts.length > 0 && (
          <div className="mt-5 pt-5 border-t border-zinc-900/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-sm font-semibold text-[#141416]">{kitResult.kitTitle}</div>
                <p className="text-xs text-zinc-600 mt-0.5 max-w-2xl">{kitResult.summary}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onAddBundle(recommendedProducts)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Add Full Kit — ${bundleTotal.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={() => setKitResult(null)}
                  aria-label="Clear recommendation"
                  className="p-2 text-zinc-400 hover:text-[#141416] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recommendedProducts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onInspectProduct(item)}
                  className="text-left p-3 bg-[#F7F7F5] hover:bg-[#EFEFED] rounded-xl border border-zinc-900/8 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                    <ProductVisual
                      category={item.category}
                      shellColorId={item.baseColorId}
                      accentColorId={item.accentColorId}
                      pattern={item.pattern}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#141416] truncate">{item.name}</div>
                    <div className="text-[11px] text-zinc-500">{item.category}</div>
                    <div className="font-mono tabular-nums text-xs font-semibold text-[#1D4ED8] mt-0.5">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFEFED] rounded-xl w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-zinc-600 hover:text-[#141416]'
              }`}
            >
              {cat === 'All' ? 'All Gear' : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <label htmlFor="segment-select" className="font-medium">
              Lifestyle:
            </label>
            <select
              id="segment-select"
              value={segment}
              onChange={(e) => setSegment(e.target.value as CustomerSegment | 'All')}
              className="bg-white border border-zinc-900/12 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#141416] focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
            >
              {SEGMENTS.map((seg) => (
                <option key={seg} value={seg}>
                  {seg === 'All' ? 'All Segments' : seg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EFEFED] rounded-xl">
            {(['All', 'Custom Studio', 'Designer Series'] as const).map((ser) => (
              <button
                key={ser}
                type="button"
                onClick={() => onSeriesFilterChange(ser)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSeriesFilter === ser
                    ? 'bg-white text-[#141416] shadow-xs'
                    : 'text-zinc-600 hover:text-[#141416]'
                }`}
              >
                {ser}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-900/10 rounded-2xl p-12 text-center">
          <p className="font-display text-lg font-semibold text-[#141416]">
            No gear matches those filters
          </p>
          <p className="text-sm text-zinc-600 mt-1">
            Try clearing your search or switching lifestyle segments.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="group bg-white border border-zinc-900/8 rounded-2xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onInspectProduct(product)}
                className="relative bg-gradient-to-b from-[#F4F3EE] to-[#EAE9E2] aspect-[4/3] w-full flex items-center justify-center p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
              >
                <ProductVisual
                  category={product.category}
                  shellColorId={product.baseColorId}
                  accentColorId={product.accentColorId}
                  pattern={product.pattern}
                  protectionTier={product.protectionTier}
                  stamp={product.stamp ?? 'None'}
                  engraving={product.series === 'Designer Series' ? 'CO-LAB' : ''}
                  textLayout="Diagonal"
                  textFont="Display"
                  className="w-full h-full max-h-[210px] transition-transform duration-200 group-hover:scale-[1.05] group-hover:-rotate-1"
                />
              </button>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span className="truncate">
                      {product.protectionTier} · {product.segments.slice(0, 2).join(', ')}
                    </span>
                    <span className="shrink-0 font-medium text-zinc-700">
                      {product.series === 'Designer Series' ? 'Co-Lab Series' : 'Custom Studio'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInspectProduct(product)}
                    className="mt-1.5 text-left font-display text-base font-semibold text-[#141416] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </button>

                  {product.designerName && (
                    <p className="text-xs text-zinc-500 mt-0.5">{product.designerName}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-900/8">
                  <span className="font-mono tabular-nums text-[15px] font-semibold text-[#141416]">
                    ${product.price.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCustomizeFromProduct(product)}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-[#141416] border border-zinc-900/12 hover:border-zinc-900/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickAdd(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
