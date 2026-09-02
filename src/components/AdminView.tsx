import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Search,
  Sliders,
  Bell,
  Mail,
  RefreshCw,
  Eye,
  Lock,
  Sparkles,
  TrendingUp,
  CreditCard,
  UserCheck,
  UserX,
  Send,
  Database,
  Key
} from 'lucide-react';
import { MarketplaceItem, User, UserRole, ShiftInfo } from '../types';

export const AdminView: React.FC = () => {
  const {
    user,
    language,
    isAdmin,
    adminEmails,
    addAdminEmail,
    removeAdminEmail,
    loginAsAdmin,
    allUsers,
    updateUserByAdmin,
    adjustUserBalance,
    toggleUserBan,
    marketplaceItems,
    addMarketplaceItem,
    updateMarketplaceItem,
    deleteMarketplaceItem,
    addStockToMarketplaceItem,
    sellSubmissions,
    approveSellBatch,
    rejectSellBatch,
    transactions,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    shifts,
    updateShift,
    toggleShiftActive,
    addShift,
    paymentSettings,
    updatePaymentSettings,
    siteNotice,
    setSiteNotice,
    reviews,
    deleteReview,
    setCurrentView
  } = useApp();

  type AdminTab =
    | 'overview'
    | 'users'
    | 'admins'
    | 'marketplace'
    | 'batches'
    | 'deposits'
    | 'withdrawals'
    | 'shifts'
    | 'settings'
    | 'reviews';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Filter & Search states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');

  // New admin email input
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Balance adjustment modal
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustField, setAdjustField] = useState<'balanceBdt' | 'earningBdt'>('balanceBdt');
  const [adjustReason, setAdjustReason] = useState('');

  // New product state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    titleBn: '',
    titleEn: '',
    category: 'fresh' as 'fresh' | 'aged' | 'recovery' | 'google_voice',
    year: '2026',
    priceBdt: 12.00,
    priceUsd: 0.11,
    stock: 500,
    minOrder: 10,
    maxOrder: 1000,
    deliveryType: 'instant' as const,
    format: 'mail:pass:recovery',
    featuresBn: 'আউটলুক রিকভারি মেইল যুক্ত, ৭ দিনের ওয়ারেন্টি',
    featuresEn: 'Outlook recovery included, 7-day warranty'
  });

  // Batch inspection modal
  const [inspectBatchId, setInspectBatchId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalBatchId, setRejectModalBatchId] = useState<string | null>(null);

  // Withdrawal payout TrxID modal
  const [payoutModalTrxId, setPayoutModalTrxId] = useState<string | null>(null);
  const [payoutCustomTrxId, setPayoutCustomTrxId] = useState('');

  // Shift edit state
  const [editingShift, setEditingShift] = useState<ShiftInfo | null>(null);

  // Calculations
  const totalUsersCount = allUsers.length;
  const pendingBatches = sellSubmissions.filter(b => b.status === 'verifying' || b.status === 'pending');
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');
  const totalPendingActions = pendingBatches.length + pendingDeposits.length + pendingWithdrawals.length;

  const totalMarketplaceStock = marketplaceItems.reduce((acc, item) => acc + item.stock, 0);
  const totalSoldAllTime = allUsers.reduce((acc, u) => acc + (u.totalSoldMails || 0), 0);
  const totalPlatformDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalPlatformWithdrawals = transactions
    .filter(t => t.type === 'withdraw' && t.status === 'approved')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch) ||
      u.memberId.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' ? true : u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const inspectedBatch = sellSubmissions.find(b => b.id === inspectBatchId);

  return (
    <div id="admin-panel-container" className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      {/* Top Banner & Super Admin Verification bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-800 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  মেইল ফ্যাক্টরি এডমিন প্যানেল
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold">
                    Super Admin Active
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                ক্লাউড ফায়ারস্টোর অ্যাডমিন অথেন্টিকেশন: <span className="text-emerald-300 font-mono font-medium">soheltajbhola@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isAdmin || user?.email.toLowerCase() !== 'soheltajbhola@gmail.com' ? (
              <button
                id="btn-admin-switch-sohel"
                onClick={loginAsAdmin}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                লগইন এজ soheltajbhola@gmail.com
              </button>
            ) : (
              <div className="px-3 py-1.5 text-xs rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>লগইন আছেন: <strong className="text-white">Sohel Taj (Super Admin)</strong></span>
              </div>
            )}
            <button
              id="btn-admin-exit-to-home"
              onClick={() => setCurrentView('home')}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              মূল সাইটে যান
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {[
            { id: 'overview', label: 'ওভারভিউ', icon: TrendingUp, count: totalPendingActions > 0 ? totalPendingActions : null },
            { id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: Users, count: allUsers.length },
            { id: 'admins', label: 'এডমিন একাউন্ট ও পারমিশন', icon: ShieldCheck, badge: 'soheltajbhola' },
            { id: 'batches', label: 'সেলার মেইল ব্যাচ', icon: Mail, count: pendingBatches.length > 0 ? pendingBatches.length : null },
            { id: 'marketplace', label: 'মার্কেটপ্লেস ও স্টক', icon: ShoppingBag, count: marketplaceItems.length },
            { id: 'deposits', label: 'ডিপোজিট রিকোয়েস্ট', icon: ArrowDownToLine, count: pendingDeposits.length > 0 ? pendingDeposits.length : null },
            { id: 'withdrawals', label: 'উইথড্র পেমেন্ট', icon: ArrowUpFromLine, count: pendingWithdrawals.length > 0 ? pendingWithdrawals.length : null },
            { id: 'shifts', label: 'শিফট ও বোনাস রেট', icon: Clock, count: shifts.length },
            { id: 'settings', label: 'পেমেন্ট গেটওয়ে ও নোটিশ', icon: Sliders },
            { id: 'reviews', label: 'রিভিউ মডারেশন', icon: Sparkles, count: reviews.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-mono">
                    Cloud
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs">মোট রেজিস্টার্ড ইউজার</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">{totalUsersCount} জন</div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  সেলার ও বায়ার রিয়েলটাইম একাউন্ট
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs">মার্কেটপ্লেস লাইভ স্টক</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-2">{totalMarketplaceStock.toLocaleString()} টি</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {marketplaceItems.length} টি ক্যাটাগরিতে রেডি
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs">মোট ডিপোজিট ভলিউম</span>
                  <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">৳{totalPlatformDeposits.toLocaleString()}</div>
                <div className="text-[11px] text-cyan-400 mt-1">বায়ার ওয়ালেট ফান্ডিং</div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs">মোট পেইড উইথড্রয়াল</span>
                  <ArrowUpFromLine className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">৳{totalPlatformWithdrawals.toLocaleString()}</div>
                <div className="text-[11px] text-amber-400 mt-1">বিকাশ ও নগদ ক্যাশআউট</div>
              </div>
            </div>

            {/* Action Required Banner */}
            {totalPendingActions > 0 ? (
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200">
                      আপনার তাৎক্ষণিক অনুমোদনের অপেক্ষায় {totalPendingActions}টি রিকোয়েস্ট রয়েছে!
                    </h3>
                    <p className="text-xs text-amber-400/80 mt-0.5">
                      সেলার ব্যাচ: {pendingBatches.length}টি | ডিপোজিট: {pendingDeposits.length}টি | উইথড্রয়াল: {pendingWithdrawals.length}টি
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pendingBatches.length > 0 && (
                    <button
                      onClick={() => setActiveTab('batches')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      ব্যাচ দেখুন
                    </button>
                  )}
                  {pendingWithdrawals.length > 0 && (
                    <button
                      onClick={() => setActiveTab('withdrawals')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      উইথড্র অনুমোদন
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-300 font-medium">
                  সব রিকোয়েস্ট ক্লিয়ার আছে! কোনো পেন্ডিং সেলার ব্যাচ বা উইথড্রয়াল জমা নেই।
                </p>
              </div>
            )}

            {/* Quick Management Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Key className="w-4 h-4 text-emerald-400" />
                  সুপার এডমিন অ্যাকাউন্ট
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">নির্ধারিত ইমেইল:</span>
                    <span className="font-mono text-emerald-300 font-semibold">soheltajbhola@gmail.com</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">স্ট্যাটাস:</span>
                    <span className="text-emerald-400 font-semibold">ফুল কন্ট্রোল (Full Master)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">ফায়ারস্টোর ডাটাবেস:</span>
                    <span className="text-indigo-300 font-semibold">Active & Synced</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('admins')}
                  className="w-full mt-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                >
                  এডমিন পারমিশন ম্যানেজ করুন
                </button>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-400" />
                  বর্তমান লাইভ শিফট রেট
                </h3>
                {shifts.filter(s => s.isActive).map(s => (
                  <div key={s.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">শিফটের নাম:</span>
                      <span className="text-amber-300 font-semibold">{s.titleBn}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/60">
                      <span className="text-slate-400">মেইল প্রতি রেট:</span>
                      <span className="text-white font-bold">৳{s.ratePerMail.toFixed(2)} + ৳{s.bonusPerMail.toFixed(2)} বোনাস</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">মোট রেট:</span>
                      <span className="text-emerald-400 font-bold">৳{(s.ratePerMail + s.bonusPerMail).toFixed(2)} / মেইল</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setActiveTab('shifts')}
                  className="w-full mt-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                >
                  শিফট রেট পরিবর্তন করুন
                </button>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  পেমেন্ট গেটওয়ে নম্বর
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">বিকাশ পার্সোনাল:</span>
                    <span className="font-mono text-pink-400 font-medium">{paymentSettings.bkashNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/60">
                    <span className="text-slate-400">নগদ পার্সোনাল:</span>
                    <span className="font-mono text-orange-400 font-medium">{paymentSettings.nagadNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">রকেট নম্বর:</span>
                    <span className="font-mono text-purple-400 font-medium">{paymentSettings.rocketNumber}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full mt-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                >
                  পেমেন্ট ইনফো এডিট করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="mt-6 space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ইউজারের নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {(['all', 'admin', 'seller', 'buyer', 'both'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize cursor-pointer transition-colors ${
                      userRoleFilter === role
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {role === 'all' ? 'সবাই' : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">ইউজার প্রোফাইল</th>
                      <th className="p-3.5">রোল (Role)</th>
                      <th className="p-3.5">বায়ার ব্যালেন্স</th>
                      <th className="p-3.5">সেলার আর্নিং</th>
                      <th className="p-3.5">মেইল ট্রানজেকশন</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredUsers.map(u => {
                      const isSuperAdmin = u.email.toLowerCase() === 'soheltajbhola@gmail.com';
                      return (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-600"
                              />
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1.5">
                                  {u.name}
                                  {isSuperAdmin && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                      👑 Master
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                                <div className="text-[10px] text-slate-500">{u.phone} • ID: {u.memberId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                                u.role === 'admin'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : u.role === 'seller'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : u.role === 'buyer'
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-cyan-500/20 text-cyan-400'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-400">
                            ৳{u.balanceBdt.toFixed(2)}
                          </td>
                          <td className="p-3.5 font-semibold text-amber-400">
                            ৳{u.earningBdt.toFixed(2)}
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <div>সেল: {u.totalSoldMails || 0} টি</div>
                            <div className="text-[10px] text-slate-400">বাই: {u.totalBoughtMails || 0} টি</div>
                          </td>
                          <td className="p-3.5">
                            {u.isBanned ? (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-semibold">
                                নিষিদ্ধ (Banned)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                                সক্রিয় (Active)
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Balance adjustment */}
                              <button
                                title="ব্যালেন্স অ্যাডজাস্ট করুন"
                                onClick={() => {
                                  setAdjustingUser(u);
                                  setAdjustAmount(100);
                                  setAdjustReason('');
                                }}
                                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-emerald-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>ব্যালেন্স</span>
                              </button>

                              {/* Toggle Role */}
                              {!isSuperAdmin && (
                                <button
                                  title="রোল পরিবর্তন"
                                  onClick={() => {
                                    const nextRole: UserRole =
                                      u.role === 'seller' ? 'buyer' : u.role === 'buyer' ? 'admin' : u.role === 'admin' ? 'both' : 'seller';
                                    updateUserByAdmin(u.id, { role: nextRole });
                                  }}
                                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Ban / Unban */}
                              {!isSuperAdmin && (
                                <button
                                  title={u.isBanned ? 'আনব্যান করুন' : 'ব্যান করুন'}
                                  onClick={() => toggleUserBan(u.id)}
                                  className={`p-1.5 rounded cursor-pointer ${
                                    u.isBanned
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                  }`}
                                >
                                  {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN ACCOUNTS & FIRESTORE PERMISSIONS */}
        {activeTab === 'admins' && (
          <div className="mt-6 space-y-6">
            {/* Primary Super Admin Card */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border-2 border-emerald-500/40 rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
                    👑
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                      Primary Master Super Admin
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      soheltajbhola@gmail.com
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ক্লাউড ফায়ারস্টোর (Cloud Firestore) থেকে এই ইমেইলটি প্ল্যাটফর্মের প্রধান এডমিন হিসেবে নির্ধারিত। এর সমস্ত আর্থিক অনুমোদন ও ডাটাবেস পরিবর্তন করার সর্বোচ্চ ক্ষমতা রয়েছে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loginAsAdmin}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="w-4 h-4" />
                    এই একাউন্টে লগইন করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Emails List & Add Form */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                অনুমোদিত এডমিন তালিকা (Firestore Admin Collection)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                যেকোনো ইউজার যখন নিচের ইমেইলগুলো দিয়ে লগইন করবেন, সিস্টেম স্বয়ংক্রিয়ভাবে তাকে সম্পূর্ণ এডমিন এক্সেস প্রদান করবে।
              </p>

              {/* Add new admin */}
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <input
                  type="email"
                  placeholder="নতুন এডমিনের জিমেইল অ্যাড্রেস লিখুন..."
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (newAdminEmail.trim()) {
                      addAdminEmail(newAdminEmail.trim());
                      setNewAdminEmail('');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  এডমিন যোগ করুন
                </button>
              </div>

              {/* List of active admin emails */}
              <div className="space-y-2">
                {adminEmails.map((email, idx) => {
                  const isPrimary = email.toLowerCase() === 'soheltajbhola@gmail.com';
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isPrimary
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-mono text-xs font-medium">{email}</span>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Root Super Admin
                          </span>
                        )}
                      </div>

                      {!isPrimary && (
                        <button
                          onClick={() => removeAdminEmail(email)}
                          className="text-red-400 hover:text-red-300 text-xs p-1 cursor-pointer"
                          title="এডমিন মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cloud Firestore Integration Schema Display */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-indigo-400" />
                ফায়ারস্টোর পারমিশন রুলস আর্কিটেকচার (Cloud Firestore Security Rule)
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                ক্লাউড ফায়ারস্টোর ডেটাবেসে এডমিন অথেন্টিকেশন ও অ্যাক্সেস কনট্রোল নিশ্চিত করার আর্কিটেকচার:
              </p>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400/90 overflow-x-auto">
{`// Cloud Firestore Security Rules for Mail Factory
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSuperAdmin() {
      return request.auth != null && 
        (request.auth.token.email == 'soheltajbhola@gmail.com' ||
         request.auth.token.role == 'admin');
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if isSuperAdmin() || request.auth.uid == userId;
    }
    
    match /sell_batches/{batchId} {
      allow read: if request.auth != null;
      allow write: if isSuperAdmin() || request.auth != null;
    }
    
    match /marketplace/{itemId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: SELLER BATCHES APPROVAL */}
        {activeTab === 'batches' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">সেলার মেইল ব্যাচ রিভিউ ও অনুমোদন</h2>
                <p className="text-xs text-slate-400">সেলারদের সাবমিট করা জিমেইলের তালিকা যাচাই করুন এবং এক ক্লিকে অনুমোদন দিন।</p>
              </div>
              <div className="text-xs text-slate-400">
                মোট ব্যাচ: <strong className="text-white">{sellSubmissions.length}</strong> টি
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">ব্যাচ আইডি</th>
                      <th className="p-3.5">সেলার</th>
                      <th className="p-3.5">ক্যাটাগরি ও শিফট</th>
                      <th className="p-3.5">মেইল সংখ্যা</th>
                      <th className="p-3.5">মোট মূল্য</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {sellSubmissions.map(batch => (
                      <tr key={batch.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-3.5 font-mono font-semibold text-indigo-300">
                          {batch.id}
                          <div className="text-[10px] text-slate-500 font-sans">{batch.submittedAt}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{batch.userName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">UID: {batch.userId}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-slate-200">{batch.category}</div>
                          <div className="text-[10px] text-amber-400">{batch.shiftName}</div>
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {batch.quantity} টি
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400">
                          ৳{batch.totalEarning.toFixed(2)}
                          <div className="text-[10px] text-slate-400 font-normal">
                            (৳{(batch.ratePerMail + (batch.bonusPerMail || 0)).toFixed(2)}/পিস)
                          </div>
                        </td>
                        <td className="p-3.5">
                          {batch.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                              অনুমোদিত (Approved)
                            </span>
                          )}
                          {batch.status === 'verifying' && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold animate-pulse">
                              যাচাই চলছে (Verifying)
                            </span>
                          )}
                          {batch.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">
                              বাতিল (Rejected)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect credentials */}
                            <button
                              onClick={() => setInspectBatchId(batch.id)}
                              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer"
                              title="মেইল ক্রেডেনশিয়াল দেখুন"
                            >
                              <Eye className="w-3 h-3" />
                              <span>দেখুন</span>
                            </button>

                            {/* Approve */}
                            {batch.status !== 'approved' && (
                              <button
                                onClick={() => approveSellBatch(batch.id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>অনুমোদন</span>
                              </button>
                            )}

                            {/* Reject */}
                            {batch.status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  setRejectModalBatchId(batch.id);
                                  setRejectReason('ভুল পাসওয়ার্ড বা রিকভারি মেল পাওয়া গেছে।');
                                }}
                                className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>বাতিল</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MARKETPLACE & STOCK MANAGEMENT */}
        {activeTab === 'marketplace' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">মার্কেটপ্লেস ও জিমেইল স্টক ম্যানেজমেন্ট</h2>
                <p className="text-xs text-slate-400">নতুন জিমেইল প্যাকেজ তৈরি করুন এবং রিয়েলটাইম স্টক রিফিল করুন।</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                নতুন জিমেইল আইটেম যোগ করুন
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceItems.map(item => (
                <div key={item.id} className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase">
                          {item.category} • {item.year}
                        </span>
                        <h3 className="font-bold text-white text-sm mt-1">{item.titleBn}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.titleEn}</p>
                      </div>
                      <button
                        onClick={() => deleteMarketplaceItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-400">প্রতি পিস মূল্য:</span>
                        <div className="font-bold text-emerald-400 text-sm">৳{item.priceBdt.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">বর্তমান স্টক:</span>
                        <div className="font-bold text-white text-sm">{item.stock} পিস</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/80">
                    <span className="text-[11px] text-slate-400">কুইক স্টক রিফিল:</span>
                    <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                      {[50, 100, 250, 500].map(cnt => (
                        <button
                          key={cnt}
                          onClick={() => addStockToMarketplaceItem(item.id, cnt)}
                          className="py-1 bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-200 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          +{cnt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DEPOSITS APPROVAL */}
        {activeTab === 'deposits' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">বায়ার ডিপোজিট রিকোয়েস্ট অনুমোদন</h2>
                <p className="text-xs text-slate-400">বিকাশ ও নগদে পাঠানো ডিপোজিট TrxID ভেরিফাই করে বায়ার ওয়ালেটে ক্রেডিট দিন।</p>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">ট্রানজেকশন আইডি</th>
                      <th className="p-3.5">পদ্ধতি ও প্রেরক নম্বর</th>
                      <th className="p-3.5">পরিমাণ</th>
                      <th className="p-3.5">প্রদত্ত TrxID</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {transactions.filter(t => t.type === 'deposit').map(trx => (
                      <tr key={trx.id} className="hover:bg-slate-700/30">
                        <td className="p-3.5 font-mono font-semibold text-slate-200">{trx.id}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{trx.method}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{trx.accountNumber || 'N/A'}</div>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400 text-sm">৳{trx.amount.toFixed(2)}</td>
                        <td className="p-3.5 font-mono text-amber-300 font-medium">{trx.trxId || 'N/A'}</td>
                        <td className="p-3.5 text-slate-400">{trx.createdAt}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              trx.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : trx.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {trx.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {trx.status !== 'approved' && (
                              <button
                                onClick={() => approveDeposit(trx.id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs cursor-pointer"
                              >
                                অনুমোদন দিন
                              </button>
                            )}
                            {trx.status !== 'rejected' && (
                              <button
                                onClick={() => rejectDeposit(trx.id, 'TrxID অকার্যকর')}
                                className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs cursor-pointer"
                              >
                                বাতিল
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: WITHDRAWALS APPROVAL */}
        {activeTab === 'withdrawals' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">সেলার উইথড্রয়াল পেমেন্ট ডিসপ্যাচ</h2>
                <p className="text-xs text-slate-400">সেলারদের ক্যাশআউট রিকোয়েস্ট অনুমোদন করুন এবং পেমেন্ট TrxID প্রদান করুন।</p>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">উইথড্র আইডি</th>
                      <th className="p-3.5">পদ্ধতি ও রিসিভার নম্বর</th>
                      <th className="p-3.5">উইথড্র পরিমাণ</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">পেমেন্ট TrxID</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {transactions.filter(t => t.type === 'withdraw').map(trx => (
                      <tr key={trx.id} className="hover:bg-slate-700/30">
                        <td className="p-3.5 font-mono font-semibold text-slate-200">{trx.id}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{trx.method}</div>
                          <div className="text-[11px] text-pink-400 font-mono">{trx.accountNumber}</div>
                        </td>
                        <td className="p-3.5 font-bold text-amber-400 text-sm">৳{trx.amount.toFixed(2)}</td>
                        <td className="p-3.5 text-slate-400">{trx.createdAt}</td>
                        <td className="p-3.5 font-mono text-emerald-300 font-medium">{trx.trxId || 'পেন্ডিং'}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              trx.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : trx.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {trx.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {trx.status !== 'approved' && (
                              <button
                                onClick={() => {
                                  setPayoutModalTrxId(trx.id);
                                  setPayoutCustomTrxId(`BKS${Math.floor(10000000 + Math.random() * 90000000)}`);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs cursor-pointer"
                              >
                                পেমেন্ট সম্পন্ন করুন
                              </button>
                            )}
                            {trx.status !== 'rejected' && (
                              <button
                                onClick={() => rejectWithdrawal(trx.id, 'নম্বর সঠিক ছিল না')}
                                className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs cursor-pointer"
                              >
                                বাতিল ও রিফান্ড
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SHIFTS & RATES */}
        {activeTab === 'shifts' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">শিফট ও সেলার রেট ম্যানেজমেন্ট</h2>
                <p className="text-xs text-slate-400">শিফটের সময়সূচি, বেস রেট এবং প্রতি মেইলে এক্সট্রা বোনাস পরিবর্তন করুন।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shifts.map(shift => (
                <div
                  key={shift.id}
                  className={`border rounded-xl p-5 ${
                    shift.isActive
                      ? 'bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-800/60 border-slate-700 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{shift.titleBn}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            shift.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {shift.isActive ? 'Active Live' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {shift.timeRange}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleShiftActive(shift.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        shift.isActive
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {shift.isActive ? 'শিফট বন্ধ করুন' : 'শিফট চালু করুন'}
                    </button>
                  </div>

                  {/* Rate Editors */}
                  <div className="grid grid-cols-2 gap-3 mt-4 bg-slate-900/60 p-3 rounded-lg">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">বেস রেট (৳/মেইল):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={shift.ratePerMail}
                        onChange={e => updateShift(shift.id, { ratePerMail: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">শিফট বোনাস (৳/মেইল):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={shift.bonusPerMail}
                        onChange={e => updateShift(shift.id, { bonusPerMail: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
                    <span className="text-slate-400">সেলার মোট পাবে:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ৳{(shift.ratePerMail + shift.bonusPerMail).toFixed(2)} / মেইল
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS & GATEWAYS */}
        {activeTab === 'settings' && (
          <div className="mt-6 space-y-6">
            {/* Live Ticker Notice */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-amber-400" />
                লাইভ সাইট নোটিশ ও অ্যানাউন্সমেন্ট (Live Notice Ticker)
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                এই নোটিশটি সমস্ত ইউজারের হোমপেজের উপরে স্ক্রলিং ব্যানারে সরাসরি প্রদর্শিত হবে।
              </p>
              <textarea
                rows={2}
                value={siteNotice}
                onChange={e => setSiteNotice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Gateway Numbers */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                পেমেন্ট ডিপোজিট গেটওয়ে নম্বর সেটিংস
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                বায়াররা যখন টাকা পাঠাবে, তখন এই নম্বরগুলো ডিপোজিট পেজে অটোমেটিক শো করবে।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-pink-400 block mb-1">বিকাশ পার্সোনাল নম্বর:</label>
                  <input
                    type="text"
                    value={paymentSettings.bkashNumber}
                    onChange={e => updatePaymentSettings({ bkashNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-orange-400 block mb-1">নগদ পার্সোনাল নম্বর:</label>
                  <input
                    type="text"
                    value={paymentSettings.nagadNumber}
                    onChange={e => updatePaymentSettings({ nagadNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-purple-400 block mb-1">রকেট নম্বর:</label>
                  <input
                    type="text"
                    value={paymentSettings.rocketNumber}
                    onChange={e => updatePaymentSettings({ rocketNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/60">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">সর্বনিম্ন উইথড্র সীমা (টাকা):</label>
                  <input
                    type="number"
                    value={paymentSettings.minWithdraw}
                    onChange={e => updatePaymentSettings({ minWithdraw: parseInt(e.target.value) || 50 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">সর্বনিম্ন ডিপোজিট সীমা (টাকা):</label>
                  <input
                    type="number"
                    value={paymentSettings.minDeposit}
                    onChange={e => updatePaymentSettings({ minDeposit: parseInt(e.target.value) || 100 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">ইউজার রিভিউ ও ফিডব্যাক মডারেশন</h2>
                <p className="text-xs text-slate-400">প্ল্যাটফর্মে পোস্ট হওয়া রিভিউ পর্যবেক্ষণ করুন এবং অপ্রয়োজনীয় রিভিউ ডিলিট করুন।</p>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{rev.userName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {rev.userTier}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold">★ {rev.rating}.0</span>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{rev.comment}</p>
                    {rev.payoutAmount && (
                      <span className="inline-block mt-1 text-[10px] text-emerald-400 font-medium">
                        💰 পেআউট: ৳{rev.payoutAmount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-slate-700 cursor-pointer"
                    title="রিভিউ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: BALANCE ADJUSTMENT */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              ব্যালেন্স সমন্বয় (Balance Adjustment)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ইউজার: <strong className="text-white">{adjustingUser.name}</strong> ({adjustingUser.email})
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">কোন ওয়ালেটে সমন্বয় করবেন?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustField('balanceBdt')}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border ${
                      adjustField === 'balanceBdt'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    বায়ার ব্যালেন্স (৳{adjustingUser.balanceBdt})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustField('earningBdt')}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border ${
                      adjustField === 'earningBdt'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    সেলার আর্নিং (৳{adjustingUser.earningBdt})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">অ্যাকশনের ধরন:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border ${
                      adjustType === 'add'
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    + টাকা যোগ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border ${
                      adjustType === 'deduct'
                        ? 'bg-red-600/30 text-red-300 border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    - টাকা কেটে নিন
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">পরিমাণ (টাকা):</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">কারণ বা রেফারেন্স নোট:</label>
                <input
                  type="text"
                  placeholder="যেমন: ম্যানুয়াল রিফান্ড, অফার বোনাস..."
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdjustingUser(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalAmount = adjustType === 'add' ? adjustAmount : -adjustAmount;
                  adjustUserBalance(adjustingUser.id, adjustField, finalAmount, adjustReason);
                  setAdjustingUser(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg cursor-pointer"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT BATCH MAILS */}
      {inspectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  ব্যাচ {inspectedBatch.id} - মেইল তালিকা ({inspectedBatch.quantity}টি)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  সেলার: {inspectedBatch.userName} • মোট রেট: ৳{inspectedBatch.totalEarning}
                </p>
              </div>
              <button
                onClick={() => setInspectBatchId(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {inspectedBatch.mails?.map((m, idx) => (
                <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div className="overflow-hidden truncate pr-2">
                    <span className="text-emerald-400">{m.email}</span> :{' '}
                    <span className="text-amber-300">{m.pass}</span> :{' '}
                    <span className="text-slate-400">{m.recovery}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                    Valid
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                ফরম্যাট: email : password : recovery
              </span>
              <div className="flex items-center gap-2">
                {inspectedBatch.status !== 'approved' && (
                  <button
                    onClick={() => {
                      approveSellBatch(inspectedBatch.id);
                      setInspectBatchId(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    ব্যাচ অনুমোদন করুন
                  </button>
                )}
                <button
                  onClick={() => setInspectBatchId(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MARKETPLACE PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              নতুন জিমেইল আইটেম তৈরি করুন
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">শিরোনাম (বাংলা):</label>
                <input
                  type="text"
                  placeholder="যেমন: ফ্রেশ জিমেইল ২০২৬ (Outlook Recovery যুক্ত)"
                  value={newProd.titleBn}
                  onChange={e => setNewProd(p => ({ ...p, titleBn: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Title (English):</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Gmail 2026 (Outlook Recovery)"
                  value={newProd.titleEn}
                  onChange={e => setNewProd(p => ({ ...p, titleEn: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">ক্যাটাগরি:</label>
                  <select
                    value={newProd.category}
                    onChange={e => setNewProd(p => ({ ...p, category: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fresh">Fresh (ফ্রেশ)</option>
                    <option value="aged">Old / Aged (পুরাতন)</option>
                    <option value="recovery">Outlook Recovery</option>
                    <option value="google_voice">Google Voice</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">সাল (Year):</label>
                  <input
                    type="text"
                    value={newProd.year}
                    onChange={e => setNewProd(p => ({ ...p, year: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">বিক্রয় মূল্য (BDT/মেইল):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProd.priceBdt}
                    onChange={e => setNewProd(p => ({ ...p, priceBdt: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">প্রাথমিক স্টক (পিস):</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={e => setNewProd(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newProd.titleBn) {
                    addMarketplaceItem({
                      titleBn: newProd.titleBn,
                      titleEn: newProd.titleEn || newProd.titleBn,
                      category: newProd.category,
                      year: newProd.year,
                      priceBdt: newProd.priceBdt,
                      priceUsd: newProd.priceUsd,
                      stock: newProd.stock,
                      minOrder: newProd.minOrder,
                      maxOrder: newProd.maxOrder,
                      deliveryType: newProd.deliveryType,
                      format: newProd.format,
                      featuresBn: [newProd.featuresBn],
                      featuresEn: [newProd.featuresEn]
                    });
                    setIsAddProductOpen(false);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                আইটেম সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PAYOUT WITHDRAWAL APPROVAL */}
      {payoutModalTrxId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-slate-200">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />
              উইথড্র পেমেন্ট অনুমোদন দিন
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              বিকাশ বা নগদে টাকা প্রেরণের পর পাওয়া ট্রানজেকশন আইডি (TrxID) প্রদান করুন:
            </p>

            <div className="mt-3">
              <label className="text-xs text-slate-300 block mb-1">পেমেন্ট TrxID:</label>
              <input
                type="text"
                value={payoutCustomTrxId}
                onChange={e => setPayoutCustomTrxId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setPayoutModalTrxId(null)}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  approveWithdrawal(payoutModalTrxId, payoutCustomTrxId);
                  setPayoutModalTrxId(null);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                অনুমোদন সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT BATCH */}
      {rejectModalBatchId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-slate-200">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              ব্যাচ বাতিল করার কারণ
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              সেলারকে জানানোর জন্য বাতিলের কারণ লিখুন:
            </p>

            <div className="mt-3">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalBatchId(null)}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                onClick={() => {
                  rejectSellBatch(rejectModalBatchId, rejectReason);
                  setRejectModalBatchId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                বাতিল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
