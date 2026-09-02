export type Language = 'bn' | 'en';

export type UserRole = 'seller' | 'buyer' | 'both' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  memberId: string;
  joinDate: string;
  isVerified: boolean;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond VIP';
  balanceBdt: number;
  balanceUsd: number;
  earningBdt: number;
  totalWithdrawnBdt: number;
  totalDepositedBdt: number;
  totalSoldMails: number;
  totalBoughtMails: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarningsBdt: number;
  isBanned?: boolean;
}

export type ViewType =
  | 'home'
  | 'buy'
  | 'sell'
  | 'exchange'
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'orders'
  | 'history'
  | 'reviews'
  | 'review-shifts'
  | 'member-card'
  | 'leaderboard'
  | 'faq'
  | 'policies'
  | 'contact'
  | 'about'
  | 'privacy'
  | 'profile'
  | 'edit-profile'
  | 'change-password'
  | 'settings'
  | 'admin';

export interface MarketplaceItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'fresh' | 'aged' | 'recovery' | 'us_ip' | 'bulk';
  year: number | string;
  priceBdt: number;
  priceUsd: number;
  minQty: number;
  stock: number;
  rating: number;
  salesCount: number;
  featuresBn: string[];
  featuresEn: string[];
  warrantyHours: number;
  badge?: string;
  deliveryType: 'instant' | 'automatic';
}

export interface SellBatchSubmission {
  id: string;
  userId: string;
  userName: string;
  submittedAt: string;
  category: string;
  ratePerMail: number;
  bonusPerMail: number;
  quantity: number;
  totalEarning: number;
  status: 'pending' | 'verifying' | 'approved' | 'rejected';
  mails: {
    email: string;
    pass: string;
    recovery: string;
    status?: 'valid' | 'invalid' | 'duplicate';
  }[];
  notes?: string;
  shiftName?: string;
}

export interface BuyerOrder {
  id: string;
  userId: string;
  itemId: string;
  itemTitle: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: 'BDT' | 'USD';
  status: 'completed' | 'processing' | 'refunded';
  purchasedAt: string;
  warrantyExpireAt: string;
  accounts: {
    email: string;
    pass: string;
    recovery?: string;
    phone?: string;
  }[];
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'exchange' | 'referral';
  amount: number;
  currency: 'BDT' | 'USD';
  method?: string;
  accountNumber?: string;
  trxId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  descriptionBn: string;
  descriptionEn: string;
  fee?: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  userTier?: string;
  rating: number;
  date: string;
  comment: string;
  mailCount?: number;
  payoutAmount?: number;
  shiftName?: string;
  isVerifiedBuyer?: boolean;
  isVerifiedSeller?: boolean;
}

export interface ShiftInfo {
  id: string;
  titleBn: string;
  titleEn: string;
  timeRange: string;
  ratePerMail: number;
  bonusPerMail: number;
  isActive: boolean;
  targetCount: number;
  completedCount: number;
  rulesBn: string[];
  rulesEn: string[];
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  time: string;
  type: 'success' | 'alert' | 'info' | 'payment';
  isRead: boolean;
  linkView?: ViewType;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  senderName: string;
  text: string;
  time: string;
  attachmentUrl?: string;
}
