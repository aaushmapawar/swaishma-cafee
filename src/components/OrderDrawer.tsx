import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Send,
  CheckCircle2,
  Utensils,
  Coffee,
  Waves,
} from 'lucide-react';

export const OrderDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    currency,
    cafeInfo,
  } = useCafe();

  const [tableNumber, setTableNumber] = useState('Deck Table 4 (Oceanfront)');
  const [guestName, setGuestName] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const tipAmount = (cartTotal * tipPercent) / 100;
  const grandTotal = cartTotal + tipAmount;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  const handleSendToWhatsApp = () => {
    const lines = cart.map(
      (c) => `• ${c.quantity}x ${c.item.name} (${currency}${(c.item.price * c.quantity).toFixed(2)})${c.specialInstructions ? ` [Note: ${c.specialInstructions}]` : ''}`
    );
    const message = `Hello Swaishma Café! 👋\nHere is my table order for *${tableNumber}*:\n\n${lines.join('\n')}\n\n*Total:* ${currency}${grandTotal.toFixed(2)}${guestName ? `\n*Guest:* ${guestName}` : ''}`;
    const url = `https://wa.me/${cafeInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-slate-900">
                Your Table Order
              </h2>
              <p className="text-xs text-stone-500 tabular-nums">
                {cartItemCount} item{cartItemCount === 1 ? '' : 's'} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderPlaced(false);
            }}
            className="p-1.5 text-stone-400 hover:text-slate-900 rounded-lg transition-colors"
            aria-label="Close order drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {orderPlaced ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Order Sent to Barista &amp; Kitchen!
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Your order is being prepared fresh. Our seaside servers will deliver it directly to{' '}
                <strong className="text-teal-900">{tableNumber}</strong> in ~12-15 minutes.
              </p>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={handleSendToWhatsApp}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Copy to Café WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    setOrderPlaced(false);
                    setIsCartOpen(false);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 py-1"
                >
                  Close &amp; Back to Menu
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Utensils className="w-5 h-5" />
              </div>
              <p className="text-sm font-serif font-bold text-slate-800">Your table order is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Browse our fresh coastal food and drinks menu, and click "Add" to start your table order.
              </p>
            </div>
          ) : (
            <>
              {/* Table Selection */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200/80 space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Where are you seated?
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="Deck Table 4 (Oceanfront Terrace)">Deck Table 4 (Oceanfront Terrace)</option>
                  <option value="Deck Table 8 (Panoramic Sunset View)">Deck Table 8 (Panoramic Sunset View)</option>
                  <option value="Rattan Lounge Table 12 (Shaded Breezy)">Rattan Lounge Table 12 (Shaded Breezy)</option>
                  <option value="Sunset Cabana 1">Sunset Cabana 1 (Private)</option>
                  <option value="Barista Roastery High-Top 3">Barista Roastery High-Top 3</option>
                  <option value="Beachside Takeaway (Sandy Shore)">Beachside Takeaway (Pack for Beach)</option>
                </select>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                />
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {cart.map(({ item, quantity, specialInstructions }) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className="font-serif font-bold text-slate-900 tabular-nums">
                          {currency}{(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 capitalize">
                        {item.menuType} · {currency}{item.price.toFixed(2)} each
                      </p>
                      {specialInstructions && (
                        <p className="text-[10px] text-teal-800 italic mt-0.5">
                          Note: "{specialInstructions}"
                        </p>
                      )}

                      {/* Quantity row */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 hover:bg-stone-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 text-stone-600" />
                          </button>
                          <span className="px-2 font-bold tabular-nums text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 hover:bg-stone-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip Selection */}
              <div className="pt-2 border-t border-stone-100">
                <span className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Seaside Hospitality Gratuity:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[10, 15, 18, 20].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`py-1.5 rounded-lg font-semibold transition-colors ${
                        tipPercent === pct
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Total & Checkout */}
        {!orderPlaced && cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-3">
            <div className="space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{currency}{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip ({tipPercent}%)</span>
                <span className="font-mono tabular-nums">{currency}{tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-stone-200">
                <span>Total Due</span>
                <span className="font-serif text-base tabular-nums">{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
            >
              Confirm Order for {tableNumber.split(' ')[0]} {tableNumber.split(' ')[1]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
