import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '../i18n';
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export const LiveChatDrawer: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, language } = useApp();
  const t = getTranslation(language);

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const quickQuestions = [
    'মেইল সাবমিট করার ফরম্যাট কী?',
    'উইথড্র দিলে কতক্ষণে টাকা পাব?',
    'জিমেইলের রিকভারি কীভাবে বসাব?',
    'আজকের শিফটের রেট কত?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                {language === 'bn' ? 'মেইল ফ্যাক্টরি লাইভ সাপোর্ট' : 'Mail Factory Live Chat'}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">২৪/৭ অনলাইন ও রেডি</p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Help Chips */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto scrollbar-none flex gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(q)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700'
                  }`}
                >
                  {!isUser && (
                    <p className="text-[10px] font-bold text-amber-400 mb-1">
                      {msg.senderName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={language === 'bn' ? 'মেসেজ লিখুন...' : 'Type your message...'}
            className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
