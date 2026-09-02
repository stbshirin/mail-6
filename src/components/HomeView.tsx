import React from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Mail,
  Sparkles,
  ShoppingBag,
  Repeat,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Star,
  DollarSign,
  ChevronRight,
  Send,
  HelpCircle,
  PhoneCall,
  Gift,
  Flame
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    language,
    setCurrentView,
    shifts,
    marketplaceItems,
    reviews,
    user,
    setIsAuthModalOpen,
    setIsChatOpen
  } = useApp();

  const t = getTranslation(language);
  const activeShift = shifts.find(s => s.isActive) || shifts[1];

  const recentPayouts = [
    { name: 'Tanvir Ahmed', amount: 1050, method: 'bKash', time: '২ মিনিট আগে' },
    { name: 'Sumon Mia', amount: 2400, method: 'Nagad', time: '৫ মিনিট আগে' },
    { name: 'Rakib Hasan', amount: 850, method: 'bKash', time: '৮ মিনিট আগে' },
    { name: 'Freelancer Asif', amount: 3200, method: 'Rocket', time: '১২ মিনিট আগে' },
    { name: 'Nayeem Sheikh', amount: 1500, method: 'bKash', time: '১৫ মিনিট আগে' }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Shift Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold shadow-inner">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              {language === 'bn' ? 'বর্তমান লাইভ রেট:' : 'Current Live Rate:'}{' '}
              <strong className="text-amber-300 font-bold">
                ৳{(activeShift.ratePerMail + activeShift.bonusPerMail).toFixed(2)}
              </strong>{' '}
              / মেইল
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400"></span>
            <span className="hidden sm:inline text-slate-300">
              {language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট ৩ মিনিটে' : '3-Min Fast Payout'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'bn' ? (
              <>
                বিশ্বস্ত জিমেইল <span className="gradient-text-gold">ক্রয়-বিক্রয়</span> ও{' '}
                <span className="gradient-text-emerald">মাইক্রো-আর্নিং</span> প্ল্যাটফর্ম
              </>
            ) : (
              <>
                The Premier <span className="gradient-text-gold">Gmail Marketplace</span> &{' '}
                <span className="gradient-text-emerald">Earning Factory</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'নিরাপদে ফ্রেশ ও ওল্ড জিমেইল অ্যাকাউন্ট ক্রয় করুন অথবা নিজের তৈরি করা জিমেইল সাবমিট করে বিকাশ ও নগদে সরাসরি টাকা উইথড্র নিন।'
              : 'Buy verified recovery Gmail accounts with instant warranty, or sell your created Gmails for immediate bKash and Nagad payouts.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-sell-cta-btn"
              onClick={() => setCurrentView('sell')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 transform active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              {t.sellGmails}
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <button
              id="hero-buy-cta-btn"
              onClick={() => setCurrentView('buy')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-white font-bold text-base hover:bg-slate-800/80 shadow-lg transform active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {t.buyMarketplace}
            </button>

            <button
              id="hero-exchange-cta-btn"
              onClick={() => setCurrentView('exchange')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm hover:text-white transition cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-amber-400" />
              {t.exchange}
            </button>
          </div>

          {/* Live Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">{language === 'bn' ? 'মোট মেইল লেনদেন' : 'Gmails Traded'}</p>
              <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">১,৪৫,০০০+</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">{language === 'bn' ? 'মোট উইথড্র পরিশোধ' : 'Total Paid Out'}</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-400 mt-0.5">৳১৮,৫০,০০০+</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">{language === 'bn' ? 'অ্যাক্টিভ সেলার' : 'Active Sellers'}</p>
              <p className="text-lg sm:text-2xl font-bold text-amber-400 mt-0.5">৩,৮০০+</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">{language === 'bn' ? 'গ্যারান্টি রিপ্লেসমেন্ট' : 'Warranty Rate'}</p>
              <p className="text-lg sm:text-2xl font-bold text-teal-400 mt-0.5">১০০% ভেরিফাইড</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recent Payouts Marquee / Ticker */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {language === 'bn' ? 'সাম্প্রতিক লাইভ পেমেন্ট প্রুফ' : 'Recent Live Payouts'}
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('reviews')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {language === 'bn' ? 'সকল রিভিউ দেখুন' : 'View All Reviews'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {recentPayouts.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
            >
              <div className="truncate">
                <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                <span className="text-[10px] text-slate-400">{p.time}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-emerald-400">৳{p.amount}</p>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                  {p.method}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Shifts Overview Card */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-400" />
              {language === 'bn' ? 'আজকের সেলার শিফট ও বোনাস' : "Today's Seller Shifts"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'bn'
                ? 'শিফট চলাকালীন সময়ে মেইল জমা দিয়ে অতিরিক্ত বোনাস ক্যাশ উপভোগ করুন।'
                : 'Submit during active shifts to earn maximum cash bonuses.'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('review-shifts')}
            className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer hidden sm:block"
          >
            {language === 'bn' ? 'শিফট রুলস ও সময়সূচি' : 'Shift Rules & Schedule'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shifts.map(shift => (
            <div
              key={shift.id}
              className={`relative rounded-2xl p-5 border transition flex flex-col justify-between ${
                shift.isActive
                  ? 'bg-gradient-to-b from-amber-500/10 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              {shift.isActive && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'bn' ? 'লাইভ চালু' : 'LIVE NOW'}
                </span>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-base text-white">
                  {language === 'bn' ? shift.titleBn : shift.titleEn}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {shift.timeRange}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">{language === 'bn' ? 'মৌলিক রেট' : 'Base Rate'}:</span>
                    <span className="font-bold text-white">৳{shift.ratePerMail.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-amber-400 font-medium">{language === 'bn' ? 'শিফট বোনাস' : 'Shift Bonus'}:</span>
                    <span className="font-bold text-amber-400">+৳{shift.bonusPerMail.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{language === 'bn' ? 'মোট রেট' : 'Total Rate'}:</span>
                    <span className="font-extrabold text-sm text-emerald-400">
                      ৳{(shift.ratePerMail + shift.bonusPerMail).toFixed(2)} / মেইল
                    </span>
                  </div>
                </div>

                <ul className="text-xs text-slate-400 space-y-1">
                  {(language === 'bn' ? shift.rulesBn : shift.rulesEn).map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-2">
                <button
                  onClick={() => setCurrentView('sell')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    shift.isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {language === 'bn' ? 'মেইল সাবমিট করুন' : 'Submit Mails'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Marketplace Packages */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              {language === 'bn' ? 'হট ডিলস: জিমেইল মার্কেটপ্লেস' : 'Hot Deals: Gmail Marketplace'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'bn'
                ? '১০০% রিকভারি যুক্ত ফ্রেশ ও ওল্ড জিমেইল কিনুন ইনস্ট্যান্ট অটো-ডেলিভারি সহ।'
                : 'Buy verified fresh and aged Gmails with 100% warranty and instant delivery.'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('buy')}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {language === 'bn' ? 'সব প্যাকেজ দেখুন' : 'View All'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {marketplaceItems.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-amber-500/40 transition group flex flex-col justify-between"
            >
              {item.badge && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold shadow-md">
                  {item.badge}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition">
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-amber-400">
                    ৳{item.priceBdt.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {language === 'bn' ? 'পিস' : 'pcs'} (${item.priceUsd.toFixed(2)})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {item.rating} ({item.salesCount}+ {language === 'bn' ? 'বিক্রয়' : 'sold'})
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    {language === 'bn' ? 'স্টক:' : 'Stock:'} {item.stock} {language === 'bn' ? 'টি' : 'pcs'}
                  </span>
                </div>

                <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
                  {(language === 'bn' ? item.featuresBn : item.featuresEn).map((f, fIdx) => (
                    <p key={fIdx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-2">
                <button
                  onClick={() => setCurrentView('buy')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'bn' ? 'ইনস্ট্যান্ট ৩ মিনিটে উইথড্র' : 'Instant 3-Min Payouts'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'বিকাশ ও নগদ পার্সোনালে সর্বনিম্ন মাত্র ৳৫০ উইথড্র করুন কোনো ফি ছাড়া।'
              : 'Withdraw as low as ৳50 directly to bKash & Nagad with zero delay.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'bn' ? '১০০% রিপ্লেসমেন্ট ওয়ারেন্টি' : '100% Replacement Guarantee'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'কোনো মেইলে সমস্যা হলে ২৪-১৬৮ ঘণ্টার মধ্যে সাথে সাথে রিপ্লেসমেন্ট বা রিফান্ড।'
              : 'Automatic replacement or refund for any invalid accounts during warranty.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'bn' ? '৫% আজীবন রেফারেল কমিশন' : '5% Lifetime Referral'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'বন্ধুদের ইনভাইট করুন এবং তাদের প্রতিটি মেইল বিক্রির উপর ৫% বোনাস উপভোগ করুন।'
              : 'Invite sellers and earn 5% on every Gmail they submit for lifetime.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {language === 'bn' ? '২৪/৭ লাইভ বাংলা সাপোর্ট' : '24/7 Live Bengali Support'}
          </h4>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'টেলিগ্রাম ও অন-সাইট লাইভ চ্যাটে যেকোনো সহায়তার জন্য আমরা সদা প্রস্তুত।'
              : 'Direct human support via on-site live chat and official Telegram.'}
          </p>
        </div>
      </section>

      {/* Community Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
            {language === 'bn' ? 'অফিসিয়াল টেলিগ্রাম চ্যানেল' : 'Official Telegram Channel'}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? '১০,০০০+ সেলার ও বায়ারের কমিউনিটিতে যোগ দিন' : 'Join 10,000+ Verified Sellers Community'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {language === 'bn'
              ? 'প্রতিদিনের স্পেশাল শিফট আপডেট, রেট বাড়ানো-কমানোর নোটিশ এবং পেমেন্ট প্রুফ সবার আগে টেলিগ্রামে পেতে এখনি যোগ দিন।'
              : 'Get live shift announcements, highest rate alerts, and payment proofs instantly.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-semibold text-xs transition cursor-pointer"
          >
            {language === 'bn' ? 'লাইভ সাপোর্ট চ্যাট' : 'Live Chat Support'}
          </button>
          <a
            href="https://t.me/mailfactory_official"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {language === 'bn' ? 'টেলিগ্রাম গ্রুপে জয়েন করুন' : 'Join Telegram Group'}
          </a>
        </div>
      </section>
    </div>
  );
};
