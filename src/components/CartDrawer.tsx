import { CheckCircle2, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ACCENT_COLORS, SHELL_COLORS, getSwatchName } from '../data/catalog';
import { CartItem, OrderReceipt } from '../types/store';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 65;

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'receipt'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash on Delivery'>('Card');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.95;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !address.trim()) return;

    const newReceipt: OrderReceipt = {
      orderId: `KN-${Math.floor(1000 + Math.random() * 9000)}`,
      warrantyCode: `WR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customerName: customerName.trim(),
      email: email.trim(),
      address: address.trim(),
      paymentMethod,
      items: [...items],
      subtotal,
      shipping,
      total,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setReceipt(newReceipt);
    onClearCart();
    setStep('receipt');
  };

  const handleCloseDrawer = () => {
    if (step === 'receipt') {
      setStep('cart');
      setReceipt(null);
      setCustomerName('');
      setEmail('');
      setAddress('');
    } else if (step === 'checkout' && items.length === 0) {
      setStep('cart');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-zinc-900/10">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-900/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#141416]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#141416]">
              {step === 'cart' && 'Your Bag'}
              {step === 'checkout' && 'Checkout'}
              {step === 'receipt' && 'Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close bag drawer"
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-[#141416] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'receipt' && receipt ? (
            <div className="space-y-5">
              <div className="p-5 bg-[#F7F7F5] rounded-xl border border-zinc-900/10 space-y-2">
                <div className="flex items-center gap-2 text-[#1D4ED8] text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>Order #{receipt.orderId} Confirmed — Preparing Shipment</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Confirmation sent to <span className="font-medium text-[#141416]">{receipt.email}</span>.
                  Payment method: <span className="font-medium text-[#141416]">{receipt.paymentMethod}</span>.
                </p>
                <div className="pt-2 border-t border-zinc-900/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">1-Year Defect Warranty Code</span>
                  <span className="font-mono font-semibold text-[#141416]">{receipt.warrantyCode}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-500">Items Ordered</h3>
                {receipt.items.map((item) => (
                  <div key={item.cartKey} className="flex items-center justify-between text-sm py-2 border-b border-zinc-900/8">
                    <div>
                      <div className="font-medium text-[#141416]">
                        {item.quantity} × {item.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {getSwatchName(SHELL_COLORS, item.shellColorId)} · {item.pattern}
                        {item.engraving ? ` · "${item.engraving}"` : ''}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-[#141416]">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm pt-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {receipt.shipping === 0 ? 'Free' : `$${receipt.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[#141416] pt-2 border-t border-zinc-900/10">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">${receipt.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#141416] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-zinc-300 mb-3" aria-hidden="true" />
              <p className="font-display text-lg font-semibold text-[#141416]">Your bag is empty</p>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                Add a ready-to-ship Designer Series protector or customize your own gear in the Studio.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {/* Free shipping threshold meter */}
              <div className="p-3.5 bg-[#F7F7F5] rounded-xl border border-zinc-900/8">
                <div className="text-xs font-medium text-[#141416]">
                  {remainingForFreeShipping === 0
                    ? 'Unlocked free standard shipping + 1-Year Warranty'
                    : `Add $${remainingForFreeShipping.toFixed(2)} more for free shipping ($65+)`}
                </div>
                <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1D4ED8] transition-all duration-200"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-zinc-900/10">
                {items.map((item) => (
                  <div key={item.cartKey} className="py-4 flex gap-4">
                    <div className="w-20 h-20 bg-[#EFEFED] rounded-xl flex items-center justify-center p-1.5 shrink-0">
                      <ProductVisual
                        category={item.category}
                        shellColorId={item.shellColorId}
                        accentColorId={item.accentColorId}
                        pattern={item.pattern}
                        protectionTier={item.protectionTier}
                        stamp={item.stamp ?? 'None'}
                        engraving={item.engraving}
                        textLayout={item.textLayout}
                        textFont={item.textFont}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#141416] truncate">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartKey)}
                          aria-label={`Remove ${item.name}`}
                          className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-500 mt-0.5">
                        {item.deviceModel} · {item.protectionTier} · {getSwatchName(SHELL_COLORS, item.shellColorId)}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {getSwatchName(ACCENT_COLORS, item.accentColorId)} · {item.pattern}
                        {item.stamp && item.stamp !== 'None' ? ` · ${item.stamp} Stamp` : ''}
                      </div>
                      {item.engraving && (
                        <div className="text-[11px] font-mono text-[#1D4ED8] mt-0.5">
                          Text: &quot;{item.engraving}&quot; ({item.textLayout})
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-zinc-900/12 rounded-lg">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartKey, -1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-zinc-600 hover:text-[#141416] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono tabular-nums font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartKey, 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-zinc-600 hover:text-[#141416] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono tabular-nums text-sm font-semibold text-[#141416]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="p-3.5 bg-[#F7F7F5] rounded-xl text-xs text-zinc-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <span>Includes automatic 1-Year Manufacturing Defect Warranty registration.</span>
              </div>

              <div>
                <label htmlFor="chk-name" className="block text-xs font-semibold text-zinc-600 mb-1">
                  Full Name
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jordan Lee"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-900/15 rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-semibold text-zinc-600 mb-1">
                  Email Address (for tracking &amp; warranty)
                </label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-900/15 rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label htmlFor="chk-addr" className="block text-xs font-semibold text-zinc-600 mb-1">
                  Shipping Address &amp; Postal Code
                </label>
                <textarea
                  id="chk-addr"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace, Apt 4B, 94107"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-900/15 rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-zinc-600 mb-1.5">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Card', 'Cash on Delivery'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[#1D4ED8] bg-[#1D4ED8]/5 text-[#141416]'
                          : 'border-zinc-900/12 text-zinc-600 hover:border-zinc-900/30'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'receipt' && (
          <div className="px-6 py-5 border-t border-zinc-900/10 bg-[#F7F7F5] space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#141416] pt-1.5 border-t border-zinc-900/10">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 text-sm font-semibold text-zinc-700 bg-white border border-zinc-900/15 rounded-lg hover:bg-zinc-100 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors cursor-pointer"
                >
                  Place Order — ${total.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
