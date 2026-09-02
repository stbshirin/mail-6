import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Gift,
  Trophy,
  Copy,
  Check,
  Users,
  Award,
  Crown,
  Medal,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export const ReferralLeaderboard: React.FC = () => {
  const { language, user } = useApp();
  const t = getTranslation(language);

  const [copiedLink, setCopiedLink] = useState(false);

  const topSellers = [
    { rank: 1, name: 'Md. Rakib Freelancer', sales: 4850, earned: 50925, prize: '৳৫,০০০ ক্যাশ' },
    { rank: 2, name: 'Tanvir Ahmed Pro', sales: 3920, earned: 41160, prize: '৳৩,০০০ ক্যাশ' },
    { rank: 3, name: 'Sumon Cyber Point', sales: 3410, earned: 35805, prize: '৳১,৫০০ ক্যাশ' },
    { rank: 4, name: 'Asif Iqbal', sales: 2890, earned: 30345, prize: '৳৮০০ ক্যাশ' },
    { rank: 5, name: 'Freelancer Shakil', sales: 2450, earned: 25725, prize: '৳৫০০ ক্যাশ' }
  ];

  const referralUrl = user ? `https://mailfactory.com/join?ref=${user.referralCode}` : 'https://mailfactory.com';

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/40">
          <Gift className="w-3.5 h-3.5" />
          {language === 'bn' ? 'আজীবন রেফারেল প্রোগ্রাম' : 'Lifetime Referral Program'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {t.referralHeading}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          {language === 'bn'
            ? 'আপনার রেফারেল লিংক বন্ধুদের সাথে শেয়ার করুন। তারা যত মেইল সেল করবে, প্রতিটিতে আপনি পাবেন ৫% নগদ কমিশন সরাসরি আপনার ওয়ালেটে।'
            : 'Share your link and earn 5% lifetime recurring commission on all sales made by your referrals.'}
        </p>

        {user && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
            <div className="truncate w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.yourRefLink}:</span>
              <p className="font-mono text-xs text-amber-400 truncate mt-0.5">{referralUrl}</p>
            </div>
            <button
              onClick={copyRefLink}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0 transition"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? t.copied : t.copy}</span>
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              {language === 'bn' ? 'টপ সেলার সাপ্তাহিক লিডারবোর্ড' : 'Weekly Top Sellers Leaderboard'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'সপ্তাহের সেরা ৫ জন সেলারের জন্য নগদ পুরস্কার।' : 'Weekly cash rewards for top 5 performers.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            {language === 'bn' ? 'মোট প্রাইজপুল: ৳১০,৮০০' : 'Prize Pool: ৳10,800'}
          </span>
        </div>

        <div className="space-y-3">
          {topSellers.map(seller => (
            <div
              key={seller.rank}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                seller.rank === 1
                  ? 'bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-950 border-amber-500/50'
                  : seller.rank === 2
                  ? 'bg-gradient-to-r from-slate-800/60 to-slate-950 border-slate-700'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                    seller.rank === 1
                      ? 'bg-amber-500 text-slate-950'
                      : seller.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : seller.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {seller.rank}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{seller.name}</h4>
                  <p className="text-slate-400">
                    {language === 'bn' ? 'মোট সেল' : 'Sales'}: <strong className="text-white">{seller.sales} টি</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">{language === 'bn' ? 'মোট উপার্জন' : 'Total Earned'}</span>
                  <p className="font-extrabold text-emerald-400 text-sm">৳{seller.earned.toLocaleString()}</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  {seller.prize}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
