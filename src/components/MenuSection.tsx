import React, { useMemo } from 'react';
import { useCafe } from '../context/CafeContext';
import { DietaryTag, FoodCategory, DrinkCategory, MenuItem } from '../types/cafe';
import {
  Utensils,
  Coffee,
  Search,
  Filter,
  Heart,
  Plus,
  Check,
  Sparkles,
  Flame,
  Leaf,
  AlertCircle,
  Clock,
  Eye,
  Info,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  label: string;
  icon?: string;
}

const FOOD_CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'beachside-specials', label: 'Beachside Specials' },
  { id: 'starters', label: 'Starters' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'burgers-sandwiches', label: 'Burgers & Sandwiches' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'main-courses', label: 'Main Courses' },
  { id: 'desserts', label: 'Desserts' },
];

const DRINK_CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All Beverages' },
  { id: 'coffee-hot', label: 'Hot Coffee' },
  { id: 'coffee-cold', label: 'Cold & Iced Coffee' },
  { id: 'tea', label: 'Tea & Infusions' },
  { id: 'fresh-juices', label: 'Fresh Juices' },
  { id: 'mocktails', label: 'Beach Mocktails' },
  { id: 'smoothies', label: 'Smoothies' },
  { id: 'milkshakes', label: 'Milkshakes' },
  { id: 'beverages', label: 'Other Beverages' },
];

const DIETARY_FILTERS: { tag: DietaryTag; label: string }[] = [
  { tag: 'vegetarian', label: 'Vegetarian' },
  { tag: 'vegan', label: 'Vegan' },
  { tag: 'gluten-free', label: 'Gluten-Free' },
  { tag: 'spicy', label: 'Spicy' },
  { tag: 'chef-special', label: "Chef's Special" },
];

export const MenuSection: React.FC = () => {
  const {
    menuItems,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDietaryTags,
    toggleDietaryTag,
    clearFilters,
    setSelectedItemForModal,
    addToCart,
    toggleFavorite,
    isFavorite,
    currency,
  } = useCafe();

  // Determine if active view is food or drinks
  const isDrinksActive = activeTab === 'drinks';
  const categories = isDrinksActive ? DRINK_CATEGORIES : FOOD_CATEGORIES;

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Menu Type Filter
      const targetType = isDrinksActive ? 'drink' : 'food';
      if (item.menuType !== targetType) return false;

      // 2. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesAllergens = item.allergens.some((a) => a.toLowerCase().includes(query));
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesAllergens && !matchesCategory) {
          return false;
        }
      }

      // 4. Dietary Tag Filters
      if (selectedDietaryTags.length > 0) {
        const hasAllSelected = selectedDietaryTags.every((tag) =>
          item.dietaryTags.includes(tag)
        );
        if (!hasAllSelected) return false;
      }

      return true;
    });
  }, [menuItems, isDrinksActive, selectedCategory, searchQuery, selectedDietaryTags]);

  const handleSelectTab = (type: 'food' | 'drinks') => {
    setActiveTab(type);
    setSelectedCategory('all');
  };

  return (
    <section id="menu-section" className="py-8 lg:py-12 bg-[#FCE7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Segmented Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-800">
              Fresh &amp; Artisanal Daily
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1">
              {isDrinksActive ? 'Beachside Drinks & Coffee Bar' : 'Fresh Coastal Food Menu'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              {isDrinksActive
                ? 'From Ethiopian single-origin espresso and sea-salt iced lattes to refreshing fresh cold-pressed juices and craft mocktails.'
                : 'Artisan wood-fired pizzas, Maine lobster brioche rolls, fresh ocean catch, handmade pasta, and decadent desserts.'}
            </p>
          </div>

          {/* Segmented Control between Food & Drinks */}
          <div className="inline-flex p-1 bg-stone-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => handleSelectTab('food')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                !isDrinksActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-4 h-4 text-teal-700" />
              <span>Food Menu</span>
            </button>
            <button
              onClick={() => handleSelectTab('drinks')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isDrinksActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Coffee className="w-4 h-4 text-teal-700" />
              <span>Drinks &amp; Coffee</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Dietary Filter Controls */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={isDrinksActive ? 'Search coffees, tea, smoothies...' : 'Search lobster roll, pizza, pasta...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/50 text-slate-900 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Segmented Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs text-stone-500 font-medium shrink-0 flex items-center gap-1 pl-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                Filter:
              </span>
              {DIETARY_FILTERS.map(({ tag, label }) => {
                const isActive = selectedDietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-teal-800 text-white'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {tag === 'vegetarian' || tag === 'vegan' ? (
                      <Leaf className={`w-3 h-3 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                    ) : tag === 'spicy' ? (
                      <Flame className={`w-3 h-3 ${isActive ? 'text-white' : 'text-rose-500'}`} />
                    ) : (
                      <Sparkles className={`w-3 h-3 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}

              {(selectedDietaryTags.length > 0 || searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 text-xs text-teal-800 hover:underline font-medium whitespace-nowrap shrink-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Sub-Category Horizontal Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 border-b border-stone-200/80">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Category Header */}
        <div className="pt-6 pb-4 flex items-center justify-between text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 tabular-nums">{filteredItems.length}</strong> items
            </span>
            {selectedCategory !== 'all' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize font-semibold text-teal-800">
                  {categories.find((c) => c.id === selectedCategory)?.label}
                </span>
              </>
            )}
          </div>
          <span className="hidden sm:inline text-stone-400">
            Click any item for allergen details &amp; pairing notes
          </span>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-3">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-800">
              No matching menu items found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              We couldn't find items matching your search or dietary filter. Try clearing filters to explore our full menu.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg"
            >
              Show Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Sub-component for individual card with anti-slop rules (unboxed metadata, clear hierarchy, robust fallbacks)
const MenuItemCard: React.FC<{ item: MenuItem; currency: string }> = ({ item, currency }) => {
  const { setSelectedItemForModal, addToCart, toggleFavorite, isFavorite } = useCafe();
  const favorited = isFavorite(item.id);

  return (
    <div
      onClick={() => setSelectedItemForModal(item)}
      className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
    >
      {/* Photo Section with Fallback Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Resilient fallback styled container */}
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 to-teal-50 -z-10 flex items-center justify-center text-stone-400">
          <Utensils className="w-8 h-8 opacity-40" />
        </div>

        {/* Quick Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-stone-600 hover:text-rose-600 flex items-center justify-center shadow-sm transition-transform active:scale-90"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Popular / Chef Special Marker */}
        {item.isPopular && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-teal-900/90 backdrop-blur-sm text-teal-100 text-[10px] font-semibold tracking-wide uppercase">
            Guest Favorite
          </div>
        )}

        {/* Preparation time subtle indicator */}
        {item.prepTimeMinutes && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{item.prepTimeMinutes} min</span>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata (NO PILL BADGE SANDWICH - Following Section A Zero-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-stone-500 mb-1">
            {item.dietaryTags.slice(0, 3).map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span className={tag === 'vegetarian' || tag === 'vegan' ? 'text-emerald-700 font-semibold' : tag === 'spicy' ? 'text-rose-600 font-semibold' : ''}>
                  {tag.replace('-', ' ')}
                </span>
              </React.Fragment>
            ))}
            {item.caffeineLevel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.caffeineLevel} Caffeine</span>
              </>
            )}
          </div>

          {/* Item Name */}
          <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
            {item.name}
          </h3>

          {/* Item Description */}
          <p className="text-xs text-stone-600 leading-relaxed mt-1 line-clamp-2">
            {item.description}
          </p>

          {/* Allergen Warning Note (if any) */}
          {item.allergens.length > 0 && (
            <p className="text-[10px] text-amber-800/90 mt-1.5 truncate">
              Contains: {item.allergens.join(', ')}
            </p>
          )}
        </div>

        {/* Card Footer: Price and Add to Order Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 block">
              Price
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {currency}{item.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItemForModal(item);
              }}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              title="View details & allergens"
              aria-label="View details"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item, 1);
              }}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs transition-transform active:scale-95 shadow-sm"
              aria-label={`Add ${item.name} to order`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
