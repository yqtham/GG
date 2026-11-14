import { MessageSquare, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BmcReferenceModal } from './components/BmcReferenceModal';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { ChannelsAndB2BSection } from './components/ChannelsAndB2BSection';
import { ConciergeDrawer } from './components/ConciergeDrawer';
import { CustomizerState, CustomizerStudio } from './components/CustomizerStudio';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductModal } from './components/ProductModal';
import { CATALOG_PRODUCTS, DEVICE_MODELS } from './data/catalog';
import { CartItem, GraphicStamp, Product, ProductCategory, ProtectionTier, SeriesType } from './types/store';

const CART_STORAGE_KEY = 'kineta_store_bag_v3';

export default function App() {
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [isBmcOpen, setIsBmcOpen] = useState(false);
  const [seriesFilter, setSeriesFilter] = useState<SeriesType | 'All'>('All');
  const [justAddedCustom, setJustAddedCustom] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [customizerState, setCustomizerState] = useState<CustomizerState>({
    category: 'Phones',
    deviceModel: DEVICE_MODELS.Phones[0],
    protectionTier: 'Bounce',
    shellColorId: 'cobalt',
    accentColorId: 'lime',
    pattern: 'Grip Ribbed',
    stamp: 'Bolt',
    engraving: '',
    textLayout: 'Diagonal',
    textFont: 'Display',
    presetName: null,
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const featuredKit = useMemo(() => {
    const categories: ProductCategory[] = ['Phones', 'Earbuds', 'Laptops', 'Bottles'];
    return categories
      .map((cat) => CATALOG_PRODUCTS.find((p) => p.category === cat))
      .filter((p): p is Product => Boolean(p));
  }, []);

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addItemsBatch = (newItems: CartItem[], label: string) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const newItem of newItems) {
        const idx = updated.findIndex((i) => i.cartKey === newItem.cartKey);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + newItem.quantity };
        } else {
          updated.push(newItem);
        }
      }
      return updated;
    });
    setToastMessage(label);
  };

  const addItemToCart = (newItem: CartItem) => {
    addItemsBatch([newItem], `Added ${newItem.name} to Bag`);
  };

  const productToCartItem = (product: Product): CartItem => ({
    cartKey: [
      product.id,
      product.deviceModel,
      product.protectionTier,
      product.baseColorId,
      product.accentColorId,
      product.pattern,
      product.stamp ?? 'None',
      '',
      'Bottom',
      'Display',
    ].join('|'),
    productId: product.id,
    name: product.name,
    category: product.category,
    deviceModel: product.deviceModel,
    protectionTier: product.protectionTier,
    unitPrice: product.price,
    quantity: 1,
    shellColorId: product.baseColorId,
    accentColorId: product.accentColorId,
    pattern: product.pattern,
    stamp: product.stamp ?? 'None',
    engraving: '',
    textLayout: 'Bottom',
    textFont: 'Display',
    seriesLabel: product.designerName ? `${product.series} · ${product.designerName}` : product.series,
  });

  const handleQuickAdd = (product: Product) => {
    addItemToCart(productToCartItem(product));
  };

  const handleAddBundle = (bundleProducts: Product[]) => {
    const items = bundleProducts.map(productToCartItem);
    addItemsBatch(items, `Added ${items.length}-piece recommended kit to Bag`);
  };

  const handleAddCustomToCart = (item: CartItem) => {
    addItemToCart(item);
    setJustAddedCustom(true);
    window.setTimeout(() => setJustAddedCustom(false), 1800);
  };

  const handleUpdateQty = (cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const scrollToStudio = (
    category: ProductCategory,
    shellColorId?: string,
    accentColorId?: string,
    pattern?: CustomizerState['pattern'],
    protectionTier?: ProtectionTier,
    deviceModel?: string,
    stamp?: GraphicStamp
  ) => {
    setCustomizerState((prev) => ({
      ...prev,
      category,
      deviceModel: deviceModel ?? DEVICE_MODELS[category][0],
      protectionTier: protectionTier ?? prev.protectionTier,
      shellColorId: shellColorId ?? prev.shellColorId,
      accentColorId: accentColorId ?? prev.accentColorId,
      pattern: pattern ?? prev.pattern,
      stamp: stamp ?? prev.stamp,
      presetName: null,
    }));
    setInspectedProduct(null);
    const el = document.getElementById('customize');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#141416]">
      {!promoDismissed && (
        <div className="bg-[#141416] text-zinc-200 text-xs h-9 px-4 flex items-center justify-center relative">
          <p className="truncate pr-8">
            1-Year Manufacturing Defect Warranty on all gear · Free shipping over $65 · B2B &amp; School bulk pricing
          </p>
          <button
            type="button"
            onClick={() => setPromoDismissed(true)}
            aria-label="Dismiss announcement"
            className="absolute right-3 p-1 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <Navbar cartCount={totalBagCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <HeroSection
          featuredKit={featuredKit}
          onCustomizeCategory={(cat) => scrollToStudio(cat)}
          onInspectProduct={(p) => setInspectedProduct(p)}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />

        <CatalogSection
          products={CATALOG_PRODUCTS}
          onQuickAdd={handleQuickAdd}
          onAddBundle={handleAddBundle}
          onInspectProduct={(p) => setInspectedProduct(p)}
          onCustomizeFromProduct={(p) =>
            scrollToStudio(
              p.category,
              p.baseColorId,
              p.accentColorId,
              p.pattern,
              p.protectionTier,
              p.deviceModel,
              p.stamp
            )
          }
          activeSeriesFilter={seriesFilter}
          onSeriesFilterChange={setSeriesFilter}
        />

        <CustomizerStudio
          state={customizerState}
          onChange={setCustomizerState}
          onAddCustomToCart={handleAddCustomToCart}
          justAdded={justAddedCustom}
        />

        <ChannelsAndB2BSection />
      </main>

      <footer className="border-t border-zinc-900/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-display text-lg font-bold text-[#141416]">KINETA</div>
            <p className="text-xs text-zinc-500 mt-1">
              Holistic protection for phones, earbuds, laptops, and insulated bottles. 1-year manufacturing defect warranty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600">
            <a href="#shop" className="hover:text-[#141416]">
              Catalog
            </a>
            <a href="#customize" className="hover:text-[#141416]">
              Custom Studio
            </a>
            <a href="#b2b" className="hover:text-[#141416]">
              B2B &amp; Schools
            </a>
            <a href="#popups" className="hover:text-[#141416]">
              Pop-Up Stores
            </a>
            <button
              type="button"
              onClick={() => setIsConciergeOpen(true)}
              className="hover:text-[#141416] cursor-pointer"
            >
              Gear Specialist
            </button>
            <button
              type="button"
              onClick={() => setIsBmcOpen(true)}
              className="text-[#2563EB] hover:underline cursor-pointer"
            >
              Business Model Canvas
            </button>
          </div>
        </div>
      </footer>

      <ProductModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={addItemToCart}
        onOpenInStudio={(p, selectedShell, selectedTier, selectedModel) =>
          scrollToStudio(
            p.category,
            selectedShell,
            p.accentColorId,
            p.pattern,
            selectedTier,
            selectedModel,
            p.stamp
          )
        }
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      <ConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      <BmcReferenceModal isOpen={isBmcOpen} onClose={() => setIsBmcOpen(false)} />

      {/* Compact Gear Specialist Trigger */}
      {!isConciergeOpen && !isCartOpen && (
        <button
          type="button"
          onClick={() => setIsConciergeOpen(true)}
          aria-label="Open Gear Specialist"
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Gear Specialist</span>
        </button>
      )}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 right-5 z-40 bg-[#141416] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-3"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-[#60A5FA] hover:underline font-semibold cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
