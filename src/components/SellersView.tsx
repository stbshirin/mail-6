import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  HelpCircle,
  FileText,
  Copy,
  Check,
  History,
  TrendingUp,
  ShieldCheck,
  Info,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

export const SellersView: React.FC = () => {
  const {
    language,
    shifts,
    submitSellBatch,
    sellSubmissions,
    user,
    setIsAuthModalOpen,
    setCurrentView
  } = useApp();

  const t = getTranslation(language);
  const activeShift = shifts.find(s => s.isActive) || shifts[1];

  const [category, setCategory] = useState('Fresh Outlook Recovery');
  const [rawText, setRawText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<{ count: number; earning: number } | null>(null);

  // Parse lines in real time
  const parsedData = useMemo(() => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailsSet = new Set<string>();

    let valid = 0;
    let invalid = 0;
    let duplicate = 0;

    for (const line of lines) {
      const parts = line.split(/[:|,\t\s]+/).filter(Boolean);
      if (parts.length >= 2) {
        const email = parts[0];
        const pass = parts[1];
        if (email.includes('@gmail.com') && emailRegex.test(email) && pass.length >= 6) {
          if (emailsSet.has(email.toLowerCase())) {
            duplicate++;
          } else {
            emailsSet.add(email.toLowerCase());
            valid++;
          }
        } else {
          invalid++;
        }
      } else {
        invalid++;
      }
    }

    const rate = activeShift.ratePerMail + activeShift.bonusPerMail;
    const estimatedEarning = valid * rate;

    return { total: lines.length, valid, invalid, duplicate, estimatedEarning, rate };
  }, [rawText, activeShift]);

  const handleFillSample = () => {
    const sample = Array.from({ length: 15 }).map((_, i) => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      return `work.seller${rand}${i + 1}@gmail.com:PassSecure#${rand}:recov${rand}@outlook.com`;
    }).join('\n');
    setRawText(sample);
  };

  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (parsedData.valid === 0) {
      alert(language === 'bn' ? 'কমপক্ষে ১টি সঠিক ফরম্যাটের জিমেইল পেস্ট করুন।' : 'Please paste at least 1 valid Gmail.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitSellBatch(category, rawText, activeShift.titleEn);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitSuccessMsg({ count: res.count, earning: res.earning });
      setRawText('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'bn' ? 'সেলার আর্নিং হাব' : 'Seller Earning Hub'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t.sellerHeading}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t.sellerSubheading}
            </p>
          </div>

          {/* Active Shift Rate Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 shrink-0 w-full md:w-auto text-left md:text-right space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center md:justify-end gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {activeShift.titleBn}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ৳{(activeShift.ratePerMail + activeShift.bonusPerMail).toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ মেইল</span>
            </div>
            <p className="text-[10px] text-amber-400 font-medium">
              (মৌলিক ৳{activeShift.ratePerMail.toFixed(2)} + শিফট বোনাস ৳{activeShift.bonusPerMail.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submitSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm sm:text-base">
                {language === 'bn'
                  ? `অভিনন্দন! ${submitSuccessMsg.count}টি জিমেইল সফলভাবে সাবমিট হয়েছে!`
                  : `Success! ${submitSuccessMsg.count} Gmails submitted!`}
              </p>
              <p className="text-xs text-emerald-300">
                {language === 'bn'
                  ? `আপনার সেলার ওয়ালেটে ৳${submitSuccessMsg.earning.toFixed(2)} সাথে সাথে যোগ করা হয়েছে।`
                  : `৳${submitSuccessMsg.earning.toFixed(2)} credited to your seller wallet.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('withdraw')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md"
          >
            {language === 'bn' ? 'উইথড্র করুন' : 'Withdraw'}
          </button>
        </div>
      )}

      {/* Main Submission Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-xl">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'bn' ? 'মেইলের ক্যাটাগরি নির্বাচন করুন' : 'Select Category'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Fresh Outlook Recovery', labelBn: 'ফ্রেশ আউটলুক রিকভারি', bonus: '+৳১.০০' },
                  { id: 'Fresh Non-Recovery', labelBn: 'ফ্রেশ নন-রিকভারি', bonus: '+৳০.৫০' },
                  { id: 'US PVA Real Sim', labelBn: 'ইউএস ফোন ভেরিফাইড', bonus: '+৳৩.০০' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      category === cat.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-semibold">{cat.labelBn}</p>
                    <span className="text-[10px] text-amber-400 font-bold">{cat.bonus}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Format Header & Sample Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? 'জিমেইল ব্যাচ পেস্ট করুন' : 'Paste Gmail Batch'}
                </label>
                <button
                  onClick={handleFillSample}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
                >
                  {language === 'bn' ? 'স্যাম্পল ডেটা বসান (Test Demo)' : 'Fill Sample Demo'}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.pasteFormatNotice}</span>
              </div>

              {/* Textarea */}
              <textarea
                id="sell-batch-textarea"
                rows={10}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={t.batchInputPlaceholder}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs sm:text-sm leading-relaxed transition"
              ></textarea>
            </div>

            {/* Submission Action */}
            <button
              id="submit-sell-batch-btn"
              disabled={isSubmitting || parsedData.valid === 0}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                parsedData.valid > 0 && !isSubmitting
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 transform active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span>{language === 'bn' ? 'ভেরিফাই করা হচ্ছে...' : 'Verifying Batch...'}</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {language === 'bn'
                    ? `${parsedData.valid}টি জিমেইল সাবমিট করুন (আয়: ৳${parsedData.estimatedEarning.toFixed(2)})`
                    : `Submit ${parsedData.valid} Gmails (Earn ৳${parsedData.estimatedEarning.toFixed(2)})`}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Calculation & Rules */}
        <div className="space-y-6">
          {/* Live Counter Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              {language === 'bn' ? 'লাইভ হিসেব ও উপার্জন' : 'Live Calculation'}
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">{language === 'bn' ? 'মোট লাইন' : 'Total Lines'}:</span>
                <span className="font-bold text-white">{parsedData.total}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-emerald-300 font-medium">{t.validMails}:</span>
                <span className="font-extrabold text-emerald-400 text-sm">{parsedData.valid}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-rose-300 font-medium">{t.invalidMails}:</span>
                <span className="font-bold text-rose-400">{parsedData.invalid}</span>
              </div>
              {parsedData.duplicate > 0 && (
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-amber-300 font-medium">ডুপ্লিকেট মেইল:</span>
                  <span className="font-bold text-amber-400">{parsedData.duplicate}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">{t.estimatedEarning}</p>
              <div className="text-3xl font-extrabold text-emerald-400">
                ৳{parsedData.estimatedEarning.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'bn'
                  ? 'সাবমিটের সাথে সাথে সেলার ব্যালেন্সে টাকা যুক্ত হবে এবং সরাসরি উইথড্র নেওয়া যাবে।'
                  : 'Instant credit to seller balance, ready for withdrawal.'}
              </p>
            </div>
          </div>

          {/* Mandatory Rules Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              {t.sellerRules}
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>মেইলে অবশ্যই ইংরেজি ফার্স্ট নেম ও লাস্ট নেম থাকতে হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>আউটলুক রিকভারি মেইল ঠিকমতো অ্যাড ও কনফার্ম করতে হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>পাসওয়ার্ডে ক্যাপিটাল লেটার, স্মল লেটার ও নাম্বার থাকতে হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>কোনো প্রকার ফেক বা অটোবট জেনারেটেড ডিজেবল মেইল সাবমিট নিষিদ্ধ।</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Previous Submissions History */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          {language === 'bn' ? 'আমার সাবমিশন হিস্ট্রি' : 'My Submission History'}
        </h3>

        {sellSubmissions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            {language === 'bn' ? 'এখনো কোনো মেইল ব্যাচ সাবমিট করেননি।' : 'No submissions yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {sellSubmissions.map(batch => (
              <div
                key={batch.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{batch.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      {batch.category}
                    </span>
                    <span className="text-slate-400 font-mono">{batch.submittedAt}</span>
                  </div>
                  <p className="text-slate-400">
                    {language === 'bn' ? 'মোট মেইল' : 'Total Mails'}:{' '}
                    <strong className="text-white">{batch.quantity} টি</strong> •{' '}
                    {language === 'bn' ? 'শিফট' : 'Shift'}: {batch.shiftName}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-sm font-extrabold text-emerald-400">
                    +৳{batch.totalEarning.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {language === 'bn' ? 'ইনস্ট্যান্ট অ্যাপ্রুভড' : 'Approved & Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
