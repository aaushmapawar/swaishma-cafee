import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Waves, Heart, Instagram, Facebook, Compass, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { cafeInfo, setActiveTab, setIsOwnerModeOpen } = useCafe();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 lg:pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">
                {cafeInfo.name}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {cafeInfo.tagline}. Savoring coastal mornings, artisan roasts, and ocean sunsets since 2018.
            </p>
            <div className="flex items-center gap-3 text-stone-400 pt-1">
              <a
                href={cafeInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={cafeInfo.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={cafeInfo.socialLinks.tripadvisor}
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-400 transition-colors"
                aria-label="Tripadvisor"
              >
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-white font-bold text-sm">Quick Links</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-white transition-colors"
                >
                  Home &amp; Highlights
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('food')}
                  className="hover:text-white transition-colors"
                >
                  Beachside Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('drinks')}
                  className="hover:text-white transition-colors"
                >
                  Drinks &amp; Roastery Coffee
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tour')}
                  className="hover:text-white transition-colors"
                >
                  Virtual Café Tour
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="hover:text-white transition-colors"
                >
                  Guest Ratings &amp; Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-white font-bold text-sm">Find Us</h4>
            <div className="space-y-2 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {cafeInfo.address.street}, {cafeInfo.address.city}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{cafeInfo.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">{cafeInfo.email}</span>
              </p>
            </div>
          </div>

          {/* Hours Summary & Owner Portal */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-white font-bold text-sm">Daily Seaside Hours</h4>
            <p className="text-stone-400">
              Open 7 Days a week from <strong className="text-stone-200">11:00 AM to 9:00 PM</strong>.
            </p>
            <p className="text-stone-500 text-[11px]">
              Walk-ins welcome on terrace. Reservations recommended for sunset hours.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsOwnerModeOpen(true)}
                className="text-stone-400 hover:text-teal-400 underline underline-offset-4 text-[11px] transition-colors"
              >
                Owner Portal &amp; Menu Editor
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} {cafeInfo.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with fresh sea breeze by Anjuna Beach, Goa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
