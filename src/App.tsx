import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { BuyerMarketplaceView } from './components/BuyerMarketplaceView';
import { SellersView } from './components/SellersView';
import { ExchangeView } from './components/ExchangeView';
import { BuyerWalletView } from './components/BuyerWalletView';
import { WithdrawView } from './components/WithdrawView';
import { BuyerOrdersView } from './components/BuyerOrdersView';
import { HistoryView } from './components/HistoryView';
import { ReviewsView } from './components/ReviewsView';
import { ReviewShifts } from './components/ReviewShifts';
import { MemberIdCardView } from './components/MemberIdCardView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LiveChatDrawer } from './components/LiveChatDrawer';
import { AdminView } from './components/AdminView';
import {
  ShieldCheck,
  Bell,
  Mail,
  X,
  Lock,
  User as UserIcon,
  Phone,
  Key,
  Database,
  Sparkles,
  Award,
  Zap,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { UserRole } from './types';

// Authentication Modal Component
const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    registerUser,
    loginAsAdmin,
    language
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('seller');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(email, password);
    } else {
      registerUser({
        name,
        email,
        phone,
        role
      });
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mail className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {authMode === 'login' ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'নতুন ফ্রি অ্যাকাউন্ট তৈরি করুন'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            মেইল ফ্যাক্টরি বিডি - নিরাপদ জিমেইল বাই ও সেল প্ল্যাটফর্ম
          </p>
        </div>

        {/* Quick Super Admin One-Click Button */}
        <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <div>
                <div className="text-xs font-bold text-emerald-300">ক্লাউড ফায়ারস্টোর সুপার এডমিন</div>
                <div className="text-[11px] text-slate-400 font-mono">soheltajbhola@gmail.com</div>
              </div>
            </div>
            <button
              type="button"
              id="auth-quick-admin-login"
              onClick={loginAsAdmin}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer shrink-0"
            >
              এডমিন লগইন
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              authMode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              authMode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            রেজিস্ট্রেশন (Register)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">আপনার পূর্ণ নাম:</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: সোহেল আহমেদ"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 block mb-1">ইমেইল অ্যাড্রেস:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">মোবাইল নম্বর (বিকাশ/নগদ):</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 block mb-1">পাসওয়ার্ড:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">অ্যাকাউন্টের উদ্দেশ্য:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['seller', 'buyer', 'both'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                      role === r
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {r === 'seller' ? 'মেইল বিক্রি' : r === 'buyer' ? 'মেইল কেনা' : 'উভয়ই'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            {authMode === 'login' ? 'লগইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            লগইন বা সাইন আপ করার মাধ্যমে আপনি মেইল ফ্যাক্টরির শর্তাবলী ও গোপনীয়তা নীতি মেনে নিচ্ছেন।
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Router & Layout
const AppContent: React.FC = () => {
  const { currentView, setCurrentView, siteNotice, language, isAdmin, loginAsAdmin } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Live Site Notice Ticker */}
      {siteNotice && (
        <div className="bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-600/90 text-slate-950 px-4 py-1.5 text-xs font-semibold shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="p-1 rounded-full bg-slate-950/20 text-slate-950 shrink-0">
                <Bell className="w-3 h-3 animate-bounce" />
              </span>
              <span className="truncate">{siteNotice}</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/20 shrink-0 hidden sm:inline">
              লাইভ আপডেট
            </span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'buy' && <BuyerMarketplaceView />}
        {currentView === 'sell' && <SellersView />}
        {currentView === 'exchange' && <ExchangeView />}
        {currentView === 'wallet' && <BuyerWalletView />}
        {currentView === 'withdraw' && <WithdrawView />}
        {currentView === 'orders' && <BuyerOrdersView />}
        {currentView === 'history' && <HistoryView />}
        {currentView === 'reviews' && <ReviewsView />}
        {currentView === 'review-shifts' && <ReviewShifts />}
        {currentView === 'member-card' && <MemberIdCardView />}
        {currentView === 'profile' && <MemberIdCardView />}
        {currentView === 'settings' && <MemberIdCardView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Drawers & Modals */}
      <NotificationDrawer />
      <LiveChatDrawer />
      <AuthModal />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 pt-10 pb-20 lg:pb-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Col */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
                  <Mail className="w-4 h-4 text-slate-950" />
                </div>
                <span className="text-base font-bold text-white font-serif">
                  Mail<span className="text-amber-400 font-sans">Factory</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                বাংলাদেশের বৃহত্তম ও স্বয়ংক্রিয় জিমেইল বায়-সেল ফ্যাক্টরি। দ্রুততম পেমেন্ট, ইনস্ট্যান্ট ডেলিভারি ও রিয়েলটাইম শিফট রেট।
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                  SSL Secured
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[10px]">
                  24/7 Live Support
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-3">সার্ভিস মেনু</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('buy')} className="hover:text-amber-400 transition cursor-pointer">
                    জিমেইল কিনুন (Marketplace)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('sell')} className="hover:text-emerald-400 transition cursor-pointer">
                    জিমেইল সেল ফ্যাক্টরি (Seller Submit)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('exchange')} className="hover:text-amber-400 transition cursor-pointer">
                    ব্যালেন্স এক্সচেঞ্জ (Balance Swap)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('review-shifts')} className="hover:text-amber-400 transition cursor-pointer">
                    শিফট সময়সূচি ও বোনাস রেট
                  </button>
                </li>
              </ul>
            </div>

            {/* Support & Admin */}
            <div>
              <h4 className="font-bold text-white mb-3">এডমিন ও অথরাইজেশন</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      if (isAdmin) {
                        setCurrentView('admin');
                      } else {
                        loginAsAdmin();
                      }
                    }}
                    className="hover:text-emerald-400 font-semibold text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    এডমিন প্যানেল (Admin Panel)
                  </button>
                </li>
                <li className="text-[11px] text-slate-500 font-mono">
                  সুপার এডমিন: soheltajbhola@gmail.com
                </li>
                <li>
                  <button onClick={() => setCurrentView('member-card')} className="hover:text-amber-400 transition cursor-pointer">
                    ডিজিটাল সেলার মেম্বারশিপ কার্ড
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('reviews')} className="hover:text-amber-400 transition cursor-pointer">
                    সেলার পেআউট প্রুফ ও রিভিউ
                  </button>
                </li>
              </ul>
            </div>

            {/* Gateways & Security */}
            <div>
              <h4 className="font-bold text-white mb-3">সমর্থিত পেমেন্ট মেথড</h4>
              <p className="text-[11px] text-slate-400 mb-2">
                বিকাশ, নগদ ও রকেটের মাধ্যমে মাত্র ৩-১৫ মিনিটে উইথড্র পেআউট নিশ্চিত করা হয়।
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded bg-pink-950/60 border border-pink-500/40 text-pink-300">
                  bKash
                </span>
                <span className="px-2.5 py-1 rounded bg-orange-950/60 border border-orange-500/40 text-orange-300">
                  Nagad
                </span>
                <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
                  Rocket
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 MailFactory Bangladesh. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                সার্ভার স্ট্যাটাস: ১০০% সচল
              </span>
              <span>Cloud Firestore Synced</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
