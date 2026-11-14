import { Check, ShieldCheck, Sliders, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ACCENT_COLORS, DEVICE_MODELS, PROTECTION_TIERS, SHELL_COLORS, getSwatchName } from '../data/catalog';
import { CartItem, Product, ProtectionTier } from '../types/store';
import { ProductVisual } from './ProductVisual';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenInStudio: (product: Product, shellColorId: string, protectionTier: ProtectionTier, deviceModel: string) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
  onOpenInStudio,
}: ProductModalProps) {
  const [selectedShell, setSelectedShell] = useState('obsidian');
  const [selectedTier, setSelectedTier] = useState<ProtectionTier>('Bounce');
  const [selectedModel, setSelectedModel] = useState('');
  const [engraving, setEngraving] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedShell(product.baseColorId);
      setSelectedTier(product.protectionTier);
      setSelectedModel(product.deviceModel);
      setEngraving('');
    }
  }, [product]);

  if (!product) return null;

  const baseTierMeta = PROTECTION_TIERS.find((t) => t.id === product.protectionTier) ?? PROTECTION_TIERS[0];
  const activeTierMeta = PROTECTION_TIERS.find((t) => t.id === selectedTier) ?? PROTECTION_TIERS[0];
  const tierDelta = activeTierMeta.surcharge - baseTierMeta.surcharge;

  const cleanEngraving = engraving.trim().toUpperCase();
  const unitPrice = Math.max(19, product.price + tierDelta + (cleanEngraving ? 5 : 0));

  const handleAdd = () => {
    const cartKey = [
      product.id,
      selectedModel,
      selectedTier,
      selectedShell,
      product.accentColorId,
      product.pattern,
      cleanEngraving,
      'Bottom',
      'Mono',
    ].join('|');

    onAddToCart({
      cartKey,
      productId: product.id,
      name: product.name,
      category: product.category,
      deviceModel: selectedModel,
      protectionTier: selectedTier,
      unitPrice,
      quantity: 1,
      shellColorId: selectedShell,
      accentColorId: product.accentColorId,
      pattern: product.pattern,
      stamp: product.stamp ?? 'None',
      engraving: cleanEngraving,
      textLayout: 'Bottom',
      textFont: 'Display',
      seriesLabel: product.designerName ? `${product.series} · ${product.designerName}` : product.series,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-zinc-900/10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
        <div className="md:col-span-6 bg-gradient-to-b from-[#F4F3EE] to-[#EAE9E2] p-8 flex flex-col justify-between min-h-[320px]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
            <span>{product.sku}</span>
            <span>{activeTierMeta.dropRating} · {activeTierMeta.milStd}</span>
          </div>

          <div className="my-6 flex items-center justify-center">
            <ProductVisual
              category={product.category}
              shellColorId={selectedShell}
              accentColorId={product.accentColorId}
              pattern={product.pattern}
              protectionTier={selectedTier}
              stamp={product.stamp ?? 'None'}
              engraving={cleanEngraving || (product.series === 'Designer Series' ? 'CO-LAB' : '')}
              textLayout={cleanEngraving ? 'Bottom' : 'Diagonal'}
              textFont="Display"
              className="w-full max-w-[300px] h-[240px]"
            />
          </div>

          <div className="text-xs text-zinc-600">
            <span>{selectedModel}</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{getSwatchName(SHELL_COLORS, selectedShell)}</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{getSwatchName(ACCENT_COLORS, product.accentColorId)}</span>
          </div>
        </div>

        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-zinc-500">
                  {product.series} · {product.segments.join(', ')}
                </div>
                <h2 id="pdp-title" className="font-display text-2xl font-bold text-[#141416] mt-1">
                  {product.name}
                </h2>
                {product.designerName && (
                  <p className="text-xs font-medium text-[#1D4ED8] mt-1">{product.designerName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product details"
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-[#141416] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="font-mono tabular-nums text-2xl font-bold text-[#141416] mt-3">
              ${unitPrice.toFixed(2)}
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed mt-2.5">{product.tagline}</p>

            {/* Device Model + Protection Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label htmlFor="pdp-model" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Device / Capacity
                </label>
                <select
                  id="pdp-model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {DEVICE_MODELS[product.category].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pdp-tier" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Protection Tier
                </label>
                <select
                  id="pdp-tier"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as ProtectionTier)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#1D4ED8] cursor-pointer"
                >
                  {PROTECTION_TIERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} ({t.dropRating})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shell Colorway */}
            <div className="mt-4">
              <span className="block text-xs font-semibold text-zinc-500 mb-2">
                Shell Color — {getSwatchName(SHELL_COLORS, selectedShell)}
              </span>
              <div className="flex flex-wrap gap-2">
                {SHELL_COLORS.map((swatch) => {
                  const active = selectedShell === swatch.id;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setSelectedShell(swatch.id)}
                      aria-label={`Select ${swatch.name}`}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer ${
                        active
                          ? 'ring-2 ring-[#1D4ED8] ring-offset-2 border-zinc-900/30'
                          : 'border-zinc-900/15'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {active && (
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

            <div className="mt-4">
              <label htmlFor="pdp-engraving" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                Custom Monogram (+$5, optional)
              </label>
              <input
                id="pdp-engraving"
                type="text"
                maxLength={12}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Initials or name"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-[#F7F7F5] border border-zinc-900/12 rounded-xl text-[#141416] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <ul className="mt-4 space-y-1.5 text-xs text-zinc-600 border-t border-zinc-900/10 pt-3">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-zinc-900/10">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3 px-5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl transition-colors cursor-pointer"
            >
              Add to Bag — ${unitPrice.toFixed(2)}
            </button>
            <button
              type="button"
              onClick={() => onOpenInStudio(product, selectedShell, selectedTier, selectedModel)}
              className="inline-flex items-center justify-center gap-1.5 py-3 px-4 text-sm font-semibold text-[#141416] bg-[#F7F7F5] hover:bg-zinc-200 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <Sliders className="w-4 h-4" aria-hidden="true" />
              <span>Full Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
