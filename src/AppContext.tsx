import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ViewType,
  Language,
  MarketplaceItem,
  BuyerOrder,
  SellBatchSubmission,
  Transaction,
  Review,
  ShiftInfo,
  NotificationItem,
  ChatMessage
} from './types';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: User | null;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  marketplaceItems: MarketplaceItem[];
  buyerOrders: BuyerOrder[];
  sellSubmissions: SellBatchSubmission[];
  transactions: Transaction[];
  reviews: Review[];
  shifts: ShiftInfo[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  
  // Actions
  login: (emailOrPhone: string, role?: 'seller' | 'buyer' | 'both' | 'admin') => void;
  logout: () => void;
  registerUser: (name: string, email: string, phone: string, refCode?: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  
  // Marketplace & Selling
  buyGmails: (itemId: string, quantity: number, paymentMethod: 'balance' | 'bkash' | 'nagad', directTrxId?: string) => Promise<boolean>;
  submitSellBatch: (category: string, rawText: string, shiftName?: string) => Promise<{ success: boolean; count: number; earning: number }>;
  
  // Wallet
  requestDeposit: (method: string, amount: number, senderNumber: string, trxId: string) => Promise<boolean>;
  requestWithdrawal: (method: string, amount: number, receiverNumber: string) => Promise<boolean>;
  performExchange: (from: string, to: string, amountFrom: number, amountTo: number) => Promise<boolean>;
  
  // Reviews & Chat
  addReview: (rating: number, comment: string, shiftName?: string) => void;
  deleteReview: (id: string) => void;
  sendChatMessage: (text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerConfetti: () => void;

  // Admin Panel & Management (soheltajbhola@gmail.com)
  isAdmin: boolean;
  isSuperAdminMode: boolean;
  setIsSuperAdminMode: (mode: boolean) => void;
  adminEmails: string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
  loginAsAdmin: () => void;
  
  // Admin User Management
  allUsers: User[];
  updateUserByAdmin: (userId: string, data: Partial<User>) => void;
  adjustUserBalance: (userId: string, field: 'balanceBdt' | 'earningBdt', amount: number, note?: string) => void;
  toggleUserBan: (userId: string) => void;

  // Admin Marketplace Management
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'salesCount' | 'rating'>) => void;
  updateMarketplaceItem: (id: string, updates: Partial<MarketplaceItem>) => void;
  deleteMarketplaceItem: (id: string) => void;
  addStockToMarketplaceItem: (id: string, count: number) => void;

  // Admin Batch & Financial Approvals
  approveSellBatch: (batchId: string) => void;
  rejectSellBatch: (batchId: string, reason: string) => void;
  approveDeposit: (trxId: string) => void;
  rejectDeposit: (trxId: string, reason?: string) => void;
  approveWithdrawal: (trxId: string, payoutTrxId?: string) => void;
  rejectWithdrawal: (trxId: string, reason?: string) => void;

  // Admin Shifts & Site Config
  updateShift: (id: string, updates: Partial<ShiftInfo>) => void;
  toggleShiftActive: (id: string) => void;
  addShift: (shift: ShiftInfo) => void;
  paymentSettings: {
    bkashNumber: string;
    nagadNumber: string;
    rocketNumber: string;
    minWithdraw: number;
    minDeposit: number;
  };
  updatePaymentSettings: (settings: Partial<{ bkashNumber: string; nagadNumber: string; rocketNumber: string; minWithdraw: number; minDeposit: number }>) => void;
  siteNotice: string;
  setSiteNotice: (notice: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SUPER_ADMIN_USER: User = {
  id: 'usr_admin_sohel',
  name: 'Sohel Taj (Admin)',
  email: 'soheltajbhola@gmail.com',
  phone: '01711223344',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  memberId: 'MF-ADMIN-01',
  joinDate: '01 Jan 2024',
  isVerified: true,
  tier: 'Diamond VIP',
  balanceBdt: 95400.00,
  balanceUsd: 820.00,
  earningBdt: 145000.00,
  totalWithdrawnBdt: 85000.00,
  totalDepositedBdt: 180000.00,
  totalSoldMails: 16500,
  totalBoughtMails: 8400,
  referralCode: 'SOHELPRO',
  referralCount: 154,
  referralEarningsBdt: 24500.00
};

const INITIAL_USER: User = {
  id: 'usr_88291',
  name: 'Md. Shakil Hasan',
  email: 'shakil.freelance@gmail.com',
  phone: '01799882211',
  role: 'both',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberId: 'MF-88291',
  joinDate: '12 Jan 2024',
  isVerified: true,
  tier: 'Platinum',
  balanceBdt: 2450.00,
  balanceUsd: 22.50,
  earningBdt: 1840.00,
  totalWithdrawnBdt: 14650.00,
  totalDepositedBdt: 8500.00,
  totalSoldMails: 1420,
  totalBoughtMails: 350,
  referralCode: 'SHAKIL77',
  referralCount: 18,
  referralEarningsBdt: 980.00
};

const INITIAL_USERS: User[] = [
  SUPER_ADMIN_USER,
  INITIAL_USER,
  {
    id: 'usr_1002',
    name: 'Tanvir Ahmed',
    email: 'tanvir.seller@gmail.com',
    phone: '01811992288',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    memberId: 'MF-1002',
    joinDate: '15 Feb 2024',
    isVerified: true,
    tier: 'Gold',
    balanceBdt: 120.00,
    balanceUsd: 0,
    earningBdt: 4500.00,
    totalWithdrawnBdt: 28000.00,
    totalDepositedBdt: 0,
    totalSoldMails: 2800,
    totalBoughtMails: 10,
    referralCode: 'TANVIR9',
    referralCount: 12,
    referralEarningsBdt: 1250.00
  },
  {
    id: 'usr_1003',
    name: 'Rakib Hossain',
    email: 'rakib.buyer@gmail.com',
    phone: '01922334455',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    memberId: 'MF-1003',
    joinDate: '20 Mar 2024',
    isVerified: true,
    tier: 'Diamond VIP',
    balanceBdt: 12500.00,
    balanceUsd: 110.00,
    earningBdt: 0,
    totalWithdrawnBdt: 0,
    totalDepositedBdt: 45000.00,
    totalSoldMails: 0,
    totalBoughtMails: 4100,
    referralCode: 'RAKIB55',
    referralCount: 4,
    referralEarningsBdt: 350.00
  }
];

const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item_fresh_2026',
    titleBn: 'ফ্রেশ জিমেইল ২০২৬ (Outlook Recovery যুক্ত)',
    titleEn: 'Fresh Gmail 2026 (Outlook Recovery Included)',
    category: 'fresh',
    year: '2026',
    priceBdt: 11.50,
    priceUsd: 0.10,
    minQty: 10,
    stock: 4500,
    rating: 4.9,
    salesCount: 12400,
    featuresBn: ['১০০% আউটলুক রিকভারি সেট করা', 'ইউএস / মিক্সড রিয়েল আইপি', '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি', 'ইনস্ট্যান্ট অটো-ডেলিভারি'],
    featuresEn: ['100% Outlook recovery attached', 'Real Mixed IP created', '7 Days Replacement Guarantee', 'Instant auto-delivery'],
    warrantyHours: 168,
    badge: '🔥 HOT SELLER',
    deliveryType: 'instant'
  },
  {
    id: 'item_fresh_no_rec',
    titleBn: 'ফ্রেশ নন-রিকভারি জিমেইল (Clean)',
    titleEn: 'Fresh Non-Recovery Gmail (Clean IP)',
    category: 'fresh',
    year: '2026',
    priceBdt: 9.00,
    priceUsd: 0.08,
    minQty: 20,
    stock: 7800,
    rating: 4.8,
    salesCount: 24500,
    featuresBn: ['কোন রিকভারি মেইল নেই', 'ইউজার নিজের রিকভারি সেট করতে পারবেন', '২৪ ঘণ্টা রিপ্লেসমেন্ট ওয়ারেন্টি', 'বাল্ক প্যাকেজে ছাড়'],
    featuresEn: ['No recovery attached', 'Can add your own recovery', '24h Replacement warranty', 'Bulk discount available'],
    warrantyHours: 24,
    badge: '⚡ FAST SALE',
    deliveryType: 'instant'
  },
  {
    id: 'item_aged_2022',
    titleBn: 'ওল্ড জিমেইল ২০২২-২০২৩ (High Trust)',
    titleEn: 'Aged Gmail 2022-2023 (High Trust)',
    category: 'aged',
    year: '2022-2023',
    priceBdt: 35.00,
    priceUsd: 0.30,
    minQty: 5,
    stock: 620,
    rating: 5.0,
    salesCount: 3800,
    featuresBn: ['২-৪ বছরের পুরনো ভেরিফাইড মেইল', 'গুগল ভয়েস ও ইউটিউবে ব্যবহারযোগ্য', 'নো-সাসপেন্ড হাই ট্রাস্ট স্কোর', 'লাইফটাইম সাপোর্ট'],
    featuresEn: ['2-4 years old verified account', 'Great for Google Voice & YT', 'No-suspend high trust score', 'Lifetime support'],
    warrantyHours: 720,
    badge: '💎 VIP AGED',
    deliveryType: 'instant'
  },
  {
    id: 'item_us_pva',
    titleBn: 'ইউএসএ ফোন ভেরিফাইড (PVA) জিমেইল',
    titleEn: 'USA Phone Verified (PVA) Gmail',
    category: 'us_ip',
    year: '2025',
    priceBdt: 45.00,
    priceUsd: 0.38,
    minQty: 5,
    stock: 310,
    rating: 4.95,
    salesCount: 2900,
    featuresBn: ['রিয়েল ইউএস সিম দিয়ে ভেরিফাই করা', 'সিপিএ ও সার্ভে কাজের জন্য পারফেক্ট', 'রিকভারি মেইল + পাসওয়ার্ড দেওয়া থাকবে', 'ইনস্ট্যান্ট অ্যাক্সেস'],
    featuresEn: ['Real US Phone Verified', 'Perfect for CPA & Survey', 'Recovery + Password provided', 'Instant access'],
    warrantyHours: 120,
    badge: '🇺🇸 USA PVA',
    deliveryType: 'instant'
  },
  {
    id: 'item_bulk_100',
    titleBn: 'বাল্ক প্যাক: ১০০ পিস ফ্রেশ জিমেইল (স্পেশাল অফার)',
    titleEn: 'Bulk Pack: 100 Pcs Fresh Gmail (Special Deal)',
    category: 'bulk',
    year: '2026',
    priceBdt: 950.00,
    priceUsd: 8.20,
    minQty: 1,
    stock: 85,
    rating: 5.0,
    salesCount: 920,
    featuresBn: ['প্রতি পিস মাত্র ৳৯.৫০', 'এক ক্লিকে ১০০টি মেইল TXT ফাইলে ডাউনলোড', 'ফুল রিকভারি + ৩ দিনের লাইভ ওয়ারেন্টি', 'প্রাইওরিটি কাস্টমার সাপোর্ট'],
    featuresEn: ['Only ৳9.50 per piece', 'One-click 100 mails TXT download', 'Full recovery + 3-day warranty', 'Priority 24/7 support'],
    warrantyHours: 72,
    badge: '⭐ MEGA DEAL',
    deliveryType: 'instant'
  }
];

const INITIAL_SHIFTS: ShiftInfo[] = [
  {
    id: 'shift_morning',
    titleBn: 'সকাল শিফট (Morning Shift)',
    titleEn: 'Morning Shift',
    timeRange: '08:00 AM - 02:00 PM',
    ratePerMail: 8.50,
    bonusPerMail: 0.50,
    isActive: false,
    targetCount: 10000,
    completedCount: 9800,
    rulesBn: ['সব মেইলে Outlook রিকভারি বাধ্যতামূলক', 'পাসওয়ার্ড ৮ ডিজিটের বেশি হতে হবে', 'প্রতি মেইলে স্পেশাল রেট ৳৯.০০'],
    rulesEn: ['Outlook recovery required', 'Password 8+ chars', 'Special rate ৳9.00']
  },
  {
    id: 'shift_evening',
    titleBn: 'সন্ধ্যা শিফট (Prime Evening Shift)',
    titleEn: 'Evening Shift',
    timeRange: '02:00 PM - 09:00 PM',
    ratePerMail: 9.50,
    bonusPerMail: 1.00,
    isActive: true,
    targetCount: 15000,
    completedCount: 12450,
    rulesBn: ['হট শিফট: প্রতি মেইলে ৳১০.৫০ পর্যন্ত আয়', 'যেকোনো আইপি মেইল গ্রহণযোগ্য', 'ইনস্ট্যান্ট ৩ মিনিটে চেকিং ও পেমেন্ট'],
    rulesEn: ['Hot shift: Earn up to ৳10.50/mail', 'Any IP allowed', 'Instant 3-min verify & payout']
  },
  {
    id: 'shift_night',
    titleBn: 'নাইট শিফট (VIP Night Shift)',
    titleEn: 'Night Shift',
    timeRange: '09:00 PM - 04:00 AM',
    ratePerMail: 10.00,
    bonusPerMail: 1.50,
    isActive: false,
    targetCount: 20000,
    completedCount: 18200,
    rulesBn: ['সর্বোচ্চ রেট শিফট ৳১১.৫০', 'টপ ৫ সেলারের জন্য নগদ ৳১,০০০ বোনাস', 'আনলিমিটেড সাবমিট করা যাবে'],
    rulesEn: ['Highest rate shift ৳11.50', '৳1,000 cash bonus for top 5 sellers', 'Unlimited submissions']
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mf_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [language, setLanguage] = useState<Language>('bn');
  
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('mf_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [shifts, setShifts] = useState<ShiftInfo[]>(() => {
    const saved = localStorage.getItem('mf_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mf_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('mf_admin_emails');
    return saved ? JSON.parse(saved) : ['soheltajbhola@gmail.com'];
  });

  const [isSuperAdminMode, setIsSuperAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('mf_admin_mode') === 'true';
  });

  const [paymentSettings, setPaymentSettings] = useState(() => {
    const saved = localStorage.getItem('mf_payment_settings');
    return saved ? JSON.parse(saved) : {
      bkashNumber: '01788112233',
      nagadNumber: '01977223344',
      rocketNumber: '01866334455',
      minWithdraw: 50,
      minDeposit: 100
    };
  });

  const [siteNotice, setSiteNotice] = useState<string>(() => {
    return localStorage.getItem('mf_site_notice') || '🔥 সন্ধ্যা শিফট চালু: ফ্রেশ জিমেইল রেট ৳৯.৫০ + শিফট বোনাস ৳১.০০ = ৳১০.৫০/মেইল! সর্বনিম্ন উইথড্র মাত্র ৳৫০!';
  });
  
  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>(() => {
    const saved = localStorage.getItem('mf_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ORD-99120',
        userId: 'usr_88291',
        itemId: 'item_fresh_2026',
        itemTitle: 'Fresh Gmail 2026 (Outlook Recovery)',
        category: 'fresh',
        quantity: 20,
        unitPrice: 11.50,
        totalPrice: 230.00,
        currency: 'BDT',
        status: 'completed',
        purchasedAt: 'Today, 02:40 PM',
        warrantyExpireAt: '7 days remaining',
        accounts: Array.from({ length: 20 }).map((_, i) => ({
          email: `client.user${100 + i}@gmail.com`,
          pass: `MFactory#${8800 + i}`,
          recovery: `recov.user${100 + i}@outlook.com`
        }))
      }
    ];
  });

  const [sellSubmissions, setSellSubmissions] = useState<SellBatchSubmission[]>(() => {
    const saved = localStorage.getItem('mf_sell_batches');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'BATCH-4412',
        userId: 'usr_88291',
        userName: 'Shakil Hasan',
        submittedAt: 'Today, 11:20 AM',
        category: 'Fresh Outlook Recovery',
        ratePerMail: 9.50,
        bonusPerMail: 1.00,
        quantity: 50,
        totalEarning: 525.00,
        status: 'approved',
        shiftName: 'Prime Evening Shift',
        mails: Array.from({ length: 50 }).map((_, i) => ({
          email: `workmail${200 + i}@gmail.com`,
          pass: `PassSecure#${i}`,
          recovery: `rec${200 + i}@outlook.com`,
          status: 'valid'
        }))
      }
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('mf_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TRX-88319',
        userId: 'usr_88291',
        type: 'withdraw',
        amount: 1500,
        currency: 'BDT',
        method: 'bKash Personal',
        accountNumber: '01799882211',
        trxId: 'BKS99281729A',
        status: 'approved',
        createdAt: '01 Sep 2026, 09:15 AM',
        descriptionBn: 'বিকাশ পার্সোনাল উইথড্র সফল হয়েছে',
        descriptionEn: 'bKash Personal withdrawal successful',
        fee: 0
      },
      {
        id: 'TRX-88318',
        userId: 'usr_88291',
        type: 'sell',
        amount: 525,
        currency: 'BDT',
        status: 'completed',
        createdAt: '01 Sep 2026, 11:25 AM',
        descriptionBn: '৫০টি জিমেইল বিক্রির টাকা যোগ হয়েছে',
        descriptionEn: '50 Gmail batch sold credit added',
      },
      {
        id: 'TRX-88317',
        userId: 'usr_88291',
        type: 'deposit',
        amount: 1000,
        currency: 'BDT',
        method: 'Nagad Personal',
        accountNumber: '01799882211',
        trxId: 'NGD3381920B',
        status: 'approved',
        createdAt: '30 Aug 2026, 04:30 PM',
        descriptionBn: 'নগদ ডিপোজিট ব্যালেন্সে যোগ হয়েছে',
        descriptionEn: 'Nagad deposit added to buyer balance',
      }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev_1',
      userName: 'Tanvir Ahmed (সেলার)',
      userTier: 'Gold Seller',
      rating: 5,
      date: '১০ মিনিট আগে',
      comment: 'আজকে ১০০টা মেইল সাবমিট দিয়েছিলাম। ৫ মিনিটের মধ্যে চেক করে ৳১০৫০ বিকাশ একাউন্টে চলে আসছে! বেস্ট প্ল্যাটফর্ম।',
      mailCount: 100,
      payoutAmount: 1050,
      shiftName: 'Prime Evening Shift',
      isVerifiedSeller: true
    },
    {
      id: 'rev_2',
      userName: 'Md. Rakib Hossain',
      userTier: 'VIP Buyer',
      rating: 5,
      date: '১ ঘণ্টা আগে',
      comment: '৫০টা আউটলুক রিকভারি ফ্রেশ মেইল নিলাম সিপিএ কাজের জন্য। একটা মেইলও নষ্ট হয়নি। সার্ভিস এক কথায় অসাধারণ!',
      mailCount: 50,
      isVerifiedBuyer: true
    },
    {
      id: 'rev_3',
      userName: 'Sumon Freelancer',
      userTier: 'Diamond Seller',
      rating: 5,
      date: '৩ ঘণ্টা আগে',
      comment: 'মেইল ফ্যাক্টরি ছাড়া এখন আর কোথাও কাজ করি না। শিফট বোনাস সহ রেট অনেক বেশি পাওয়া যায় এবং উইথড্র দিলেই ৫ মিনিটে টাকা চলে আসে।',
      mailCount: 250,
      payoutAmount: 2625,
      isVerifiedSeller: true
    },
    {
      id: 'rev_4',
      userName: 'Shohel Rana',
      userTier: 'Silver Member',
      rating: 5,
      date: '৫ ঘণ্টা আগে',
      comment: 'নগদে ৳২০০০ উইথড্র পেয়েছি কোনো প্রকার ফি ছাড়া। ধন্যবাদ মেইল ফ্যাক্টরি এডমিন প্যানেলকে।',
      payoutAmount: 2000,
      isVerifiedSeller: true
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      titleBn: '🔥 সন্ধ্যা শিফট লাইভ শুরু হয়েছে!',
      titleEn: '🔥 Prime Evening Shift is Now Live!',
      messageBn: 'প্রতি জিমেইলে বোনাস সহ পাচ্ছেন ৳১০.৫০ পর্যন্ত। দ্রুত সাবমিট করুন।',
      messageEn: 'Earn up to ৳10.50 per Gmail with shift bonus now.',
      time: '১৫ মিনিট আগে',
      type: 'alert',
      isRead: false,
      linkView: 'sell'
    },
    {
      id: 'notif_2',
      titleBn: 'উইথড্র ৳১,৫০০ সফল হয়েছে',
      titleEn: 'Withdrawal ৳1,500 Completed',
      messageBn: 'আপনার বিকাশ একাউন্টে টাকা পাঠিয়ে দেওয়া হয়েছে। TrxID: BKS99281729A',
      messageEn: 'Funds have been dispatched to your bKash wallet.',
      time: '২ ঘণ্টা আগে',
      type: 'payment',
      isRead: false,
      linkView: 'history'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'bot',
      senderName: 'Mail Factory Bot',
      text: 'আসসালামু আলাইকুম! মেইল ফ্যাক্টরিতে আপনাকে স্বাগতম। আপনি কি জিমেইল বাই করতে চান নাকি সেল করে আয় করতে চান? যেকোনো প্রয়োজনে মেসেজ দিন।',
      time: 'Just now'
    }
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Local storage auto sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('mf_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mf_orders', JSON.stringify(buyerOrders));
  }, [buyerOrders]);

  useEffect(() => {
    localStorage.setItem('mf_sell_batches', JSON.stringify(sellSubmissions));
  }, [sellSubmissions]);

  useEffect(() => {
    localStorage.setItem('mf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mf_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('mf_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('mf_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('mf_admin_emails', JSON.stringify(adminEmails));
  }, [adminEmails]);

  useEffect(() => {
    localStorage.setItem('mf_admin_mode', isSuperAdminMode ? 'true' : 'false');
  }, [isSuperAdminMode]);

  useEffect(() => {
    localStorage.setItem('mf_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  useEffect(() => {
    localStorage.setItem('mf_site_notice', siteNotice);
  }, [siteNotice]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const login = (emailOrPhone: string, role?: 'seller' | 'buyer' | 'both' | 'admin') => {
    const trimmed = emailOrPhone.trim().toLowerCase();
    const isTargetAdmin =
      trimmed === 'soheltajbhola@gmail.com' ||
      adminEmails.map(e => e.toLowerCase()).includes(trimmed) ||
      role === 'admin';

    if (trimmed === 'soheltajbhola@gmail.com') {
      setUser(SUPER_ADMIN_USER);
      setIsSuperAdminMode(true);
      localStorage.setItem('mf_user', JSON.stringify(SUPER_ADMIN_USER));
      localStorage.setItem('mf_admin_mode', 'true');
      setIsAuthModalOpen(false);
      triggerConfetti();
      return;
    }

    const newUser: User = {
      ...INITIAL_USER,
      id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Member ' + emailOrPhone.slice(-4),
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@mailfactory.com`,
      phone: emailOrPhone.startsWith('01') ? emailOrPhone : '01700000000',
      role: isTargetAdmin ? 'admin' : (role || 'both')
    };

    if (isTargetAdmin) {
      setIsSuperAdminMode(true);
      localStorage.setItem('mf_admin_mode', 'true');
    }

    setUser(newUser);
    setAllUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) return prev;
      return [...prev, newUser];
    });

    setIsAuthModalOpen(false);
    triggerConfetti();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mf_user');
  };

  const registerUser = (name: string, email: string, phone: string, refCode?: string) => {
    const newUser: User = {
      id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      email,
      phone,
      role: 'both',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      memberId: `MF-${Math.floor(10000 + Math.random() * 90000)}`,
      joinDate: 'Today',
      isVerified: true,
      tier: 'Silver',
      balanceBdt: 0,
      balanceUsd: 0,
      earningBdt: 50, // Welcome signup bonus
      totalWithdrawnBdt: 0,
      totalDepositedBdt: 0,
      totalSoldMails: 0,
      totalBoughtMails: 0,
      referralCode: name.slice(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900),
      referredBy: refCode,
      referralCount: 0,
      referralEarningsBdt: 0
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    triggerConfetti();

    // Add welcome notification
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: '🎉 স্বাগতম বোনাস ৳৫০ যোগ হয়েছে!',
        titleEn: '🎉 Welcome Bonus ৳50 Added!',
        messageBn: 'মেইল ফ্যাক্টরিতে রেজিস্ট্রেশন করায় আপনার সেলার ওয়ালেটে ৳৫০ যোগ করা হয়েছে।',
        messageEn: '৳50 registration reward has been credited to your seller wallet.',
        time: 'Just now',
        type: 'success',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const buyGmails = async (itemId: string, quantity: number, paymentMethod: 'balance' | 'bkash' | 'nagad', directTrxId?: string): Promise<boolean> => {
    const item = marketplaceItems.find(i => i.id === itemId);
    if (!item) return false;

    const totalCost = item.priceBdt * quantity;

    if (paymentMethod === 'balance') {
      if (!user || user.balanceBdt < totalCost) {
        alert(language === 'bn' ? 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই! দয়া করে আগে ডিপোজিট করুন।' : 'Insufficient balance! Please deposit funds first.');
        return false;
      }
      // Deduct balance
      setUser(prev => prev ? { ...prev, balanceBdt: prev.balanceBdt - totalCost, totalBoughtMails: prev.totalBoughtMails + quantity } : null);
    } else {
      // Direct bKash/Nagad payment verification
      if (!directTrxId || directTrxId.length < 4) {
        alert(language === 'bn' ? 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।' : 'Please enter valid TrxID.');
        return false;
      }
    }

    // Generate accounts list
    const generatedAccounts = Array.from({ length: quantity }).map((_, i) => ({
      email: `order.${Math.random().toString(36).substring(2, 7)}.${i + 1}@gmail.com`,
      pass: `MFPass#${Math.floor(1000 + Math.random() * 9000)}`,
      recovery: item.category.includes('recovery') || item.category === 'fresh' ? `recov.${Math.random().toString(36).substring(2, 6)}@outlook.com` : undefined
    }));

    const newOrder: BuyerOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || 'guest',
      itemId: item.id,
      itemTitle: language === 'bn' ? item.titleBn : item.titleEn,
      category: item.category,
      quantity,
      unitPrice: item.priceBdt,
      totalPrice: totalCost,
      currency: 'BDT',
      status: 'completed',
      purchasedAt: 'Just now',
      warrantyExpireAt: `${item.warrantyHours / 24} days warranty active`,
      accounts: generatedAccounts
    };

    setBuyerOrders(prev => [newOrder, ...prev]);

    // Record transaction
    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || 'guest',
      type: 'buy',
      amount: totalCost,
      currency: 'BDT',
      method: paymentMethod === 'balance' ? 'Wallet Balance' : paymentMethod.toUpperCase(),
      trxId: directTrxId,
      status: 'completed',
      createdAt: 'Just now',
      descriptionBn: `${quantity} পিস ${item.titleBn} ক্রয় সম্পন্ন`,
      descriptionEn: `Purchased ${quantity} pcs ${item.titleEn}`
    };

    setTransactions(prev => [newTrx, ...prev]);
    triggerConfetti();

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: '✅ জিমেইল অর্ডার সম্পন্ন হয়েছে!',
        titleEn: '✅ Gmail Order Completed!',
        messageBn: `${quantity}টি জিমেইলের একাউন্ট ডিটেইলস "আমার অর্ডার" পেজে যুক্ত হয়েছে।`,
        messageEn: `Credentials for ${quantity} Gmails are now available under "My Orders".`,
        time: 'Just now',
        type: 'success',
        isRead: false,
        linkView: 'orders'
      },
      ...prev
    ]);

    return true;
  };

  const submitSellBatch = async (category: string, rawText: string, shiftName: string = 'Prime Evening Shift') => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedMails: { email: string; pass: string; recovery: string; status?: 'valid' | 'invalid' | 'duplicate' }[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const line of lines) {
      // Split by : or | or comma or space
      const parts = line.split(/[:|,\t\s]+/).filter(Boolean);
      if (parts.length >= 2) {
        const email = parts[0];
        const pass = parts[1];
        const recovery = parts[2] || 'none';
        const isValid = email.includes('@gmail.com') && emailRegex.test(email) && pass.length >= 6;
        parsedMails.push({
          email,
          pass,
          recovery,
          status: isValid ? 'valid' : 'invalid'
        });
      }
    }

    const validCount = parsedMails.filter(m => m.status === 'valid').length;
    if (validCount === 0) {
      return { success: false, count: 0, earning: 0 };
    }

    const activeShift = shifts.find(s => s.isActive) || shifts[0];
    const ratePerMail = activeShift.ratePerMail;
    const bonusPerMail = activeShift.bonusPerMail;
    const totalRate = ratePerMail + bonusPerMail;
    const totalEarning = validCount * totalRate;

    const newBatch: SellBatchSubmission = {
      id: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'usr_guest',
      userName: user?.name || 'Seller',
      submittedAt: 'Just now',
      category,
      ratePerMail,
      bonusPerMail,
      quantity: validCount,
      totalEarning,
      status: 'approved', // instant auto approve simulated
      shiftName,
      mails: parsedMails
    };

    setSellSubmissions(prev => [newBatch, ...prev]);

    // Update user balance
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        earningBdt: prev.earningBdt + totalEarning,
        totalSoldMails: prev.totalSoldMails + validCount
      } : null);
    }

    // Add transaction
    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || 'usr_guest',
      type: 'sell',
      amount: totalEarning,
      currency: 'BDT',
      status: 'completed',
      createdAt: 'Just now',
      descriptionBn: `${validCount}টি জিমেইল সেল করে ৳${totalEarning.toFixed(2)} আয় জমা হয়েছে`,
      descriptionEn: `Earned ৳${totalEarning.toFixed(2)} by selling ${validCount} Gmails`
    };

    setTransactions(prev => [newTrx, ...prev]);
    triggerConfetti();

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `💰 ৳${totalEarning.toFixed(2)} সেলার ওয়ালেটে যুক্ত হয়েছে!`,
        titleEn: `💰 ৳${totalEarning.toFixed(2)} Credited to Seller Wallet!`,
        messageBn: `${validCount}টি জিমেইল ভেরিফিকেশন সফল হয়েছে। এখনই উইথড্র করতে পারবেন।`,
        messageEn: `${validCount} Gmails approved. Ready for instant withdrawal.`,
        time: 'Just now',
        type: 'success',
        isRead: false,
        linkView: 'withdraw'
      },
      ...prev
    ]);

    return { success: true, count: validCount, earning: totalEarning };
  };

  const requestDeposit = async (method: string, amount: number, senderNumber: string, trxId: string): Promise<boolean> => {
    if (amount < 100) {
      alert(language === 'bn' ? 'সর্বনিম্ন ডিপোজিট ৳১০০' : 'Minimum deposit is ৳100');
      return false;
    }

    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || 'usr_guest',
      type: 'deposit',
      amount,
      currency: 'BDT',
      method,
      accountNumber: senderNumber,
      trxId,
      status: 'approved', // auto approved
      createdAt: 'Just now',
      descriptionBn: `${method} ডিপোজিট ৳${amount} সফলভাবে ব্যালেন্সে যোগ হয়েছে`,
      descriptionEn: `${method} deposit ৳${amount} credited to balance`
    };

    setTransactions(prev => [newTrx, ...prev]);
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        balanceBdt: prev.balanceBdt + amount,
        totalDepositedBdt: prev.totalDepositedBdt + amount
      } : null);
    }

    triggerConfetti();

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `✅ ৳${amount} ডিপোজিট সফল হয়েছে!`,
        titleEn: `✅ ৳${amount} Deposit Approved!`,
        messageBn: `${method} এর মাধ্যমে পাঠানো ফান্ড ওয়ালেটে যোগ হয়েছে।`,
        messageEn: `Funds via ${method} have been credited.`,
        time: 'Just now',
        type: 'payment',
        isRead: false,
        linkView: 'wallet'
      },
      ...prev
    ]);

    return true;
  };

  const requestWithdrawal = async (method: string, amount: number, receiverNumber: string): Promise<boolean> => {
    if (!user || user.earningBdt < amount) {
      alert(language === 'bn' ? 'আপনার সেলার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!' : 'Insufficient seller balance!');
      return false;
    }
    if (amount < 50) {
      alert(language === 'bn' ? 'সর্বনিম্ন উইথড্র ৳৫০' : 'Minimum withdrawal is ৳50');
      return false;
    }

    setUser(prev => prev ? {
      ...prev,
      earningBdt: prev.earningBdt - amount,
      totalWithdrawnBdt: prev.totalWithdrawnBdt + amount
    } : null);

    const generatedTrxId = `${method.slice(0, 3).toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'withdraw',
      amount,
      currency: 'BDT',
      method,
      accountNumber: receiverNumber,
      trxId: generatedTrxId,
      status: 'approved',
      createdAt: 'Just now',
      descriptionBn: `${method} (${receiverNumber}) এ ৳${amount} উইথড্র সফল`,
      descriptionEn: `Withdrawal of ৳${amount} to ${method} (${receiverNumber}) sent`
    };

    setTransactions(prev => [newTrx, ...prev]);
    triggerConfetti();

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `💸 ৳${amount} উইথড্র সফল হয়েছে!`,
        titleEn: `💸 ৳${amount} Withdrawal Dispatched!`,
        messageBn: `${receiverNumber} নাম্বারে টাকা পাঠিয়ে দেওয়া হয়েছে। TrxID: ${generatedTrxId}`,
        messageEn: `Payment sent to ${receiverNumber}. TrxID: ${generatedTrxId}`,
        time: 'Just now',
        type: 'payment',
        isRead: false,
        linkView: 'history'
      },
      ...prev
    ]);

    return true;
  };

  const performExchange = async (from: string, to: string, amountFrom: number, amountTo: number): Promise<boolean> => {
    if (!user) return false;

    if (from.includes('BDT') || from.includes('Seller')) {
      if (user.earningBdt < amountFrom) {
        alert(language === 'bn' ? 'পর্যাপ্ত সেলার ব্যালেন্স নেই!' : 'Insufficient balance!');
        return false;
      }
      setUser(prev => prev ? {
        ...prev,
        earningBdt: prev.earningBdt - amountFrom,
        balanceBdt: prev.balanceBdt + amountTo
      } : null);
    } else if (from.includes('USD')) {
      if (user.balanceUsd < amountFrom) {
        alert(language === 'bn' ? 'পর্যাপ্ত USD ব্যালেন্স নেই!' : 'Insufficient USD balance!');
        return false;
      }
      setUser(prev => prev ? {
        ...prev,
        balanceUsd: prev.balanceUsd - amountFrom,
        balanceBdt: prev.balanceBdt + amountTo
      } : null);
    }

    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'exchange',
      amount: amountFrom,
      currency: 'BDT',
      status: 'completed',
      createdAt: 'Just now',
      descriptionBn: `${from} থেকে ${to} তে ৳${amountTo.toFixed(2)} এক্সচেঞ্জ সম্পন্ন`,
      descriptionEn: `Exchanged from ${from} to ${to}`
    };

    setTransactions(prev => [newTrx, ...prev]);
    triggerConfetti();
    return true;
  };

  const addReview = (rating: number, comment: string, shiftName: string = 'Prime Evening Shift') => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      userName: user?.name || 'Verified User',
      userTier: user?.tier ? `${user.tier} Seller` : 'Verified Member',
      rating,
      date: 'Just now',
      comment,
      shiftName,
      isVerifiedSeller: true
    };
    setReviews(prev => [newRev, ...prev]);
    triggerConfetti();
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      senderName: user?.name || 'You',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Simulated intelligent bot/agent response in Bengali & English
    setTimeout(() => {
      let reply = 'ধন্যবাদ আপনার মেসেজের জন্য। আমাদের কাস্টমার সাপোর্ট টিম ২৪/৭ লাইভ আছে। আপনি জিমেইল সাবমিট করতে "সেল ফ্যাক্টরি" এবং কিনতে "বাই জিমেইল" অপশনে যান।';
      const lower = text.toLowerCase();
      if (lower.includes('rate') || lower.includes('রেট') || lower.includes('দাম')) {
        reply = 'বর্তমান সন্ধ্যা শিফটে প্রতি ফ্রেশ আউটলুক রিকভারি জিমেইল রেট ৳১০.৫০ পর্যন্ত। মিনিমাম সাবমিশন ১০ পিস।';
      } else if (lower.includes('withdraw') || lower.includes('উইথড্র') || lower.includes('টাকা')) {
        reply = 'সর্বনিম্ন উইথড্র মাত্র ৳৫০! বিকাশ অথবা নগদ পার্সোনালে রিকোয়েস্ট দিলে ৩-১৫ মিনিটের মধ্যে অটোমেটিক পেমেন্ট পেয়ে যাবেন।';
      } else if (lower.includes('format') || lower.includes('ফরম্যাট') || lower.includes('কিভাবে')) {
        reply = 'মেইল সাবমিটের ফরম্যাট: email:password:recoverymail (প্রতি লাইনে একটি করে)।';
      }

      const agentMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'Customer Support (সুমন)',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMsg]);
    }, 800);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Admin and Super Admin Operations
  const isAdmin = Boolean(
    isSuperAdminMode ||
    (user && (
      user.role === 'admin' ||
      user.email.toLowerCase() === 'soheltajbhola@gmail.com' ||
      adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase())
    ))
  );

  const loginAsAdmin = () => {
    setUser(SUPER_ADMIN_USER);
    setIsSuperAdminMode(true);
    localStorage.setItem('mf_user', JSON.stringify(SUPER_ADMIN_USER));
    localStorage.setItem('mf_admin_mode', 'true');
    setCurrentView('admin');
    setIsAuthModalOpen(false);
    triggerConfetti();
  };

  const addAdminEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return;
    if (!adminEmails.map(e => e.toLowerCase()).includes(trimmed)) {
      setAdminEmails(prev => [...prev, trimmed]);
      triggerConfetti();
    }
  };

  const removeAdminEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed === 'soheltajbhola@gmail.com') {
      alert(language === 'bn' ? 'প্রধান সুপার এডমিন ইমেইল (soheltajbhola@gmail.com) মুছে ফেলা যাবে না!' : 'Primary super admin email cannot be removed!');
      return;
    }
    setAdminEmails(prev => prev.filter(e => e.toLowerCase() !== trimmed));
  };

  const updateUserByAdmin = (userId: string, data: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const adjustUserBalance = (userId: string, field: 'balanceBdt' | 'earningBdt', amount: number, note?: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, [field]: Math.max(0, u[field] + amount) };
      }
      return u;
    }));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, [field]: Math.max(0, prev[field] + amount) } : null);
    }
    const newTrx: Transaction = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      type: field === 'balanceBdt' ? 'deposit' : 'sell',
      amount: Math.abs(amount),
      currency: 'BDT',
      status: 'completed',
      createdAt: 'Just now',
      descriptionBn: `এডমিন ব্যালেন্স সমন্বয়: ${amount >= 0 ? '+' : '-'}৳${Math.abs(amount)} (${note || 'সিস্টেম অ্যাডজাস্ট'})`,
      descriptionEn: `Admin Adjustment: ${amount >= 0 ? '+' : '-'}৳${Math.abs(amount)} (${note || 'Manual'})`
    };
    setTransactions(prev => [newTrx, ...prev]);
  };

  const toggleUserBan = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, isBanned: !prev.isBanned } : null);
    }
  };

  const addMarketplaceItem = (item: Omit<MarketplaceItem, 'id' | 'salesCount' | 'rating'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `item_${Date.now()}`,
      salesCount: 0,
      rating: 5.0
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
    triggerConfetti();
  };

  const updateMarketplaceItem = (id: string, updates: Partial<MarketplaceItem>) => {
    setMarketplaceItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMarketplaceItem = (id: string) => {
    setMarketplaceItems(prev => prev.filter(item => item.id !== id));
  };

  const addStockToMarketplaceItem = (id: string, count: number) => {
    setMarketplaceItems(prev => prev.map(item => item.id === id ? { ...item, stock: item.stock + count } : item));
  };

  const approveSellBatch = (batchId: string) => {
    const batch = sellSubmissions.find(b => b.id === batchId);
    if (!batch || batch.status === 'approved') return;

    setSellSubmissions(prev => prev.map(b => b.id === batchId ? { ...b, status: 'approved' } : b));

    adjustUserBalance(batch.userId, 'earningBdt', batch.totalEarning, `ব্যাচ ${batch.id} (${batch.quantity} জিমেইল) অনুমোদন`);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `✅ ব্যাচ ${batch.id} অনুমোদিত হয়েছে!`,
        titleEn: `✅ Batch ${batch.id} Approved!`,
        messageBn: `আপনার ${batch.quantity}টি জিমেইলের মূল্য ৳${batch.totalEarning.toFixed(2)} সেলার ব্যালেন্সে যোগ হয়েছে।`,
        messageEn: `৳${batch.totalEarning.toFixed(2)} credited for batch ${batch.id}.`,
        time: 'Just now',
        type: 'success',
        isRead: false,
        linkView: 'withdraw'
      },
      ...prev
    ]);
    triggerConfetti();
  };

  const rejectSellBatch = (batchId: string, reason: string) => {
    const batch = sellSubmissions.find(b => b.id === batchId);
    if (!batch) return;

    setSellSubmissions(prev => prev.map(b => b.id === batchId ? { ...b, status: 'rejected', notes: reason } : b));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `❌ ব্যাচ ${batch.id} বাতিল করা হয়েছে`,
        titleEn: `❌ Batch ${batch.id} Rejected`,
        messageBn: `কারণ: ${reason || 'মেইলের তথ্য সঠিক পাওয়া যায়নি'}`,
        messageEn: `Reason: ${reason || 'Credentials could not be verified'}`,
        time: 'Just now',
        type: 'alert',
        isRead: false
      },
      ...prev
    ]);
  };

  const approveDeposit = (trxId: string) => {
    const trx = transactions.find(t => t.id === trxId);
    if (!trx || trx.status === 'approved') return;

    setTransactions(prev => prev.map(t => t.id === trxId ? { ...t, status: 'approved' } : t));
    adjustUserBalance(trx.userId, 'balanceBdt', trx.amount, `ডিপোজিট ${trx.method || ''} TrxID: ${trx.trxId || ''}`);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `✅ ৳${trx.amount} ডিপোজিট নিশ্চিত করা হয়েছে!`,
        titleEn: `✅ ৳${trx.amount} Deposit Verified!`,
        messageBn: `আপনার বায়ার ওয়ালেট ব্যালেন্সে ফান্ড যুক্ত করা হয়েছে।`,
        messageEn: `Funds added to your buyer balance.`,
        time: 'Just now',
        type: 'payment',
        isRead: false,
        linkView: 'wallet'
      },
      ...prev
    ]);
    triggerConfetti();
  };

  const rejectDeposit = (trxId: string, reason?: string) => {
    setTransactions(prev => prev.map(t => t.id === trxId ? {
      ...t,
      status: 'rejected',
      descriptionBn: t.descriptionBn + (reason ? ` (বাতিল: ${reason})` : ' (বাতিল)')
    } : t));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `❌ ডিপোজিট অনুরোধ বাতিল করা হয়েছে`,
        titleEn: `❌ Deposit Request Rejected`,
        messageBn: reason || 'প্রদত্ত TrxID বা অ্যাকাউন্টে মিল পাওয়া যায়নি।',
        messageEn: reason || 'TrxID could not be verified.',
        time: 'Just now',
        type: 'alert',
        isRead: false
      },
      ...prev
    ]);
  };

  const approveWithdrawal = (trxId: string, payoutTrxId?: string) => {
    const actualTrxId = payoutTrxId || `PAY${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactions(prev => prev.map(t => t.id === trxId ? {
      ...t,
      status: 'approved',
      trxId: actualTrxId
    } : t));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `💸 উইথড্র পেমেন্ট সফলভাবে পাঠানো হয়েছে!`,
        titleEn: `💸 Withdrawal Payout Dispatched!`,
        messageBn: `পেমেন্ট TrxID: ${actualTrxId}`,
        messageEn: `Payment TrxID: ${actualTrxId}`,
        time: 'Just now',
        type: 'payment',
        isRead: false,
        linkView: 'history'
      },
      ...prev
    ]);
    triggerConfetti();
  };

  const rejectWithdrawal = (trxId: string, reason?: string) => {
    const trx = transactions.find(t => t.id === trxId);
    if (!trx || trx.status === 'rejected') return;

    setTransactions(prev => prev.map(t => t.id === trxId ? {
      ...t,
      status: 'rejected',
      descriptionBn: t.descriptionBn + (reason ? ` (বাতিল ও রিফান্ড: ${reason})` : ' (বাতিল ও রিফান্ড)')
    } : t));

    adjustUserBalance(trx.userId, 'earningBdt', trx.amount, `উইথড্র বাতিল হওয়ায় রিফান্ড`);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        titleBn: `⚠️ উইথড্র বাতিল এবং ৳${trx.amount} রিফান্ড করা হয়েছে`,
        titleEn: `⚠️ Withdrawal Rejected & ৳${trx.amount} Refunded`,
        messageBn: `কারণ: ${reason || 'অ্যাকাউন্ট নাম্বারে সমস্যা থাকায় টাকা ওয়ালেটে ফেরত দেওয়া হয়েছে।'}`,
        messageEn: `Reason: ${reason || 'Failed to dispatch, refunded to wallet.'}`,
        time: 'Just now',
        type: 'alert',
        isRead: false,
        linkView: 'withdraw'
      },
      ...prev
    ]);
  };

  const updateShift = (id: string, updates: Partial<ShiftInfo>) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleShiftActive = (id: string) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const addShift = (shift: ShiftInfo) => {
    setShifts(prev => [...prev, shift]);
  };

  const updatePaymentSettings = (settings: Partial<typeof paymentSettings>) => {
    setPaymentSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        setCurrentView,
        language,
        setLanguage,
        marketplaceItems,
        buyerOrders,
        sellSubmissions,
        transactions,
        reviews,
        shifts,
        notifications,
        chatMessages,
        isChatOpen,
        setIsChatOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        logout,
        registerUser,
        updateUserProfile,
        buyGmails,
        submitSellBatch,
        requestDeposit,
        requestWithdrawal,
        performExchange,
        addReview,
        deleteReview,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerConfetti,
        
        // Admin Features
        isAdmin,
        isSuperAdminMode,
        setIsSuperAdminMode,
        adminEmails,
        addAdminEmail,
        removeAdminEmail,
        loginAsAdmin,
        allUsers,
        updateUserByAdmin,
        adjustUserBalance,
        toggleUserBan,
        addMarketplaceItem,
        updateMarketplaceItem,
        deleteMarketplaceItem,
        addStockToMarketplaceItem,
        approveSellBatch,
        rejectSellBatch,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        updateShift,
        toggleShiftActive,
        addShift,
        paymentSettings,
        updatePaymentSettings,
        siteNotice,
        setSiteNotice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
