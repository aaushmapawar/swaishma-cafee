import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Coffee, MapPin, Clock, Phone, Heart, ShoppingBag, Settings, Waves, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cafeInfo,
    activeTab,
    setActiveTab,
    cartItemCount,
    setIsCartOpen,
    favorites,
    setIsOwnerModeOpen,
    setIsReservationModalOpen,
    isOpenNow,
  } = useCafe();

  return (
    <>
      {/* Optional Announcement Banner */}
      {cafeInfo.announcement && (
        <div className="bg-teal-900 text-teal-100 text-xs px-4 py-1.5 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{cafeInfo.announcement}</span>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#FCE7F3]/95 backdrop-blur-md border-b border-pink-300/80 transition-shadow shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title (Strictly one line wordmark) */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-900/10 transition-transform group-hover:scale-105">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                {cafeInfo.name}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Clean single-line text links) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'home' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'food' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Food Menu
            </button>
            <button
              onClick={() => setActiveTab('drinks')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'drinks' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Drinks & Coffee
            </button>
            <button
              onClick={() => setActiveTab('tour')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'tour' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Café Tour
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'reviews' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'info' ? 'text-teal-800 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Location & Info
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Owner Edit Mode Toggle */}
            <button
              onClick={() => setIsOwnerModeOpen(true)}
              title="Café Owner Settings"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              aria-label="Owner Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline">Owner Edit</span>
            </button>

            {/* Table Order Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-teal-800 hover:bg-stone-100/80 rounded-lg transition-colors flex items-center justify-center"
              aria-label="View Table Order"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-700 text-white text-xs font-bold rounded-full flex items-center justify-center tabular-nums animate-in fade-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              Reserve Table
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
