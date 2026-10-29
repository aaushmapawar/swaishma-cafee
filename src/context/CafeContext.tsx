import React, { createContext, useContext, useEffect, useState } from 'react';
import { CafeInfo, CartItem, DietaryTag, MenuItem, Review } from '../types/cafe';
import { INITIAL_CAFE_INFO, INITIAL_MENU_ITEMS, INITIAL_REVIEWS } from '../data/initialData';

interface CafeContextType {
  cafeInfo: CafeInfo;
  menuItems: MenuItem[];
  reviews: Review[];
  cart: CartItem[];
  favorites: string[];
  activeTab: 'home' | 'food' | 'drinks' | 'tour' | 'info' | 'reviews';
  selectedCategory: string;
  searchQuery: string;
  selectedDietaryTags: DietaryTag[];
  selectedItemForModal: MenuItem | null;
  isTourModalOpen: boolean;
  isDirectionsModalOpen: boolean;
  isOwnerModeOpen: boolean;
  isReservationModalOpen: boolean;
  isCartOpen: boolean;
  isOpenNow: boolean;
  currency: string;
  
  // Navigation & UI controls
  setActiveTab: (tab: 'home' | 'food' | 'drinks' | 'tour' | 'info' | 'reviews') => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleDietaryTag: (tag: DietaryTag) => void;
  clearFilters: () => void;
  setSelectedItemForModal: (item: MenuItem | null) => void;
  setIsTourModalOpen: (open: boolean) => void;
  setIsDirectionsModalOpen: (open: boolean) => void;
  setIsOwnerModeOpen: (open: boolean) => void;
  setIsReservationModalOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setCurrency: (currency: string) => void;

  // Cart & Orders
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Favorites
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  upvoteReview: (reviewId: string) => void;
  averageRating: number;
  totalRatingsCount: number;

  // Owner Management (persists to localStorage)
  updateCafeInfo: (updated: Partial<CafeInfo>) => void;
  updateMenuItem: (itemId: string, updated: Partial<MenuItem>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (itemId: string) => void;
  resetToInitialData: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cafeInfo, setCafeInfo] = useState<CafeInfo>(() => {
    try {
      const saved = localStorage.getItem('swaishma_cafe_info_v4');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('swaishma_cafe_info_v3') || localStorage.getItem('swaishma_cafe_info_v2');
      if (old) {
        const parsed = JSON.parse(old);
        return {
          ...parsed,
          phone: INITIAL_CAFE_INFO.phone,
          whatsapp: INITIAL_CAFE_INFO.whatsapp,
          hours: INITIAL_CAFE_INFO.hours,
        };
      }
      return INITIAL_CAFE_INFO;
    } catch {
      return INITIAL_CAFE_INFO;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('swaishma_menu_items_v2');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('swaishma_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('swaishma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('swaishma_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'food' | 'drinks' | 'tour' | 'info' | 'reviews'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietaryTag[]>([]);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState<boolean>(false);
  const [isOwnerModeOpen, setIsOwnerModeOpen] = useState<boolean>(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('swaishma_currency');
      return saved || '₹';
    } catch {
      return '₹';
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swaishma_cafe_info_v2', JSON.stringify(cafeInfo));
    } catch (e) {
      console.warn(e);
    }
  }, [cafeInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('swaishma_menu_items_v2', JSON.stringify(menuItems));
    } catch (e) {
      console.warn(e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('swaishma_currency', currency);
    } catch (e) {
      console.warn(e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('swaishma_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('swaishma_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('swaishma_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
  }, [favorites]);

  // Check if cafe is open right now (11:00 AM to 9:00 PM)
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;
      // 11:00 AM is 660 mins, 9:00 PM is 1260 mins
      setIsOpenNow(totalMinutes >= 660 && totalMinutes <= 1260);
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDietaryTag = (tag: DietaryTag) => {
    setSelectedDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDietaryTags([]);
  };

  // Cart actions
  const addToCart = (item: MenuItem, quantity: number = 1, instructions?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.item.id === item.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          specialInstructions: instructions || next[existingIndex].specialInstructions,
        };
        return next;
      }
      return [...prev, { item, quantity, specialInstructions: instructions }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const cartItemCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Favorites
  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Reviews calculation
  const totalRatingsCount = reviews.length;
  const averageRating = totalRatingsCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatingsCount).toFixed(1))
    : 4.9;

  const addReview = (newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const reviewObj: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      verifiedVisit: true,
    };
    setReviews((prev) => [reviewObj, ...prev]);
  };

  const upvoteReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  // Owner management actions
  const updateCafeInfo = (updated: Partial<CafeInfo>) => {
    setCafeInfo((prev) => ({ ...prev, ...updated }));
  };

  const updateMenuItem = (itemId: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updated } : item))
    );
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `custom-item-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const resetToInitialData = () => {
    setCafeInfo(INITIAL_CAFE_INFO);
    setMenuItems(INITIAL_MENU_ITEMS);
    setReviews(INITIAL_REVIEWS);
    setCart([]);
    setCurrency('₹');
    localStorage.removeItem('swaishma_cafe_info');
    localStorage.removeItem('swaishma_menu_items');
    localStorage.removeItem('swaishma_menu_items_v2');
    localStorage.removeItem('swaishma_reviews');
    localStorage.removeItem('swaishma_cart');
    localStorage.removeItem('swaishma_currency');
  };

  return (
    <CafeContext.Provider
      value={{
        cafeInfo,
        menuItems,
        reviews,
        cart,
        favorites,
        activeTab,
        selectedCategory,
        searchQuery,
        selectedDietaryTags,
        selectedItemForModal,
        isTourModalOpen,
        isDirectionsModalOpen,
        isOwnerModeOpen,
        isReservationModalOpen,
        isCartOpen,
        isOpenNow,
        currency,
        setActiveTab,
        setSelectedCategory,
        setSearchQuery,
        toggleDietaryTag,
        clearFilters,
        setSelectedItemForModal,
        setIsTourModalOpen,
        setIsDirectionsModalOpen,
        setIsOwnerModeOpen,
        setIsReservationModalOpen,
        setIsCartOpen,
        setCurrency,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        toggleFavorite,
        isFavorite,
        addReview,
        upvoteReview,
        averageRating,
        totalRatingsCount,
        updateCafeInfo,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        resetToInitialData,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
