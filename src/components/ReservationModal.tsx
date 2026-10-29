import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { X, Calendar, Clock, Users, Sparkles, CheckCircle2, Waves } from 'lucide-react';

export const ReservationModal: React.FC = () => {
  const { isReservationModalOpen, setIsReservationModalOpen, cafeInfo } = useCafe();
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState('Oceanfront Terrace');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReservationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">
                Reserve a Beachside Table
              </h2>
              <p className="text-xs text-teal-200">
                Sunset viewing &amp; oceanfront dining at {cafeInfo.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsReservationModalOpen(false);
              setSubmitted(false);
            }}
            className="p-1.5 text-teal-300 hover:text-white rounded-lg transition-colors"
            aria-label="Close reservation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Table Reserved!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>! Your table at the{' '}
                <strong className="text-teal-900">{area}</strong> has been secured for{' '}
                <strong>{guests} guests</strong> on <strong>{date}</strong> at <strong>{time}</strong>.
              </p>
              <p className="text-[11px] text-stone-500">
                A confirmation note has been sent to {phone || 'your phone'}. See you by the sea!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setIsReservationModalOpen(false);
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Time Slot *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="08:00">8:00 AM (Sunrise &amp; Coffee)</option>
                    <option value="10:30">10:30 AM (Morning Brunch)</option>
                    <option value="12:30">12:30 PM (Coastal Lunch)</option>
                    <option value="15:30">3:30 PM (Afternoon Sea Breeze)</option>
                    <option value="18:00">6:00 PM (Sunset Golden Hour)</option>
                    <option value="19:30">7:30 PM (Ocean Dinner)</option>
                    <option value="21:00">9:00 PM (Late Night Waves)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Number of Guests *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Seating Area *</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="Oceanfront Terrace">Oceanfront Terrace (Open-Air Deck)</option>
                    <option value="Sunset Cabana">Sunset Cabana (Private Fire Pit)</option>
                    <option value="Breezy Rattan Lounge">Breezy Rattan Lounge (Indoor Shaded)</option>
                    <option value="Barista Roastery Bar">Barista Roastery Bar (High-Top)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Anderson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Special Occasion / Request</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday celebration, anniversary, high chair needed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
              >
                Confirm Table Reservation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
