import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  X,
  Navigation,
  MapPin,
  Car,
  Bike,
  Compass,
  ExternalLink,
  Check,
  Share2,
  Clock,
  Waves,
} from 'lucide-react';

export const DirectionsModal: React.FC = () => {
  const { cafeInfo, isDirectionsModalOpen, setIsDirectionsModalOpen } = useCafe();
  const [copied, setCopied] = useState(false);

  if (!isDirectionsModalOpen) return null;

  const fullAddress = `${cafeInfo.address.street}, ${cafeInfo.address.neighborhood}, ${cafeInfo.address.city}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-teal-200 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">
                Directions to {cafeInfo.name}
              </h2>
              <p className="text-xs text-teal-200">
                Anjuna Beach Shore · Near Sunset Point, North Goa
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDirectionsModalOpen(false)}
            className="p-1.5 text-teal-300 hover:text-white rounded-lg transition-colors"
            aria-label="Close directions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Quick Address Card */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800">
                  Exact Address
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {cafeInfo.address.street}
                </p>
                <p className="text-xs text-stone-600">
                  {cafeInfo.address.neighborhood}, {cafeInfo.address.city}
                </p>
                <p className="text-[11px] text-teal-800 font-medium mt-1">
                  Landmark: {cafeInfo.address.landmark}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Button: Open Google Maps */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch Google Maps GPS Navigation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Step-by-Step Directions */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Arrival &amp; Transit Options (Goa)
            </h3>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-teal-700" />
                <span>Driving from Airport / Panaji</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                From Manohar International Airport (MOPA) or Dabolim, drive towards Mapusa and take the Anjuna Coastal Road. Follow signs toward Sunset Point. Free parking available at the Anjuna Beach parking ground.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-cyan-700" />
                <span>Scooter &amp; Bicycle Rentals</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Renting a scooter is the most popular way to explore Goa! Swaishma Café features 30+ dedicated scooter and bike parking slots directly at our patio entrance.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-amber-700" />
                <span>Walking from Anjuna Beach Sand</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Stroll south from Anjuna Flea Market shore toward Sunset Point / Lifeguard Tower 2. Our wooden deck staircase leads directly up from the beach sand with an open foot-shower.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setIsDirectionsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
