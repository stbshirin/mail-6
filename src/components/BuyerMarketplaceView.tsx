import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import { MarketplaceItem } from '../types';
import {
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Search,
  Filter,
  CreditCard,
  Wallet,
  Copy,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const BuyerMarketplaceView: React.FC = () => {
  const {
    language,
    marketplaceItems,
    buyGmails,
    user,
    setIsAuthModalOpen,
    setCurrentView
  } = useApp();

  const t = getTranslation(language);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [purchaseQty, setPurchaseQty] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'bkash' | 'nagad'>('balance');
  const [directTrxId, setDirectTrxId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);

  const paymentNumbers = {
    bkash: '01748247931',
    nagad: '01748247931'
  };

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBuyModal = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setPurchaseQty(item.minQty);
    setDirectTrxId('');
    setPaymentMethod(user && user.balanceBdt >= item.priceBdt * item.minQty ? 'balance' : 'bkash');
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);
    const success = await buyGmails(selectedItem.id, purchaseQty, paymentMethod, directTrxId);
    setIsProcessing(false);

    if (success) {
      setSelectedItem(null);
      setCurrentView('orders');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
            <ShoppingBag className="w-3.5 h-3.5" />
            {language === 'bn' ? 'অফিসিয়াল জিমেইল মার্কেটপ্লেস' : 'Official Gmail Marketplace'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {t.buyerHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {t.buyerSubheading}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', labelBn: 'সকল প্যাকেজ', labelEn: 'All Packages' },
            { id: 'fresh', labelBn: 'ফ্রেশ ২০২৬', labelEn: 'Fresh 2026' },
            { id: 'aged', labelBn: 'ওল্ড জিমেইল', labelEn: 'Aged Gmails' },
            { id: 'us_ip', labelBn: 'ইউএসএ PVA', labelEn: 'USA PVA' },
            { id: 'bulk', labelBn: 'বাল্ক প্যাক', labelEn: 'Bulk Packs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'bn' ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 hover:border-amber-500/50 transition flex flex-col justify-between shadow-xl group"
          >
            {item.badge && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold shadow-md">
                {item.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'bn' ? 'স্টক:' : 'Stock:'} {item.stock} {language === 'bn' ? 'টি' : 'pcs'}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition">
                  {language === 'bn' ? item.titleBn : item.titleEn}
                </h3>
              </div>

              {/* Price Row */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-amber-400">
                    ৳{item.priceBdt.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    / {language === 'bn' ? 'পিস' : 'pcs'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  ≈ ${item.priceUsd.toFixed(2)} USD
                </span>
              </div>

              {/* Rating & Warranty */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <strong className="text-white">{item.rating}</strong> ({item.salesCount}+ {language === 'bn' ? 'বিক্রয়' : 'sold'})
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {item.warrantyHours / 24} {language === 'bn' ? 'দিনের ওয়ারেন্টি' : 'Days Warranty'}
                </span>
              </div>

              {/* Feature bullet points */}
              <ul className="space-y-2 text-xs text-slate-300">
                {(language === 'bn' ? item.featuresBn : item.featuresEn).map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buy Action Button */}
            <div className="pt-6 mt-2">
              <button
                onClick={() => handleOpenBuyModal(item)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                {language === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {language === 'bn' ? 'ইনস্ট্যান্ট চেকআউট' : 'Instant Checkout'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {language === 'bn' ? selectedItem.titleBn : selectedItem.titleEn}
              </h3>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'bn' ? 'পরিমাণ (মিনিমাম ১০টি)' : 'Quantity (Min 10 pcs)'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={selectedItem.minQty}
                  max={selectedItem.stock}
                  value={purchaseQty}
                  onChange={e => setPurchaseQty(Math.max(selectedItem.minQty, parseInt(e.target.value) || selectedItem.minQty))}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-lg focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-1.5">
                  {[20, 50, 100].map(q => (
                    <button
                      key={q}
                      onClick={() => setPurchaseQty(q)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      +{q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'bn' ? 'একক মূল্য' : 'Unit Price'}:</span>
                <span className="font-bold text-white">৳{selectedItem.priceBdt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'bn' ? 'পরিমাণ' : 'Quantity'}:</span>
                <span className="font-bold text-white">{purchaseQty} {language === 'bn' ? 'টি' : 'pcs'}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-sm">
                <span className="font-bold text-white">{language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Amount'}:</span>
                <span className="font-extrabold text-amber-400 text-lg">
                  ৳{(selectedItem.priceBdt * purchaseQty).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Payment Method'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('balance')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    paymentMethod === 'balance'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wallet className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">{language === 'bn' ? 'ওয়ালেট' : 'Wallet'}</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                  <span className="text-xs">bKash</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                  <span className="text-xs">Nagad</span>
                </button>
              </div>

              {/* Direct Payment Instructions */}
              {paymentMethod !== 'balance' ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {paymentMethod.toUpperCase()} Personal Send Money:
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      <span className="font-mono font-bold text-white">
                        {paymentNumbers[paymentMethod as 'bkash' | 'nagad']}
                      </span>
                      <button
                        onClick={() => copyToClipboard(paymentNumbers[paymentMethod as 'bkash' | 'nagad'])}
                        className="text-amber-400 hover:text-amber-300 cursor-pointer"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">
                      {language === 'bn' ? 'টাকা পাঠিয়ে ট্রানজেকশন আইডি (TrxID) লিখুন:' : 'Enter TrxID after sending:'}
                    </label>
                    <input
                      type="text"
                      value={directTrxId}
                      onChange={e => setDirectTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. BKS99281729A"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono uppercase text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {language === 'bn' ? 'বর্তমান বায়ার ব্যালেন্স:' : 'Current Balance:'}
                  </span>
                  <span className="font-bold text-emerald-400">
                    ৳{user ? user.balanceBdt.toFixed(2) : '0.00'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Submit */}
            <button
              disabled={isProcessing}
              onClick={handleConfirmPurchase}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>{language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {language === 'bn'
                    ? `৳${(selectedItem.priceBdt * purchaseQty).toFixed(2)} পরিশোধ ও জিমেইল নিন`
                    : `Pay ৳${(selectedItem.priceBdt * purchaseQty).toFixed(2)} & Get Gmails`}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
