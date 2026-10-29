import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { MenuCategoryType, DietaryTag, MenuItem } from '../types/cafe';
import {
  X,
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Sparkles,
  Check,
  Edit2,
  AlertCircle,
} from 'lucide-react';

export const OwnerEditModal: React.FC = () => {
  const {
    cafeInfo,
    updateCafeInfo,
    menuItems,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    resetToInitialData,
    isOwnerModeOpen,
    setIsOwnerModeOpen,
    currency,
    setCurrency,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'prices' | 'add-item'>('prices');
  const [saveToast, setSaveToast] = useState(false);

  // Form states for general info
  const [name, setName] = useState(cafeInfo.name);
  const [tagline, setTagline] = useState(cafeInfo.tagline);
  const [announcement, setAnnouncement] = useState(cafeInfo.announcement || '');
  const [phone, setPhone] = useState(cafeInfo.phone);
  const [street, setStreet] = useState(cafeInfo.address.street);

  // Form states for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'food' | 'drink'>('food');
  const [newItemCategory, setNewItemCategory] = useState<MenuCategoryType>('beachside-specials');
  const [newItemPrice, setNewItemPrice] = useState(14.5);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  );

  if (!isOwnerModeOpen) return null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateCafeInfo({
      name,
      tagline,
      announcement,
      phone,
      address: {
        ...cafeInfo.address,
        street,
      },
    });
    triggerToast();
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemDesc.trim()) return;

    addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      menuType: newItemType,
      description: newItemDesc.trim(),
      price: Number(newItemPrice),
      image: newItemImage,
      dietaryTags: ['chef-special'],
      allergens: [],
      isAvailable: true,
      isPopular: false,
    });

    setNewItemName('');
    setNewItemDesc('');
    triggerToast();
    setActiveTab('prices');
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">
                Café Owner Management Dashboard
              </h2>
              <p className="text-xs text-stone-400">
                Easily update menu prices, items, hours, and announcements
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOwnerModeOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close owner settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-stone-200 bg-stone-50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'prices'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Menu Prices &amp; Availability
          </button>
          <button
            onClick={() => setActiveTab('add-item')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'add-item'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            + Add New Item
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'info'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Café Details &amp; Banner
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'hours'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Opening Hours
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {saveToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Updates saved successfully! (Stored in browser local storage)</span>
            </div>
          )}

          {/* TAB 1: MENU PRICES & AVAILABILITY */}
          {activeTab === 'prices' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quick Menu Price &amp; Stock Editor
                  </h3>
                  <p className="text-xs text-stone-500">
                    Change prices or mark items as Sold Out in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 font-bold"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="A$">A$ (AUD)</option>
                  </select>
                </div>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 max-h-[420px] overflow-y-auto">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white hover:bg-stone-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                        <div className="text-[11px] text-stone-400 capitalize">
                          {item.menuType} · {item.category.replace('-', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Price editor */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-stone-500">{currency}</span>
                        <input
                          type="number"
                          step="0.25"
                          value={item.price}
                          onChange={(e) =>
                            updateMenuItem(item.id, { price: parseFloat(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 border border-stone-300 rounded-lg text-right font-mono font-bold text-xs"
                        />
                      </div>

                      {/* Stock availability toggle */}
                      <button
                        onClick={() =>
                          updateMenuItem(item.id, { isAvailable: item.isAvailable === false ? true : false })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          item.isAvailable !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.isAvailable !== false ? 'In Stock' : 'Sold Out'}
                      </button>

                      {/* Delete item if custom */}
                      {item.id.startsWith('custom') && (
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW ITEM */}
          {activeTab === 'add-item' && (
            <form onSubmit={handleAddItem} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Dish or Beverage</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Mango Tart"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Menu Type
                  </label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  >
                    <option value="food">Food</option>
                    <option value="drink">Drink / Coffee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  >
                    {newItemType === 'food' ? (
                      <>
                        <option value="beachside-specials">Beachside Specials</option>
                        <option value="starters">Starters</option>
                        <option value="snacks">Snacks</option>
                        <option value="burgers-sandwiches">Burgers &amp; Sandwiches</option>
                        <option value="pizzas">Pizzas</option>
                        <option value="pasta">Pasta</option>
                        <option value="main-courses">Main Courses</option>
                        <option value="desserts">Desserts</option>
                      </>
                    ) : (
                      <>
                        <option value="coffee-hot">Hot Coffee</option>
                        <option value="coffee-cold">Cold &amp; Iced Coffee</option>
                        <option value="tea">Tea</option>
                        <option value="fresh-juices">Fresh Juices</option>
                        <option value="mocktails">Mocktails</option>
                        <option value="smoothies">Smoothies</option>
                        <option value="milkshakes">Milkshakes</option>
                        <option value="beverages">Other Beverages</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Appetizing description of ingredients and coastal flavors..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Publish to Menu
              </button>
            </form>
          )}

          {/* TAB 3: CAFÉ DETAILS & BANNER */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Café Info &amp; Banner</h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Announcement Banner (Top of page)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🌊 Sunset Happy Hour 4:30 - 6:30 PM..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Café Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          )}

          {/* TAB 4: OPENING HOURS */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Opening Hours by Day</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(cafeInfo.hours).map(([day, val]) => (
                  <div key={day} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="block font-bold text-slate-800 capitalize mb-1">{day}</label>
                    <input
                      type="text"
                      defaultValue={val}
                      onBlur={(e) => {
                        updateCafeInfo({
                          hours: {
                            ...cafeInfo.hours,
                            [day]: e.target.value,
                          },
                        });
                        triggerToast();
                      }}
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Revert all menu items and cafe settings back to original defaults?')) {
                resetToInitialData();
                setIsOwnerModeOpen(false);
              }
            }}
            className="flex items-center gap-1.5 text-stone-500 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>

          <button
            onClick={() => setIsOwnerModeOpen(false)}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};
