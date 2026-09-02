import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  Repeat,
  Gift,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { language, transactions } = useApp();
  const t = getTranslation(language);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTrx, setSearchTrx] = useState<string>('');

  const filteredTransactions = transactions.filter(tr => {
    const matchesFilter = filterType === 'all' || tr.type === filterType;
    const matchesSearch =
      tr.id.toLowerCase().includes(searchTrx.toLowerCase()) ||
      (tr.trxId && tr.trxId.toLowerCase().includes(searchTrx.toLowerCase())) ||
      tr.descriptionBn.toLowerCase().includes(searchTrx.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdraw':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'buy':
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      case 'sell':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'exchange':
        return <Repeat className="w-4 h-4 text-purple-400" />;
      default:
        return <Gift className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-2 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
          <History className="w-3.5 h-3.5" />
          {language === 'bn' ? 'অডিট লেজার' : 'Audit Ledger'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.history}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {language === 'bn'
            ? 'আপনার সকল ডিপোজিট, উইথড্র, ক্রয়, বিক্রয় ও এক্সচেঞ্জ লেনদেনের সার্বিক হিসেব।'
            : 'Complete record of all your financial transactions on Mail Factory.'}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', labelBn: 'সকল' },
            { id: 'sell', labelBn: 'মেইল বিক্রয়' },
            { id: 'withdraw', labelBn: 'উইথড্র' },
            { id: 'deposit', labelBn: 'ডিপোজিট' },
            { id: 'buy', labelBn: 'ক্রয়' },
            { id: 'exchange', labelBn: 'এক্সচেঞ্জ' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterType === f.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.labelBn}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTrx}
            onChange={e => setSearchTrx(e.target.value)}
            placeholder="Search TrxID / Description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Ledger Table / List */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-3 shadow-xl">
        {filteredTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            {language === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transaction records found.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map(tr => (
              <div
                key={tr.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(tr.type)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      {language === 'bn' ? tr.descriptionBn : tr.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{tr.id}</span>
                      {tr.trxId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-amber-400">TrxID: {tr.trxId}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{tr.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span
                    className={`text-base font-extrabold ${
                      tr.type === 'withdraw' || tr.type === 'buy' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {tr.type === 'withdraw' || tr.type === 'buy' ? '-' : '+'}৳{tr.amount.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'bn' ? 'সফল (Completed)' : 'Completed'}
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
