import React from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';

export const ReviewShifts: React.FC = () => {
  const { language, shifts, setCurrentView } = useApp();
  const t = getTranslation(language);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 p-6 sm:p-8 space-y-2 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
          <Clock className="w-3.5 h-3.5" />
          {language === 'bn' ? 'সেলার শিফট ম্যানেজমেন্ট' : 'Seller Shift Schedule'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {language === 'bn' ? 'দৈনিক সেলার শিফট ও বোনাস রেট' : 'Daily Shifts & Bonus Rates'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          {language === 'bn'
            ? 'প্রতিদিনের শিফট রুলস, টাইমটেবিল এবং অতিরিক্ত বোনাস সম্পর্কিত বিস্তারিত তথ্য।'
            : 'Explore daily shift schedules, targets, and bonus multipliers.'}
        </p>
      </div>

      {/* Shifts Breakdown Cards */}
      <div className="space-y-6">
        {shifts.map((shift, idx) => (
          <div
            key={shift.id}
            className={`rounded-3xl p-6 sm:p-8 border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl ${
              shift.isActive
                ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/50 shadow-amber-500/10'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">
                  {language === 'bn' ? shift.titleBn : shift.titleEn}
                </h3>
                {shift.isActive ? (
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {language === 'bn' ? 'বর্তমান লাইভ শিফট' : 'Active Shift'}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                    {language === 'bn' ? 'আসন্ন শিফট' : 'Upcoming'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {shift.timeRange}
                </span>
                <span>•</span>
                <span>
                  {language === 'bn' ? 'টার্গেট পূরণ:' : 'Progress:'}{' '}
                  <strong className="text-emerald-400 font-mono">
                    {shift.completedCount}/{shift.targetCount}
                  </strong>{' '}
                  {language === 'bn' ? 'টি' : 'mails'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400">{language === 'bn' ? 'মৌলিক রেট' : 'Base Rate'}:</span>
                  <p className="font-bold text-white text-sm mt-0.5">৳{shift.ratePerMail.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-medium">{language === 'bn' ? 'শিফট বোনাস' : 'Shift Bonus'}:</span>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">+৳{shift.bonusPerMail.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <span className="text-emerald-300 font-bold">{language === 'bn' ? 'মোট রেট' : 'Net Total Rate'}:</span>
                  <p className="font-extrabold text-emerald-400 text-sm mt-0.5">
                    ৳{(shift.ratePerMail + shift.bonusPerMail).toFixed(2)} / মেইল
                  </p>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                {(language === 'bn' ? shift.rulesBn : shift.rulesEn).map((r, rIdx) => (
                  <li key={rIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setCurrentView('sell')}
                className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  shift.isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {language === 'bn' ? 'এই শিফটে সাবমিট করুন' : 'Submit In This Shift'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
