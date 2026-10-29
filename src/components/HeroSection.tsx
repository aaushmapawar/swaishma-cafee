import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Play, Compass, Utensils, Star, MapPin, Clock, Sun, Waves, Sparkles, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    cafeInfo,
    setActiveTab,
    setIsTourModalOpen,
    setIsDirectionsModalOpen,
    setIsReservationModalOpen,
    isOpenNow,
    averageRating,
    totalRatingsCount,
  } = useCafe();

  return (
    <section className="relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Welcoming Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Status & Location Bar (Clean unboxed text metadata) */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOpenNow ? 'bg-emerald-100/90 text-emerald-800' : 'bg-stone-200 text-stone-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                {isOpenNow ? 'Open Now' : 'Opens 11:00 AM'}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1 text-stone-700">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                11:00 AM – 9:00 PM Daily
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1 text-stone-700 truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                {cafeInfo.address.neighborhood}, Goa
              </span>
            </div>

            {/* Welcoming Headline & Tagline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
                Warm Ocean Breezes &amp; Artisanal Flavors by the Sea
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                {cafeInfo.shortDescription}
              </p>
            </div>

            {/* Clear Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button 1: Explore Menu */}
              <button
                onClick={() => setActiveTab('food')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-sm sm:text-base shadow-md shadow-teal-950/10 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Menu</span>
              </button>

              {/* Button 2: Watch Café Tour */}
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-stone-50 text-slate-800 font-semibold text-sm sm:text-base border border-stone-300/80 shadow-sm hover:border-teal-700 hover:text-teal-800 transition-all active:scale-[0.98] group"
              >
                <div className="w-5 h-5 rounded-full bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-teal-700 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Café Tour</span>
              </button>

              {/* Button 3: Get Directions */}
              <button
                onClick={() => setIsDirectionsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-medium text-sm sm:text-base border border-amber-200/80 transition-all active:scale-[0.98]"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Trust and Social Proof Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-600 border-t border-pink-200/60">
              <button
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1.5 hover:text-teal-800 transition-colors group text-left"
              >
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <span className="font-bold text-slate-900 tabular-nums">{averageRating}</span>
                <span>/ 5.0</span>
                <span className="text-stone-500 underline underline-offset-2 group-hover:text-teal-700">
                  ({totalRatingsCount} verified guest reviews)
                </span>
              </button>
              <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-stone-300" />
              <div className="flex items-center gap-1.5 text-stone-600">
                <Waves className="w-4 h-4 text-teal-600" />
                <span>Beachfront Open-Air Seating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Beachside Photos Showcase Bento */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-950/15 border border-pink-200/70 bg-white group">
              {/* Main Feature Photo */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                  alt="Swaishma Café Oceanfront Deck with waves"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Resilient fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Fallback pattern if image is offline */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/60 via-stone-900/30 to-amber-700/20 -z-10" />

                {/* Scrim overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                        Panoramic Shoreline
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold">
                        The Sunset Deck
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                        Step off the warm sand right onto our teakwood patio.
                      </p>
                    </div>

                    {/* Quick Play Pill */}
                    <button
                      onClick={() => setIsTourModalOpen(true)}
                      className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-teal-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 shrink-0"
                      aria-label="Play tour"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5 text-teal-800" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Secondary Snapshot Cards */}
              <div className="grid grid-cols-3 divide-x divide-pink-100 bg-[#FFF7F8] text-center p-3 text-xs">
                <div className="p-1.5">
                  <span className="font-bold text-slate-900 block font-serif text-sm">Artisan</span>
                  <span className="text-stone-500 text-[11px]">House Roastery</span>
                </div>
                <div className="p-1.5">
                  <span className="font-bold text-slate-900 block font-serif text-sm">Fresh Daily</span>
                  <span className="text-stone-500 text-[11px]">Seafood &amp; Brunch</span>
                </div>
                <div className="p-1.5">
                  <span className="font-bold text-slate-900 block font-serif text-sm">Sunset</span>
                  <span className="text-stone-500 text-[11px]">Beachside Cocktails</span>
                </div>
              </div>
            </div>

            {/* Floating Beachside Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-stone-200/80 flex items-center gap-3 max-w-[240px]">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-900">Golden Hour Seating</p>
                <p className="text-stone-500 text-[11px]">Best sunset view at 6:15 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atmosphere Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200/70 shadow-sm hover:shadow transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
              Beachfront Promenade Seating
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Dine with your toes in the sand or on our sheltered teakwood deck overlooking dolphin surf breaks.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200/70 shadow-sm hover:shadow transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
              Coastal Comfort Kitchen
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              From our famous Maine lobster rolls to wood-fired burrata pizzas, each dish is made fresh with local catch.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200/70 shadow-sm hover:shadow transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
              From Sunrise to Sunset
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Start your morning with our 20-hour cold brew and açai bowls, then unwind with sunset mocktails and ocean dinner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
