import React from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  Home,
  ShoppingBag,
  Sparkles,
  Wallet,
  User,
  History,
  Repeat,
  ShieldCheck
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, language, user, setIsAuthModalOpen, isAdmin, loginAsAdmin } = useApp();
  const t = getTranslation(language);

  const navItems = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
      action: () => setCurrentView('home')
    },
    {
      id: 'buy',
      label: language === 'bn' ? 'বাই' : 'Buy',
      icon: ShoppingBag,
      action: () => setCurrentView('buy')
    },
    {
      id: 'sell',
      label: language === 'bn' ? 'সেল করুন' : 'Sell',
      icon: Sparkles,
      action: () => setCurrentView('sell'),
      isHighlight: true
    },
    {
      id: 'admin',
      label: language === 'bn' ? 'এডমিন' : 'Admin',
      icon: ShieldCheck,
      action: () => {
        if (isAdmin) {
          setCurrentView('admin');
        } else {
          loginAsAdmin();
        }
      }
    },
    {
      id: 'wallet',
      label: t.wallet,
      icon: Wallet,
      action: () => setCurrentView('wallet')
    }
  ];

  return (
    <div
      id="bottom-mobile-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl"
    >
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={item.action}
                className="relative -top-3 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-slate-950 font-bold transform active:scale-95 transition">
                  <Icon className="w-6 h-6 text-slate-950" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
