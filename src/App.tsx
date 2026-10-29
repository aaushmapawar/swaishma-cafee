/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CafeInfoSection } from './components/CafeInfoSection';
import { CafeTourModal } from './components/CafeTourModal';
import { TourSection } from './components/TourSection';
import { ItemDetailModal } from './components/ItemDetailModal';
import { OwnerEditModal } from './components/OwnerEditModal';
import { OrderDrawer } from './components/OrderDrawer';
import { DirectionsModal } from './components/DirectionsModal';
import { ReservationModal } from './components/ReservationModal';
import { Footer } from './components/Footer';
import { Play, Sparkles, ArrowRight, Utensils, Coffee, Star, MapPin, Waves } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsTourModalOpen, setIsDirectionsModalOpen, currency } = useCafe();

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCE7F3] text-slate-900 selection:bg-pink-300 selection:text-pink-950">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection />

            {/* Quick Teaser: Featured Menu Preview */}
            <section className="py-10 bg-[#FDF2F8] border-y border-pink-300/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-teal-800">
                      Signature Flavors
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      Taste the Coastline
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      Our guests’ most celebrated ocean dishes, artisanal lattes, and tropical mocktails.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('food')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-100/70 hover:bg-pink-100 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      <Utensils className="w-3.5 h-3.5 text-teal-700" />
                      <span>All Food ({20}+)</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('drinks')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Beverages &amp; Coffee</span>
                    </button>
                  </div>
                </div>

                {/* 3 Featured Signature Dishes/Drinks Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Lobster Roll */}
                  <div
                    onClick={() => setActiveTab('food')}
                    className="bg-white/90 rounded-2xl overflow-hidden border border-pink-200/70 group cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-pink-50">
                      <img
                        src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
                        alt="Toasted Brioche Lobster Roll"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-teal-900 text-teal-100 text-[10px] font-semibold tracking-wide uppercase">
                        Guest Favorite
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                          Beachside Special
                        </span>
                        <span className="font-serif font-bold text-slate-900 tabular-nums">{currency}590</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                        Toasted Brioche Lobster Roll
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        Chilled Maine lobster tossed in brown butter emulsion, Meyer lemon zest, and fresh tarragon.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Sea Salt Foam Iced Latte */}
                  <div
                    onClick={() => setActiveTab('drinks')}
                    className="bg-white/90 rounded-2xl overflow-hidden border border-pink-200/70 group cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-pink-50">
                      <img
                        src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80"
                        alt="Sea Salt Foam Iced Latte"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-amber-900 text-amber-100 text-[10px] font-semibold tracking-wide uppercase">
                        Signature Roast
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                          Cold Coffee
                        </span>
                        <span className="font-serif font-bold text-slate-900 tabular-nums">{currency}280</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                        Sea Salt Caramel Foam Iced Latte
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        Iced blonde espresso and creamy oat milk topped with aerated sweet cream sea-salt caramel cold foam.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Seafood Platter */}
                  <div
                    onClick={() => setActiveTab('food')}
                    className="bg-white/90 rounded-2xl overflow-hidden border border-pink-200/70 group cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-pink-50">
                      <img
                        src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
                        alt="Swaishma Coastal Seafood Platter"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-teal-900 text-teal-100 text-[10px] font-semibold tracking-wide uppercase">
                        Chef's Special
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                          Fresh Catch
                        </span>
                        <span className="font-serif font-bold text-slate-900 tabular-nums">{currency}680</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                        Swaishma Coastal Seafood Platter
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        Charred sea prawns, crisp calamari rings, herb-crusted white fish with house sea-salt aioli.
                      </p>
                    </div>
                  </div>
                </div>


                <div className="text-center mt-8">
                  <button
                    onClick={() => setActiveTab('food')}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-4"
                  >
                    <span>View our full menu with all 8 food categories &amp; 8 beverage bars</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Virtual Tour Banner Callout */}
            <section className="py-12 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                      Virtual Experience
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold">
                      Explore Swaishma Café with our Video Tour
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                      Take a stroll across our open-air wooden deck, peek into our espresso roastery bar, and feel the warm Arabian Sea breeze in Goa before you arrive.
                    </p>
                  </div>
                  <div className="md:col-span-4 flex justify-start md:justify-end">
                    <button
                      onClick={() => setIsTourModalOpen(true)}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-slate-900 font-bold text-sm shadow-xl transition-transform hover:scale-105 active:scale-95"
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                      <span>Watch Café Tour Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Section on Home */}
            <ReviewsSection />

            {/* Cafe Info & Location Section on Home */}
            <CafeInfoSection />
          </>
        )}

        {/* Tab: Food Menu */}
        {activeTab === 'food' && <MenuSection />}

        {/* Tab: Drinks Menu */}
        {activeTab === 'drinks' && <MenuSection />}

        {/* Tab: Tour */}
        {activeTab === 'tour' && <TourSection />}

        {/* Tab: Reviews */}
        {activeTab === 'reviews' && <ReviewsSection />}

        {/* Tab: Info & Directions */}
        {activeTab === 'info' && <CafeInfoSection />}
      </main>

      {/* Persistent Modals & Drawers */}
      <ItemDetailModal />
      <CafeTourModal />
      <OwnerEditModal />
      <OrderDrawer />
      <DirectionsModal />
      <ReservationModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <CafeProvider>
      <MainContent />
    </CafeProvider>
  );
}
