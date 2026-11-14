import { Check, Loader2, RotateCcw, ShieldCheck, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEvent, useState } from 'react';
import {
  ACCENT_COLORS,
  CATEGORY_BASE_PRICES,
  DESIGNER_PRESETS,
  DEVICE_MODELS,
  GRAPHIC_STAMPS,
  PATTERNS,
  PROTECTION_TIERS,
  SHELL_COLORS,
  TEXT_FONTS,
  TEXT_LAYOUTS,
  getSwatchName,
} from '../data/catalog';
import {
  CartItem,
  GraphicStamp,
  PatternType,
  ProductCategory,
  ProtectionTier,
  TextFont,
  TextLayout,
} from '../types/store';
import { ProductVisual } from './ProductVisual';

export interface CustomizerState {
  category: ProductCategory;
  deviceModel: string;
  protectionTier: ProtectionTier;
  shellColorId: string;
  accentColorId: string;
  pattern: PatternType;
  stamp: GraphicStamp;
  engraving: string;
  textLayout: TextLayout;
  textFont: TextFont;
  presetName: string | null;
}

interface CustomizerStudioProps {
  state: CustomizerState;
  onChange: (next: CustomizerState) => void;
  onAddCustomToCart: (item: CartItem) => void;
  justAdded: boolean;
}

const DEVICE_CATEGORIES: ProductCategory[] = ['Phones', 'Earbuds', 'Laptops', 'Bottles'];

const STYLE_IDEAS = [
  'Sunny campus vibe with coral shell and sunburst stamp',
  'Track team Ultra Bounce with checkered flag and diagonal text',
  'After-hours lilac gym bottle with motion wave',
];

export function CustomizerStudio({
  state,
  onChange,
  onAddCustomToCart,
  justAdded,
}: CustomizerStudioProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRationale, setAiRationale] = useState<{ title: string; rationale: string } | null>(null);

  const categoryInfo = CATEGORY_BASE_PRICES[state.category];
  const tierMeta = PROTECTION_TIERS.find((t) => t.id === state.protectionTier) ?? PROTECTION_TIERS[0];
  const patternMeta = PATTERNS.find((p) => p.id === state.pattern) ?? PATTERNS[0];
  const modelsForCategory = DEVICE_MODELS[state.category];
  const engravingFee = state.engraving.trim().length > 0 ? 5 : 0;
  const designerFee = state.presetName ? 4 : 0;
  const unitPrice =
    categoryInfo.basePrice + tierMeta.surcharge + patternMeta.surcharge + engravingFee + designerFee;

  const dropFillPercent =
    state.protectionTier === 'Ultra Bounce' ? 100 : state.protectionTier === 'Bounce' ? 68 : 40;

  const generateAiBuild = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/design-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, category: state.category }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not generate AI build.');
      }

      const nextCategory = (data.category as ProductCategory) || state.category;
      const nextModel =
        nextCategory === state.category ? state.deviceModel : DEVICE_MODELS[nextCategory][0];

      onChange({
        category: nextCategory,
        deviceModel: nextModel,
        protectionTier: (data.protectionTier as ProtectionTier) || 'Bounce',
        shellColorId: data.shellColorId,
        accentColorId: data.accentColorId,
        pattern: data.pattern,
        stamp: (data.stamp as GraphicStamp) || 'Bolt',
        engraving: (data.engraving ?? '').slice(0, 12),
        textLayout: (data.textLayout as TextLayout) || 'Diagonal',
        textFont: (data.textFont as TextFont) || 'Display',
        presetName: null,
      });
      setAiRationale({ title: data.buildTitle, rationale: data.rationale });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unable to reach AI Stylist.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSubmit = (e: FormEvent) => {
    e.preventDefault();
    generateAiBuild(aiPrompt);
  };

  const applyPreset = (presetId: string) => {
    const preset = DESIGNER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setAiRationale(null);
    onChange({
      ...state,
      protectionTier: preset.protectionTier,
      shellColorId: preset.shellColorId,
      accentColorId: preset.accentColorId,
      pattern: preset.pattern,
      stamp: preset.stamp,
      engraving: preset.engraving,
      textLayout: preset.textLayout,
      textFont: preset.textFont,
      presetName: preset.title,
    });
  };

  const resetStudio = () => {
    setAiRationale(null);
    setAiError(null);
    onChange({
      category: state.category,
      deviceModel: DEVICE_MODELS[state.category][0],
      protectionTier: 'Bounce',
      shellColorId: 'cobalt',
      accentColorId: 'lime',
      pattern: 'Smooth Matte',
      stamp: 'Bolt',
      engraving: '',
      textLayout: 'Diagonal',
      textFont: 'Display',
      presetName: null,
    });
  };

  const handleAdd = () => {
    const cleanEngraving = state.engraving.trim().toUpperCase();
    const cartKey = [
      'custom',
      state.category,
      state.deviceModel,
      state.protectionTier,
      state.shellColorId,
      state.accentColorId,
      state.pattern,
      state.stamp,
      cleanEngraving,
      state.textLayout,
      state.textFont,
      state.presetName ?? 'studio',
    ].join('|');

    onAddCustomToCart({
      cartKey,
      productId: `custom-${state.category.toLowerCase()}`,
      name: state.presetName
        ? `${state.presetName} (${state.category})`
        : aiRationale
          ? `${aiRationale.title} (${state.category})`
          : `Custom ${state.protectionTier} ${state.category === 'Bottles' ? 'Bottle' : state.category.slice(0, -1)}`,
      category: state.category,
      deviceModel: state.deviceModel,
      protectionTier: state.protectionTier,
      unitPrice,
      quantity: 1,
      shellColorId: state.shellColorId,
      accentColorId: state.accentColorId,
      pattern: state.pattern,
      stamp: state.stamp,
      engraving: cleanEngraving,
      textLayout: state.textLayout,
      textFont: state.textFont,
      seriesLabel: state.presetName ? `Co-Lab · ${state.presetName}` : 'Custom Studio Build',
    });
  };

  return (
    <section id="customize" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141416]">
            Custom Protection Studio
          </h2>
          <p className="text-sm text-zinc-600 mt-1.5 max-w-2xl">
            Mix loud colorways, bounce bumpers, sticker stamps, and bold typography—or type your vibe for the AI Stylist to remix live.
          </p>
        </div>

        <button
          type="button"
          onClick={resetStudio}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#141416] cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Build</span>
        </button>
      </div>

      {/* AI Build Stylist Strip */}
      <div className="mb-8 bg-[#111114] text-white rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3E635] text-[#141416] flex items-center justify-center shrink-0 mt-0.5">
              <Wand2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="font-display text-base font-bold">AI Vibe Remix</div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Auto-picks colorway, bounce tier, sticker stamp, and bold typography from any mood or outfit prompt.
              </p>
            </div>
          </div>

          <form onSubmit={handleAiSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto lg:min-w-[460px]">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g. Skate park coral & volt with checker stamp..."
              aria-label="Describe custom style for AI generator"
              className="flex-1 px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#A3E635]"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiPrompt.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#141416] bg-[#A3E635] hover:bg-[#84CC16] disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Remixing...</span>
                </>
              ) : (
                <span>Remix with AI</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400">Vibe ideas:</span>
          {STYLE_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => {
                setAiPrompt(idea);
                generateAiBuild(idea);
              }}
              className="px-2.5 py-1 text-[11px] font-medium text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              {idea}
            </button>
          ))}
        </div>

        {aiError && <p className="mt-3 text-xs text-red-400 font-medium">{aiError}</p>}

        {aiRationale && (
          <div className="mt-4 pt-4 border-t border-white/10 text-xs">
            <span className="font-bold text-[#A3E635]">{aiRationale.title}: </span>
            <span className="text-zinc-200">{aiRationale.rationale}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Live Interactive Studio Stage */}
        <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-[#F4F3EE] via-[#ECECE6] to-[#E3E5DF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[470px] border border-zinc-900/8">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span className="font-mono font-semibold text-[#141416]">{state.deviceModel}</span>
            <span>
              {state.protectionTier} · {tierMeta.dropRating}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center my-6">
            <motion.div
              key={`${state.category}-${state.protectionTier}-${state.shellColorId}-${state.accentColorId}-${state.pattern}-${state.stamp}-${state.textLayout}-${state.textFont}`}
              initial={{ opacity: 0.85, rotate: -2, scale: 0.96 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              whileHover={{ rotate: 1.5, scale: 1.02 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center justify-center"
            >
              <ProductVisual
                category={state.category}
                shellColorId={state.shellColorId}
                accentColorId={state.accentColorId}
                pattern={state.pattern}
                protectionTier={state.protectionTier}
                stamp={state.stamp}
                engraving={state.engraving}
                textLayout={state.textLayout}
                textFont={state.textFont}
                className="w-full max-w-[330px] h-[270px]"
              />
            </motion.div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-zinc-900/8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#141416]">
                {tierMeta.label} Protection · {tierMeta.dropRating} Drop Tested
              </span>
              <span className="font-mono tabular-nums text-[11px] font-semibold text-[#2563EB]">
                {tierMeta.milStd}
              </span>
            </div>
            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] transition-all duration-200"
                style={{ width: `${dropFillPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-600">{tierMeta.summary}</p>
          </div>
        </div>

        {/* Right: Step-by-Step Studio Controls */}
        <div className="lg:col-span-7 bg-white border border-zinc-900/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            {/* Accessory + Device */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <span className="block text-xs font-semibold text-zinc-500 mb-2">
                  01. Accessory Category
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {DEVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...state,
                          category: cat,
                          deviceModel: DEVICE_MODELS[cat][0],
                        })
                      }
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                        state.category === cat
                          ? 'bg-[#141416] text-white border-[#141416]'
                          : 'bg-[#F7F7F5] text-zinc-700 border-zinc-900/10 hover:border-zinc-900/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="studio-model" className="block text-xs font-semibold text-zinc-500 mb-2">
                  02. Device / Capacity
                </label>
                <select
                  id="studio-model"
                  value={state.deviceModel}
                  onChange={(e) => onChange({ ...state, deviceModel: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {modelsForCategory.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Protection Tier */}
            <div>
              <span className="block text-xs font-semibold text-zinc-500 mb-2">
                03. Protection Tier
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PROTECTION_TIERS.map((tier) => {
                  const selected = state.protectionTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => onChange({ ...state, protectionTier: tier.id, presetName: null })}
                      className={`p-3 text-left rounded-xl border transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#2563EB] bg-[#2563EB]/6'
                          : 'border-zinc-900/10 hover:border-zinc-900/25 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#141416]">{tier.label}</span>
                        <span className="font-mono tabular-nums text-[11px] font-semibold text-[#2563EB]">
                          {tier.surcharge === 0 ? 'Base' : `+$${tier.surcharge}`}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                        {tier.dropRating} · {tier.milStd}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Co-Lab Presets */}
            <div id="designer">
              <span className="block text-xs font-semibold text-zinc-500 mb-2">
                04. Co-Lab &amp; Creator Presets (+$4)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DESIGNER_PRESETS.map((preset) => {
                  const active = state.presetName === preset.title;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`text-left px-3.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'border-[#2563EB] bg-[#2563EB]/6'
                          : 'border-zinc-900/10 hover:border-zinc-900/25 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#141416] truncate">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {preset.collaborator} · {preset.segmentFit}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors & Graphic Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-zinc-500 mb-2">
                  05. Shell Color — {getSwatchName(SHELL_COLORS, state.shellColorId)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SHELL_COLORS.map((swatch) => {
                    const selected = state.shellColorId === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() =>
                          onChange({ ...state, shellColorId: swatch.id, presetName: null })
                        }
                        aria-label={`Shell color ${swatch.name}`}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-transform cursor-pointer ${
                          selected
                            ? 'ring-2 ring-[#2563EB] ring-offset-1 scale-105 border-zinc-900/30'
                            : 'border-zinc-900/15 hover:scale-105'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {selected && (
                          <Check
                            className={`w-3.5 h-3.5 ${swatch.isDark ? 'text-white' : 'text-[#141416]'}`}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-zinc-500 mb-2">
                  06. Bumper Accent — {getSwatchName(ACCENT_COLORS, state.accentColorId)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ACCENT_COLORS.map((swatch) => {
                    const selected = state.accentColorId === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() =>
                          onChange({ ...state, accentColorId: swatch.id, presetName: null })
                        }
                        aria-label={`Accent color ${swatch.name}`}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-transform cursor-pointer ${
                          selected
                            ? 'ring-2 ring-[#2563EB] ring-offset-1 scale-105 border-zinc-900/30'
                            : 'border-zinc-900/15 hover:scale-105'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {selected && (
                          <Check
                            className={`w-3.5 h-3.5 ${swatch.isDark ? 'text-white' : 'text-[#141416]'}`}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Graphic Sticker Stamp + Texture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="studio-stamp" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  07. Sticker Stamp (Free)
                </label>
                <select
                  id="studio-stamp"
                  value={state.stamp}
                  onChange={(e) =>
                    onChange({ ...state, stamp: e.target.value as GraphicStamp, presetName: null })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {GRAPHIC_STAMPS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="studio-pattern" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  08. Backplate Texture
                </label>
                <select
                  id="studio-pattern"
                  value={state.pattern}
                  onChange={(e) =>
                    onChange({ ...state, pattern: e.target.value as PatternType, presetName: null })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {PATTERNS.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.label} {pat.surcharge === 0 ? '(Included)' : `(+$${pat.surcharge})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Typography Customizer */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label htmlFor="custom-engraving" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  09. Custom Text (+$5, optional)
                </label>
                <input
                  id="custom-engraving"
                  type="text"
                  maxLength={12}
                  value={state.engraving}
                  onChange={(e) => onChange({ ...state, engraving: e.target.value })}
                  placeholder="E.g. RUN CLUB"
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="text-layout" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Text Layout
                </label>
                <select
                  id="text-layout"
                  value={state.textLayout}
                  onChange={(e) => onChange({ ...state, textLayout: e.target.value as TextLayout })}
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {TEXT_LAYOUTS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="text-font" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Font
                </label>
                <select
                  id="text-font"
                  value={state.textFont}
                  onChange={(e) => onChange({ ...state, textFont: e.target.value as TextFont })}
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {TEXT_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-900/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono tabular-nums text-2xl font-bold text-[#141416]">
                ${unitPrice.toFixed(2)}
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                <span>{tierMeta.dropRating} Drop Rated · 1-Year Warranty</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleAdd}
              className="px-6 py-3 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              {justAdded ? 'Added Custom Build to Bag' : 'Add Custom Build to Bag'}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
