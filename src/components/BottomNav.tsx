import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Home, UtensilsCrossed, Coffee, Video, MapPin } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsTourModalOpen } = useCafe();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCE7F3]/95 backdrop-blur-md border-t border-pink-300/80 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'home' ? 'text-teal-800' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        <button
          onClick={() => setActiveTab('food')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'food' ? 'text-teal-800' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Food Menu"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'food' ? 'font-bold' : 'font-medium'}`}>
            Food
          </span>
        </button>

        <button
          onClick={() => setActiveTab('drinks')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'drinks' ? 'text-teal-800' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Drinks Menu"
        >
          <Coffee className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'drinks' ? 'font-bold' : 'font-medium'}`}>
            Drinks
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tour');
            setIsTourModalOpen(true);
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'tour' ? 'text-teal-800' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Watch Café Tour"
        >
          <div className="relative">
            <Video className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'tour' ? 'font-bold' : 'font-medium'}`}>
            Tour
          </span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'info' ? 'text-teal-800' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Location and Hours"
        >
          <MapPin className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'info' ? 'font-bold' : 'font-medium'}`}>
            Info
          </span>
        </button>
      </div>
    </nav>
  );
};
