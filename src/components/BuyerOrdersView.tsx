import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import { BuyerOrder } from '../types';
import {
  FileCheck,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Mail,
  ShoppingBag
} from 'lucide-react';

export const BuyerOrdersView: React.FC = () => {
  const { language, buyerOrders, setCurrentView } = useApp();
  const t = getTranslation(language);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(buyerOrders[0]?.id || null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const handleCopyAll = (order: BuyerOrder) => {
    const text = order.accounts
      .map(acc => `${acc.email}:${acc.pass}${acc.recovery ? `:${acc.recovery}` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleDownloadTxt = (order: BuyerOrder) => {
    const text = order.accounts
      .map(acc => `${acc.email}:${acc.pass}${acc.recovery ? `:${acc.recovery}` : ''}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MailFactory_Order_${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/40">
            <FileCheck className="w-3.5 h-3.5" />
            {language === 'bn' ? 'অর্ডার ভল্ট' : 'Orders Vault'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.myOrders}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'bn'
              ? 'আপনার ক্রয়কৃত সকল জিমেইলের ইউজারনেম, পাসওয়ার্ড ও রিকভারি ফাইল ডাউনলোড করুন।'
              : 'Access your purchased Gmail credentials and download files.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('buy')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer shrink-0"
        >
          {language === 'bn' ? '+ নতুন জিমেইল কিনুন' : '+ Buy More'}
        </button>
      </div>

      {/* Orders List */}
      {buyerOrders.length === 0 ? (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-lg text-white">
            {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Orders Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {language === 'bn'
              ? 'মার্কেটপ্লেস থেকে সাশ্রয়ী মূল্যে ভেরিফাইড জিমেইল কিনতে বাই জিমেইল পেজে যান।'
              : 'Browse our marketplace to buy premium verified Gmail accounts.'}
          </p>
          <button
            onClick={() => setCurrentView('buy')}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
          >
            {language === 'bn' ? 'মার্কেটপ্লেস ব্রাউজ করুন' : 'Browse Marketplace'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl transition"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{order.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                        {language === 'bn' ? 'সম্পন্ন (Completed)' : 'Completed'}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">{order.purchasedAt}</span>
                    </div>
                    <p className="font-semibold text-sm text-amber-400">{order.itemTitle}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyAll(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition"
                    >
                      {copiedOrderId === order.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{copiedOrderId === order.id ? t.copied : language === 'bn' ? 'সব কপি করুন' : 'Copy All'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadTxt(order)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'TXT ডাউনলোড' : 'Download TXT'}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Details Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'পরিমাণ' : 'Quantity'}:</span>
                    <p className="font-bold text-white text-sm mt-0.5">{order.quantity} {language === 'bn' ? 'টি' : 'pcs'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'মোট পরিশোধ' : 'Total Paid'}:</span>
                    <p className="font-bold text-emerald-400 text-sm mt-0.5">৳{order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'ওয়ারেন্টি স্থিতি' : 'Warranty'}:</span>
                    <p className="font-bold text-teal-400 text-sm mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {order.warrantyExpireAt}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">{language === 'bn' ? 'ডেলিভারি মেথড' : 'Delivery'}:</span>
                    <p className="font-bold text-white text-sm mt-0.5">Instant Vault</p>
                  </div>
                </div>

                {/* Expanded Accounts Credentials List */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold uppercase tracking-wider">
                        {language === 'bn' ? 'জিমেইল ও পাসওয়ার্ড লিস্ট' : 'Credentials List'}
                      </span>
                      <span>Format: email:password:recovery</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                      {order.accounts.map((acc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 border-b border-slate-900 last:border-0 hover:text-white"
                        >
                          <span className="select-all">
                            {acc.email}:{acc.pass}{acc.recovery ? `:${acc.recovery}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
