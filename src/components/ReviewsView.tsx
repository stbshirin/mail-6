import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Clock,
  Plus,
  Flame,
  Award,
  X
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { language, reviews, addReview, user, setIsAuthModalOpen } = useApp();
  const t = getTranslation(language);

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [shiftName, setShiftName] = useState('Prime Evening Shift');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!comment.trim()) return;

    addReview(rating, comment, shiftName);
    setIsWriteOpen(false);
    setComment('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
            <Award className="w-3.5 h-3.5" />
            {language === 'bn' ? '১০০% রিয়েল পেমেন্ট প্রুফ' : 'Verified Reviews & Proofs'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.reviews}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'bn'
              ? 'আমাদের ভেরিফাইড সেলার ও বায়ারদের বাস্তব অভিজ্ঞতা ও পেমেন্ট প্রুফ রিভিউ।'
              : 'Real feedback and payout proofs from active sellers and buyers.'}
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) setIsAuthModalOpen(true);
            else setIsWriteOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'রিভিউ দিন' : 'Write Review'}
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">4.95</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-400">{language === 'bn' ? 'সার্বিক কাস্টমার রেটিং' : 'Overall Platform Rating'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400">১০০%</div>
            <p className="text-xs text-slate-400">{language === 'bn' ? 'সফল পেমেন্ট রেশিও' : 'Successful Payout Ratio'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">৩ মিনিট</div>
            <p className="text-xs text-slate-400">{language === 'bn' ? 'গড় উইথড্র সময়' : 'Avg Payout Time'}</p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                    {rev.userName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {rev.userName}
                      {rev.isVerifiedSeller && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </h4>
                    <span className="text-[11px] text-amber-400 font-medium">
                      {rev.userTier || 'Verified Member'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{rev.date}</span>
              {rev.payoutAmount && (
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  উইথড্র: ৳{rev.payoutAmount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsWriteOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {language === 'bn' ? 'রিভিউ ও পেমেন্ট প্রুফ সাবমিট করুন' : 'Submit Review & Proof'}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === 'bn' ? 'স্টার রেটিং' : 'Rating'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === 'bn' ? 'শিফট বা কাজের নাম' : 'Shift Name'}
                </label>
                <input
                  type="text"
                  value={shiftName}
                  onChange={e => setShiftName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === 'bn' ? 'আপনার অভিজ্ঞতা ও মন্তব্য' : 'Comment'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'মেইল সাবমিশন, চেকিং স্পিড ও উইথড্র পাওয়ার অভিজ্ঞতা লিখুন...'
                      : 'Share your experience...'
                  }
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
