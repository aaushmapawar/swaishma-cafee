import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  X,
  Heart,
  Plus,
  Minus,
  Clock,
  Flame,
  Leaf,
  AlertTriangle,
  Sparkles,
  Utensils,
  Share2,
  Check,
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItemForModal,
    setSelectedItemForModal,
    addToCart,
    toggleFavorite,
    isFavorite,
    currency,
  } = useCafe();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [copied, setCopied] = useState(false);

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;
  const favorited = isFavorite(item.id);

  const handleAdd = () => {
    addToCart(item, quantity, specialInstructions);
    setSelectedItemForModal(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-stone-200 animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal Header Media */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedItemForModal(null)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Actions overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Share dish"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Title & Category over image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="text-xs uppercase font-semibold tracking-wider text-teal-300">
              {item.category.replace('-', ' ')}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">{item.name}</h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Unboxed Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium pb-2 border-b border-stone-100">
            {item.calories && (
              <>
                <span className="tabular-nums font-semibold text-slate-800">{item.calories} kcal</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            {item.prepTimeMinutes && (
              <>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  {item.prepTimeMinutes} min preparation
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            {item.caffeineLevel && (
              <>
                <span>{item.caffeineLevel} Caffeine</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            <span className="text-teal-800 font-semibold capitalize">
              {item.menuType === 'food' ? 'Beachside Kitchen' : 'Artisan Beverage'}
            </span>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-1">
              Description
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Dietary Labels & Allergens */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider">
              Dietary Profile &amp; Allergens
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {item.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-800 flex items-center gap-1.5"
                >
                  {tag === 'vegetarian' || tag === 'vegan' ? (
                    <Leaf className="w-3 h-3 text-emerald-600" />
                  ) : tag === 'spicy' ? (
                    <Flame className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  )}
                  <span className="capitalize">{tag.replace('-', ' ')}</span>
                </span>
              ))}
            </div>

            {item.allergens.length > 0 ? (
              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Contains Allergens: </strong>
                  <span>{item.allergens.join(', ')}. Please inform our team of severe sensitivities.</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-medium">
                No major common allergens noted for this preparation.
              </p>
            )}
          </div>

          {/* Fresh Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-1.5">
                Key Ingredients
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2 py-0.5 rounded-md text-xs bg-stone-50 border border-stone-200 text-stone-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chef Pairing Recommendation */}
          {item.pairingRecommendation && (
            <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-xs text-teal-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Chef's Coastal Pairing: </strong>
                <span>{item.pairingRecommendation}</span>
              </div>
            </div>
          )}

          {/* Special Preparation Note Input */}
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Special Preparation Request (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. dressing on the side, extra ice, oat milk..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/50"
            />
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-2 text-xs sm:text-sm font-bold tabular-nums text-slate-900 min-w-[28px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span>Add to Table Order</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-bold">
              {currency}{(item.price * quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
