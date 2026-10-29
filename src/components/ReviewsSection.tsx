import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Plus, Sparkles, Filter } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview, upvoteReview, averageRating, totalRatingsCount, menuItems } = useCafe();

  const [isWriting, setIsWriting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) return;

    addReview({
      authorName: authorName.trim(),
      authorCity: authorCity.trim() || 'Coastal Guest',
      rating,
      text: text.trim(),
      favoriteDish: favoriteDish || undefined,
      verifiedVisit: true,
    });

    setAuthorName('');
    setAuthorCity('');
    setText('');
    setFavoriteDish('');
    setIsWriting(false);
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  // Rating breakdowns (simulated on realistic base)
  const fiveStarsCount = reviews.filter((r) => r.rating === 5).length + 1160;
  const fourStarsCount = reviews.filter((r) => r.rating === 4).length + 95;
  const threeStarsCount = reviews.filter((r) => r.rating === 3).length + 18;
  const twoStarsCount = reviews.filter((r) => r.rating === 2).length + 4;
  const oneStarCount = reviews.filter((r) => r.rating === 1).length + 3;
  const totalDisplayRatings = 1280 + reviews.length;

  return (
    <section id="reviews-section" className="py-10 lg:py-16 bg-[#FCE7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-800">
            Guest Testimonials &amp; Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Loved by Beachgoers &amp; Coffee Lovers
          </h2>
          <p className="text-sm text-stone-600">
            Read what guests say about our ocean vistas, breakfast platters, chilled cold brews, and coastal hospitality.
          </p>
        </div>

        {/* Rating Overview Scorecard Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Score Block */}
            <div className="md:col-span-4 text-center md:text-left md:border-r md:border-stone-200/80 md:pr-8">
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="font-serif text-5xl sm:text-6xl font-extrabold text-slate-900 tabular-nums">
                  {averageRating}
                </span>
                <span className="text-lg text-stone-500 font-medium">/ 5.0</span>
              </div>

              {/* Star icons */}
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-500" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Based on <strong className="text-slate-800 tabular-nums">{totalDisplayRatings.toLocaleString()}</strong> verified reviews
              </p>

              <button
                onClick={() => setIsWriting(!isWriting)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Guest Review</span>
              </button>
            </div>

            {/* Middle Rating Histogram Bars */}
            <div className="md:col-span-5 space-y-2 text-xs text-stone-600 font-medium">
              {[
                { stars: 5, count: fiveStarsCount, pct: 92 },
                { stars: 4, count: fourStarsCount, pct: 6 },
                { stars: 3, count: threeStarsCount, pct: 1.5 },
                { stars: 2, count: twoStarsCount, pct: 0.3 },
                { stars: 1, count: oneStarCount, pct: 0.2 },
              ].map(({ stars, count, pct }) => (
                <button
                  key={stars}
                  onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                  className={`w-full flex items-center gap-3 py-1 px-1.5 rounded-lg transition-colors group ${
                    filterRating === stars ? 'bg-stone-100 font-bold' : 'hover:bg-stone-50'
                  }`}
                >
                  <span className="w-10 text-left font-serif">{stars} star</span>
                  <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500 group-hover:bg-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right tabular-nums text-stone-400 group-hover:text-stone-700">
                    {pct}%
                  </span>
                </button>
              ))}
            </div>

            {/* Right Highlights Block */}
            <div className="md:col-span-3 bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-xs space-y-2.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Guest Highlights</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span>"Spectacular sunset ocean views from the deck"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span>"Fresh lobster roll &amp; cold brew are unbeatable"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span>"Warm, attentive seaside service"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Write a Review Modal / Form Accordion */}
        {isWriting && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-700/40 shadow-xl mb-10 space-y-4 animate-in slide-in-from-top duration-300"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Share Your Swaishma Experience
              </h3>
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mia Jenkins"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-700/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / Hometown
                </label>
                <input
                  type="text"
                  placeholder="e.g. Santa Monica, CA"
                  value={authorCity}
                  onChange={(e) => setAuthorCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-700/50"
                />
              </div>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-stone-500 font-medium ml-2">
                  {rating === 5 ? 'Exceptional (5/5)' : `${rating} out of 5 stars`}
                </span>
              </div>
            </div>

            {/* Favorite Dish selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Favorite Dish or Drink Ordered (Optional)
              </label>
              <select
                value={favoriteDish}
                onChange={(e) => setFavoriteDish(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-700/50"
              >
                <option value="">Select an item from the menu...</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} ({item.menuType === 'food' ? 'Food' : 'Drink'})
                  </option>
                ))}
              </select>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tell us about the coffee, ocean breeze, food quality, or your favorite spot on the deck..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-700/50"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium pb-2 border-b border-stone-200">
            <span>
              Showing <strong className="text-slate-900 tabular-nums">{filteredReviews.length}</strong> reviews
              {filterRating !== 'all' && ` with ${filterRating} stars`}
            </span>
            {filterRating !== 'all' && (
              <button
                onClick={() => setFilterRating('all')}
                className="text-teal-700 hover:underline font-semibold"
              >
                View all ratings
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-slate-900">
                          {rev.authorName}
                        </span>
                        {rev.verifiedVisit && (
                          <span className="text-[10px] text-teal-800 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            Verified Visit
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">
                        {rev.authorCity} · {rev.date}
                      </p>
                    </div>

                    <div className="flex items-center text-amber-400 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2.5">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  {rev.favoriteDish ? (
                    <span className="text-[11px] text-teal-900 font-medium truncate">
                      Ordered: <strong className="font-semibold">{rev.favoriteDish}</strong>
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => upvoteReview(rev.id)}
                    className="flex items-center gap-1.5 text-stone-500 hover:text-teal-800 transition-colors p-1 rounded"
                    title="Helpful review"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums text-[11px] font-medium">{rev.helpfulCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
