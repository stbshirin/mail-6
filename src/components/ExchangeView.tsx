import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Repeat,
  ArrowDownUp,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  DollarSign
} from 'lucide-react';

export const ExchangeView: React.FC = () => {
  const {
    language,
    user,
    performExchange,
    setIsAuthModalOpen,
    transactions
  } = useApp();

  const t = getTranslation(language);

  const [fromCurrency, setFromCurrency] = useState('Seller Earning (BDT)');
  const [toCurrency, setToCurrency] = useState('Buyer Balance (BDT)');
  const [amountFrom, setAmountFrom] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Exchange rates
  // Earning BDT -> Buyer BDT: 1:1 (No fee)
  // USD -> BDT: 1 USD = 124.50 BDT
  // BDT -> USD: 128.00 BDT = 1 USD
  const getExchangeRate = () => {
    if (fromCurrency.includes('USD') && toCurrency.includes('BDT')) {
      return 124.50;
    }
    if (fromCurrency.includes('BDT') && toCurrency.includes('USD')) {
      return 1 / 128.00;
    }
    return 1.0; // 1:1 for BDT Earning -> BDT Buyer
  };

  const rate = getExchangeRate();
  const calculatedTo = amountFrom * rate;
  const serviceFee = fromCurrency.includes('USD') || toCurrency.includes('USD') ? amountFrom * 0.01 : 0;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleExecuteExchange = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (amountFrom <= 0) {
      alert(language === 'bn' ? 'সঠিক পরিমাণ দিন' : 'Enter valid amount');
      return;
    }

    setIsProcessing(true);
    const ok = await performExchange(fromCurrency, toCurrency, amountFrom, calculatedTo);
    setIsProcessing(false);

    if (ok) {
      setSuccessNotice(
        language === 'bn'
          ? `সফলভাবে ${amountFrom} (${fromCurrency}) থেকে ${calculatedTo.toFixed(2)} (${toCurrency}) এক্সচেঞ্জ হয়েছে!`
          : `Successfully swapped ${amountFrom} to ${calculatedTo.toFixed(2)}!`
      );
      setTimeout(() => setSuccessNotice(null), 5000);
    }
  };

  const exchangeTransactions = transactions.filter(t => t.type === 'exchange');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/40">
            <Repeat className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ইনস্ট্যান্ট কারেন্সি সোয়াপ' : 'Instant Currency Swap'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {t.exchangeHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {t.exchangeSubheading}
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Exchange Converter Box */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-center">
          {/* Send Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">{t.youSend}</span>
              <span>
                {language === 'bn' ? 'উপলব্ধ ব্যালেন্স:' : 'Available:'}{' '}
                <strong className="text-emerald-400">
                  {fromCurrency.includes('USD')
                    ? `$${user ? user.balanceUsd.toFixed(2) : '0.00'}`
                    : `৳${user ? user.earningBdt.toFixed(2) : '0.00'}`}
                </strong>
              </span>
            </div>

            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Seller Earning (BDT)">Seller Earning Balance (BDT)</option>
              <option value="USD (Binance USDT)">USD (Binance USDT)</option>
              <option value="Buyer Balance (BDT)">Buyer Main Balance (BDT)</option>
            </select>

            <input
              type="number"
              min={1}
              value={amountFrom}
              onChange={e => setAmountFrom(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-extrabold text-2xl focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Swap Trigger Button (Mobile + Desktop Center) */}
          <div className="flex justify-center -my-3 md:my-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-lg shadow-blue-500/25 transition cursor-pointer transform active:rotate-180"
              title="Swap Currencies"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          {/* Receive Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">{t.youReceive}</span>
              <span className="text-emerald-400 font-medium">ইনস্ট্যান্ট ট্রান্সফার</span>
            </div>

            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Buyer Balance (BDT)">Buyer Main Balance (BDT)</option>
              <option value="USD (Binance USDT)">USD (Binance USDT)</option>
              <option value="Seller Earning (BDT)">Seller Earning Balance (BDT)</option>
            </select>

            <div className="w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-400 font-extrabold text-2xl">
              {toCurrency.includes('USD') ? `$${calculatedTo.toFixed(2)}` : `৳${calculatedTo.toFixed(2)}`}
            </div>
          </div>
        </div>

        {/* Rate breakdown card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{t.exchangeRate}:</span>
            <span className="font-bold text-white">
              {fromCurrency.includes('USD') ? '1 USD = ৳124.50 BDT' : '1 BDT = 1 BDT (0% Fee)'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{t.fee}:</span>
            <span className="font-bold text-emerald-400">৳0.00 (ফ্রি এক্সচেঞ্জ)</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={isProcessing}
          onClick={handleExecuteExchange}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-extrabold text-base shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
        >
          {isProcessing ? (
            <span>{language === 'bn' ? 'এক্সচেঞ্জ হচ্ছে...' : 'Exchanging...'}</span>
          ) : (
            <>
              <Repeat className="w-5 h-5" />
              {t.startExchange}
            </>
          )}
        </button>
      </div>

      {/* Exchange History */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          {language === 'bn' ? 'সাম্প্রতিক এক্সচেঞ্জ লগ' : 'Recent Exchange Logs'}
        </h3>

        {exchangeTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {language === 'bn' ? 'এখনো কোনো এক্সচেঞ্জ ট্রানজেকশন নেই।' : 'No exchange transactions found.'}
          </p>
        ) : (
          <div className="space-y-2">
            {exchangeTransactions.map(tr => (
              <div
                key={tr.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">
                    {language === 'bn' ? tr.descriptionBn : tr.descriptionEn}
                  </p>
                  <span className="text-[10px] text-slate-400">{tr.createdAt}</span>
                </div>
                <span className="font-bold text-emerald-400">৳{tr.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
