import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Zap,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  History,
  CreditCard,
  Download,
  Flame,
  Clock
} from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const {
    language,
    user,
    requestWithdrawal,
    setIsAuthModalOpen,
    transactions,
    setCurrentView
  } = useApp();

  const t = getTranslation(language);

  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Binance USDT'>('bKash');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(user ? Math.min(500, user.earningBdt) : 100);
  const [receiverNumber, setReceiverNumber] = useState<string>(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<{ amount: number; method: string; receiver: string } | null>(null);

  const availableEarning = user ? user.earningBdt : 0;

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (availableEarning < withdrawAmount) {
      alert(language === 'bn' ? 'আপনার সেলার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!' : 'Insufficient balance!');
      return;
    }
    if (withdrawAmount < 50) {
      alert(language === 'bn' ? 'সর্বনিম্ন উইথড্র ৳৫০' : 'Minimum withdraw is ৳50');
      return;
    }
    if (!receiverNumber) {
      alert(language === 'bn' ? 'সঠিক একাউন্ট নাম্বার দিন' : 'Enter valid account number');
      return;
    }

    setIsSubmitting(true);
    const ok = await requestWithdrawal(withdrawMethod, withdrawAmount, receiverNumber);
    setIsSubmitting(false);

    if (ok) {
      setSuccessReceipt({ amount: withdrawAmount, method: withdrawMethod, receiver: receiverNumber });
      setWithdrawAmount(50);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const withdrawalHistory = transactions.filter(t => t.type === 'withdraw');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              <Zap className="w-3.5 h-3.5" />
              {language === 'bn' ? 'সরাসরি মোবাইল ব্যাংকিং পেমেন্ট' : 'Fast Mobile Banking Payout'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t.withdrawHeading}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              {language === 'bn'
                ? 'আপনার অর্জিত টাকা বিকাশ, নগদ অথবা রকেটে সরাসরি ট্রান্সফার করুন।'
                : 'Withdraw your seller earnings directly to your mobile wallet.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-left sm:text-right shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">{t.earningBalance}</span>
            <div className="text-3xl font-extrabold text-emerald-400">
              ৳{availableEarning.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-300 font-bold flex items-center sm:justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              {t.minWithdraw}
            </span>
          </div>
        </div>
      </div>

      {/* Success Receipt Alert */}
      {successReceipt && (
        <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'bn' ? 'উইথড্র রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!' : 'Withdrawal Request Dispatched!'}
              </h3>
              <p className="text-xs text-emerald-300">
                {language === 'bn'
                  ? `৳${successReceipt.amount} আপনার ${successReceipt.method} (${successReceipt.receiver}) একাউন্টে পাঠানো হয়েছে।`
                  : `Payment sent to your ${successReceipt.method} (${successReceipt.receiver}).`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Withdraw Form */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <form onSubmit={handleWithdrawSubmit} className="space-y-6">
          {/* Method Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t.selectMethod}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['bKash', 'Nagad', 'Rocket', 'Binance USDT'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setWithdrawMethod(m)}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                    withdrawMethod === m
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Receiver Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {withdrawMethod} {t.accountNumber} ({language === 'bn' ? 'পার্সোনাল' : 'Personal'})
            </label>
            <input
              type="text"
              required
              value={receiverNumber}
              onChange={e => setReceiverNumber(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Amount input & Quick buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.amount}
              </label>
              <button
                type="button"
                onClick={() => setWithdrawAmount(availableEarning)}
                className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
              >
                {language === 'bn' ? 'সব ব্যালেন্স উইথড্র (Max)' : 'Withdraw All (Max)'}
              </button>
            </div>

            <input
              type="number"
              min={50}
              max={availableEarning}
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-extrabold text-2xl focus:outline-none focus:border-emerald-500"
            />

            <div className="flex gap-2">
              {[50, 100, 300, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setWithdrawAmount(amt)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Fee & Arrival Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{language === 'bn' ? 'উইথড্র ফি (Service Charge):' : 'Withdrawal Fee:'}</span>
              <span className="font-bold text-emerald-400">৳0.00 (১০০% ফ্রি)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{language === 'bn' ? 'সম্ভাব্য পৌঁছানোর সময়:' : 'Estimated Time:'}</span>
              <span className="font-bold text-amber-400">৩ - ১৫ মিনিট (অটোমেটিক)</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || availableEarning < 50}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
              availableEarning >= 50 && !isSubmitting
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 transform active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span>{language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing Payout...'}</span>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5" />
                {language === 'bn'
                  ? `৳${withdrawAmount} উইথড্র কনফার্ম করুন`
                  : `Confirm ৳${withdrawAmount} Withdrawal`}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          {language === 'bn' ? 'আমার পূর্ববর্তী উইথড্র হিস্ট্রি' : 'Withdrawal History'}
        </h3>

        {withdrawalHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {language === 'bn' ? 'কোনো পূর্ববর্তী উইথড্র পাওয়া যায়নি।' : 'No withdrawal records found.'}
          </p>
        ) : (
          <div className="space-y-2.5">
            {withdrawalHistory.map(tr => (
              <div
                key={tr.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{tr.method}</span>
                    <span className="font-mono text-emerald-400 font-bold">{tr.accountNumber}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    TrxID: <span className="font-mono text-slate-300">{tr.trxId}</span> • {tr.createdAt}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-400">
                    ৳{tr.amount.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'bn' ? 'পেইড সম্পন্ন' : 'Paid & Dispatched'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
