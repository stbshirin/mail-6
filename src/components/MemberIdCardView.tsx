import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Award,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  Mail,
  Zap,
  Star,
  Users
} from 'lucide-react';

export const MemberIdCardView: React.FC = () => {
  const { language, user, setIsAuthModalOpen } = useApp();
  const t = getTranslation(language);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Award className="w-16 h-16 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">
          {language === 'bn' ? 'মেম্বার আইডি দেখতে লগইন করুন' : 'Login to View Member Card'}
        </h2>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-500 font-bold text-slate-950 text-xs shadow-lg cursor-pointer"
        >
          {t.login}
        </button>
      </div>
    );
  }

  const referralUrl = `https://mailfactory.com/ref/${user.referralCode}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
          <Award className="w-3.5 h-3.5" />
          {language === 'bn' ? 'অফিসিয়াল ডিজিটাল আইডেন্টিটি' : 'Digital Member Identity'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {t.memberCardTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {language === 'bn'
            ? 'মেইল ফ্যাক্টরি প্ল্যাটফর্মের অফিসিয়াল ভেরিফাইড মেম্বার আইডি কার্ড।'
            : 'Official verified identity badge for verified sellers & buyers.'}
        </p>
      </div>

      {/* ID Card Display */}
      <div className="max-w-lg mx-auto">
        <div
          id="digital-member-id-card"
          className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Top Brand & Tier */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white font-serif">
                  Mail<span className="text-amber-400 font-sans">Factory</span>
                </h3>
                <span className="text-[10px] text-slate-400">OFFICIAL MEMBER</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{user.tier}</span>
            </div>
          </div>

          {/* User Info Row */}
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-bold text-white">{user.name}</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 font-mono">{user.email}</p>
              <p className="text-xs text-slate-400 font-mono">{user.phone}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px] font-bold font-mono">
                ID: {user.memberId}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center text-xs">
            <div>
              <span className="text-slate-400 text-[10px]">{t.totalSold}</span>
              <p className="font-bold text-emerald-400 text-sm">{user.totalSoldMails}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">{language === 'bn' ? 'রেফারেল' : 'Referrals'}</span>
              <p className="font-bold text-amber-400 text-sm">{user.referralCount}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">{t.memberSince}</span>
              <p className="font-bold text-white text-[11px]">{user.joinDate}</p>
            </div>
          </div>

          {/* QR Code and Footer */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400">{t.scanQrVerify}</p>
              <p className="text-[11px] font-mono text-slate-300">https://mailfactory.com</p>
            </div>
            <div className="p-2 rounded-xl bg-white text-slate-950 shadow-inner">
              <QrCode className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={copyRefLink}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedLink ? t.copied : language === 'bn' ? 'রেফারেল লিংক কপি করুন' : 'Copy Referral'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
