import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Compass,
  Instagram,
  Facebook,
  Share2,
  ExternalLink,
  Check,
  Calendar,
  Waves,
  Bike,
  Car,
  Dog,
  Wifi,
  Sun,
  ShieldCheck,
} from 'lucide-react';

export const CafeInfoSection: React.FC = () => {
  const { cafeInfo, setIsReservationModalOpen, isOpenNow } = useCafe();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTransitMode, setActiveTransitMode] = useState<'walk' | 'drive' | 'bike'>('walk');

  const fullAddress = `${cafeInfo.address.street}, ${cafeInfo.address.neighborhood}, ${cafeInfo.address.city}`;

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof cafeInfo.hours;

  const daysList: { key: keyof typeof cafeInfo.hours; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <section id="info-section" className="py-10 lg:py-16 bg-[#FDF2F8] border-t border-pink-300/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-800">
            Find Us by the Shore
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Location, Hours &amp; Directions
          </h2>
          <p className="text-sm text-stone-600">
            Steps from the Arabian Sea waves at Sunset Point on Anjuna Beach, North Goa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Interactive Map & Directions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stylized Coastal Map Card */}
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-md aspect-[16/10] sm:aspect-[16/9]">
              {/* Map Graphic Canvas / Stylized Coastal Grid */}
              <div className="absolute inset-0 bg-[#E0F2FE]/50 overflow-hidden flex items-center justify-center">
                {/* Coastal SVG wave curves & grid */}
                <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="coastal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#coastal-grid)" />
                  {/* Shoreline contour curve */}
                  <path
                    d="M 0,220 Q 200,160 400,240 T 800,180 T 1200,260 L 1200,500 L 0,500 Z"
                    fill="#FEF3C7"
                    opacity="0.75"
                  />
                  {/* Water edge foam line */}
                  <path
                    d="M 0,215 Q 200,155 400,235 T 800,175 T 1200,255"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                  />
                </svg>

                {/* Ocean Waves label */}
                <div className="absolute top-8 left-8 text-cyan-800/80 font-serif font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <Waves className="w-5 h-5 text-cyan-600 animate-pulse" />
                  <span>Arabian Sea · Anjuna Beach, Goa</span>
                </div>

                {/* Boardwalk / Pier Graphic */}
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-10 bg-amber-200/90 rounded-lg border-2 border-amber-600/30 flex items-center justify-center text-[11px] font-bold text-amber-900 shadow-sm rotate-12">
                  Anjuna Beach Promenade
                </div>

                {/* Landmark Pin for Swaishma Cafe */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-xl ring-4 ring-teal-200/80 animate-bounce">
                      <Waves className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2 px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-stone-200 text-center">
                    <p className="font-serif text-xs font-bold text-slate-900">{cafeInfo.name}</p>
                    <p className="text-[10px] text-teal-800 font-medium">Anjuna Beach · Goa</p>
                  </div>
                </div>
              </div>

              {/* Transit Distance Badges overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-stone-200 text-xs flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Compass className="w-4 h-4 text-teal-700" />
                  <span>How to reach us:</span>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setActiveTransitMode('walk')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      activeTransitMode === 'walk' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Walk 2 min
                  </button>
                  <button
                    onClick={() => setActiveTransitMode('bike')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      activeTransitMode === 'bike' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Bike 4 min
                  </button>
                  <button
                    onClick={() => setActiveTransitMode('drive')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      activeTransitMode === 'drive' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    Drive &amp; Park
                  </button>
                </div>
              </div>

              {/* Direct Open in Google Maps */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-semibold text-xs shadow-md border border-stone-200 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-700" />
                <span>Open GPS</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            </div>

            {/* Address & Copy Block */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span className="font-bold text-sm text-slate-900">
                    {cafeInfo.address.street}
                  </span>
                </div>
                <p className="text-xs text-stone-600 pl-6">
                  {cafeInfo.address.neighborhood}, {cafeInfo.address.city}
                </p>
                <p className="text-[11px] text-teal-800 font-medium pl-6">
                  Landmark: {cafeInfo.address.landmark}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyAddress}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 hover:text-slate-900 shadow-xs hover:bg-stone-50 transition-colors"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedAddress ? 'Copied' : 'Copy Address'}</span>
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 shadow-sm transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>

            {/* Beach Amenities Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center gap-2">
                <Dog className="w-4 h-4 text-amber-700" />
                <span>Pet-Friendly Patio</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-teal-700" />
                <span>Beachfront Wi-Fi</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center gap-2">
                <Bike className="w-4 h-4 text-cyan-700" />
                <span>Beach Bike Racks</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center gap-2">
                <Car className="w-4 h-4 text-stone-600" />
                <span>Pier Lot Parking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Opening Hours & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Opening Hours Schedule */}
            <div className="bg-[#FCE7F3] rounded-3xl p-6 border border-pink-300/80 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-800" />
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Opening Hours
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {isOpenNow ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {daysList.map(({ key, label }) => {
                  const isToday = key === currentDayName;
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors ${
                        isToday
                          ? 'bg-teal-900/10 font-bold text-teal-950 border border-teal-700/20'
                          : 'text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{label}</span>
                        {isToday && (
                          <span className="text-[10px] text-teal-800 uppercase tracking-wider font-semibold">
                            (Today)
                          </span>
                        )}
                      </div>
                      <span className="tabular-nums font-mono text-stone-800">
                        {cafeInfo.hours[key]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-200/70">
                Kitchen closes 45 minutes prior to scheduled closing time.
              </p>
            </div>

            {/* Direct Contact & Reservations Card */}
            <div className="bg-teal-900 text-white rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                  Direct Inquiries
                </span>
                <h3 className="font-serif text-xl font-bold">Contact &amp; Reservations</h3>
                <p className="text-xs text-teal-100 leading-relaxed">
                  Planning a sunset celebration or seaside brunch? We gladly hold terrace tables.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-teal-100 pt-1">
                <a
                  href={`tel:${cafeInfo.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-teal-800/80 hover:bg-teal-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-300" />
                  <span className="font-semibold text-white">{cafeInfo.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${cafeInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Hello Swaishma Café! I would like to reserve a beachfront table.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-teal-800/80 hover:bg-teal-800 transition-colors"
                >
                  <Waves className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: <strong className="text-white">{cafeInfo.whatsapp}</strong></span>
                </a>

                <a
                  href={`mailto:${cafeInfo.email}`}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-teal-800/80 hover:bg-teal-800 transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-300" />
                  <span className="truncate">{cafeInfo.email}</span>
                </a>
              </div>

              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
              >
                Reserve Beachside Table
              </button>

              {/* Social Media Links */}
              <div className="pt-3 border-t border-teal-800/80 flex items-center justify-between text-xs text-teal-300">
                <span>Follow our beach stories:</span>
                <div className="flex items-center gap-3 text-white">
                  <a
                    href={cafeInfo.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-teal-800 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={cafeInfo.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-teal-800 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={cafeInfo.socialLinks.tripadvisor}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-teal-800 transition-colors"
                    aria-label="Tripadvisor"
                  >
                    <Compass className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
