import React from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCheck,
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
    language
  } = useApp();

  const t = getTranslation(language);

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'alert':
        return <Sparkles className="w-5 h-5 text-orange-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">{t.notifications}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              {language === 'bn' ? 'সব পঠিত করুন' : 'Mark all read'}
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">
              {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications yet.'}
            </p>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.linkView) {
                    setCurrentView(notif.linkView);
                    setIsNotificationsOpen(false);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : 'bg-slate-950/90 border-amber-500/30 text-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-xs text-white">
                      {language === 'bn' ? notif.titleBn : notif.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {language === 'bn' ? notif.messageBn : notif.messageEn}
                    </p>
                    <span className="block text-[10px] text-slate-500">{notif.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
