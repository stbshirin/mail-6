import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Mail,
  Wallet,
  Bell,
  MessageSquare,
  Globe,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CreditCard,
  History,
  FileCheck,
  Award,
  Settings,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    language,
    setLanguage,
    notifications,
    setIsNotificationsOpen,
    setIsChatOpen,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    isAdmin,
    loginAsAdmin
  } = useApp();

  const t = getTranslation(language);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top micro banner with Live shift ticker */}
      <div className="bg-gradient-to-r from-amber-600/20 via-emerald-600/20 to-amber-600/20 border-b border-amber-500/10 px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {language === 'bn' ? 'সন্ধ্যা শিফট চালু:' : 'Active Shift:'}
            </span>
            <span className="text-slate-300 hidden sm:inline">
              {language === 'bn'
                ? 'ফ্রেশ জিমেইল রেট ৳৯.৫০ + শিফট বোনাস ৳১.০০ = ৳১০.৫০/মেইল!'
                : 'Fresh Gmail Rate ৳9.50 + Bonus ৳1.00 = ৳10.50/mail!'}
            </span>
            <span className="text-slate-300 sm:hidden">
              {language === 'bn' ? 'রেট ৳১০.৫০/মেইল!' : 'Rate ৳10.50/mail!'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.minWithdraw}
            </span>
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="brand-logo-btn"
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-serif">
                Mail<span className="text-amber-400 font-sans">Factory</span>
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              {language === 'bn' ? 'মেইল ক্রয়-বিক্রয় ও এক্সচেঞ্জ' : 'Buy, Sell & Exchange'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            id="nav-home-btn"
            onClick={() => setCurrentView('home')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'home'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.home}
          </button>
          <button
            id="nav-buy-btn"
            onClick={() => setCurrentView('buy')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'buy'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t.buyMarketplace}
          </button>
          <button
            id="nav-sell-btn"
            onClick={() => setCurrentView('sell')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'sell'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t.sellGmails}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
          <button
            id="nav-exchange-btn"
            onClick={() => setCurrentView('exchange')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'exchange'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.exchange}
          </button>
          <button
            id="nav-shifts-btn"
            onClick={() => setCurrentView('review-shifts')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'review-shifts' || currentView === 'reviews'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.reviews}
          </button>
          <button
            id="nav-member-card-btn"
            onClick={() => setCurrentView('member-card')}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition cursor-pointer ${
              currentView === 'member-card'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 inline mr-1 text-amber-400" />
            {t.memberCard}
          </button>

          {/* Admin Panel Navigation Button */}
          <button
            id="nav-admin-btn"
            onClick={() => {
              if (isAdmin) {
                setCurrentView('admin');
              } else {
                loginAsAdmin();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              currentView === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50 border border-emerald-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>এডমিন</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Cloud
            </span>
          </button>
        </nav>

        {/* Right Section Actions & User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Wallet quick balance pill */}
              <div
                id="wallet-pill-btn"
                onClick={() => setCurrentView('wallet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition shadow-inner"
              >
                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-slate-400 font-medium">
                    {language === 'bn' ? 'সেলার ব্যালেন্স' : 'Earnings'}
                  </p>
                  <p className="text-sm font-bold text-emerald-400">
                    ৳{user.earningBdt.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Notification icon */}
              <button
                id="open-notifications-btn"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={t.notifications}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Live Chat icon */}
              <button
                id="open-livechat-btn"
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={t.liveChat}
              >
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-dropdown-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/40"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {user.memberId}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                            {user.tier}
                          </span>
                        </div>
                      </div>

                      {/* Admin Access inside Dropdown */}
                      <button
                        id="dropdown-admin-panel-btn"
                        onClick={() => {
                          if (isAdmin) {
                            setCurrentView('admin');
                          } else {
                            loginAsAdmin();
                          }
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition text-left cursor-pointer mb-1.5"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          এডমিন প্যানেল
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          {user.email.toLowerCase() === 'soheltajbhola@gmail.com' ? 'Super Admin' : 'Admin'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-amber-400" />
                        {t.profile}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('orders');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-blue-400" />
                        {t.myOrders}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('history');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
                      >
                        <History className="w-4 h-4 text-emerald-400" />
                        {t.history}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        {t.settings}
                      </button>

                      <div className="border-t border-slate-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.logout}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                {t.login}
              </button>
              <button
                id="nav-register-btn"
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
