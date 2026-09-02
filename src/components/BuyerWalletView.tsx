import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  History,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';

export const BuyerWalletView: React.FC = () => {
  const {
    language,
    user,
    requestDeposit,
    setIsAuthModalOpen,
    setCurrentView,
    transactions
  } = useApp();

  const t = getTranslation(language);

  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Binance USDT'>('bKash');
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  const accountNumbers = {
    bKash: '01788112233 (Personal)',
    Nagad: '01977223344 (Personal)',
    Rocket: '017881122338 (Personal)',
    'Binance USDT': 'TNP18aKmZ8792hBsm8912800'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.split(' ')[0]);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!senderNumber || !trxId) {
      alert(language === 'bn' ? 'সব তথ্য পূরণ করুন' : 'Fill all fields');
      return;
    }

    setIsSubmitting(true);
    const ok = await requestDeposit(depositMethod, depositAmount, senderNumber, trxId);
    setIsSubmitting(false);

    if (ok) {
      setDepositSuccess(true);
      setSenderNumber('');
      setTrxId('');
    }
  };

  const depositTransactions = transactions.filter(t => t.type === 'deposit');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Wallet Balance Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Buyer Main Balance */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t.mainBalance}</span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            ৳{user ? user.balanceBdt.toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-slate-400">
            {language === 'bn' ? 'জিমেইল কেনা ও সার্ভিসের জন্য' : 'For buying Gmails & services'}
          </p>
        </div>

        {/* Seller Earning Balance */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t.earningBalance}</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            ৳{user ? user.earningBdt.toFixed(2) : '0.00'}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'মেইল সেল আয়' : 'Gmail Sell Earnings'}
            </span>
            <button
              onClick={() => setCurrentView('withdraw')}
              className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
            >
              {language === 'bn' ? 'উইথড্র' : 'Withdraw'}
            </button>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t.totalWithdrawn}</span>
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-200">
            ৳{user ? user.totalWithdrawnBdt.toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-slate-400">
            {language === 'bn' ? 'বিকাশ ও নগদে সফল পেইড' : 'Successfully Paid Out'}
          </p>
        </div>
      </div>

      {/* Deposit Form & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                {t.depositHeading}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'নিচের দেওয়া নাম্বারে সেন্ড মানি করে ট্রানজেকশন আইডি সাবমিট করুন।'
                  : 'Send money to the number below and submit your TrxID.'}
              </p>
            </div>

            {depositSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'ডিপোজিট সফলভাবে ব্যালেন্সে যোগ হয়েছে! এখনই মার্কেটপ্লেস থেকে জিমেইল কিনতে পারেন।'
                    : 'Deposit approved and added to your balance!'}
                </span>
              </div>
            )}

            <form onSubmit={handleDepositSubmit} className="space-y-5">
              {/* Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t.selectMethod}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bKash', 'Nagad', 'Rocket', 'Binance USDT'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDepositMethod(m)}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                        depositMethod === m
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number to send box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{depositMethod} {language === 'bn' ? 'টাকা পাঠানোর নাম্বার:' : 'Number:'}</span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    {depositMethod === 'Binance USDT' ? 'USDT TRC20 Address' : 'Send Money Personal'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-mono font-bold text-base text-white truncate">
                    {accountNumbers[depositMethod]}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(accountNumbers[depositMethod])}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0 transition"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? t.copied : t.copy}</span>
                  </button>
                </div>
              </div>

              {/* Amount input & presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t.amount} ({t.minDepositLimit})
                </label>
                <input
                  type="number"
                  min={100}
                  step={10}
                  value={depositAmount}
                  onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-extrabold text-xl focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-2">
                  {[200, 500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender number and TrxID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {language === 'bn' ? 'যে নাম্বার থেকে পাঠিয়েছেন' : 'Your Sender Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={senderNumber}
                    onChange={e => setSenderNumber(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {t.trxId}
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={e => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. BKS99281729A"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>{language === 'bn' ? 'ভেরিফাই হচ্ছে...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {t.submitDeposit}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Guide & Info */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              {language === 'bn' ? 'ডিপোজিটের নিয়মাবলী' : 'Deposit Instructions'}
            </h3>

            <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside leading-relaxed">
              <li>বিকাশ/নগদ অ্যাপে গিয়ে "Send Money" অপশন সিলেক্ট করুন।</li>
              <li>উপরে দেওয়া সঠিক নাম্বারে কাঙ্ক্ষিত পরিমাণ টাকা পাঠান।</li>
              <li>পেমেন্ট সফল হওয়ার পর প্রাপ্ত TrxID টি সঠিকভাবে বক্সে পেস্ট করুন।</li>
              <li>সাবমিট করার সাথে সাথে আপনার বায়ার ব্যালেন্সে ফান্ড যুক্ত হবে।</li>
            </ol>

            <div className="border-t border-slate-800 pt-3">
              <p className="text-[11px] text-slate-400">
                যেকোনো সমস্যায় আমাদের ২৪/৭ লাইভ চ্যাট সাপোর্ট অথবা টেলিগ্রামে নক দিন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit History */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          {language === 'bn' ? 'আমার ডিপোজিট হিস্ট্রি' : 'Deposit History'}
        </h3>

        {depositTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {language === 'bn' ? 'এখনো কোনো ডিপোজিট হিস্ট্রি নেই।' : 'No deposit history.'}
          </p>
        ) : (
          <div className="space-y-2">
            {depositTransactions.map(tr => (
              <div
                key={tr.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{tr.method}</span>
                    <span className="font-mono text-slate-400">{tr.trxId}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{tr.createdAt}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-400">+৳{tr.amount.toFixed(2)}</span>
                  <p className="text-[10px] text-emerald-500 font-medium">সফল (Approved)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
