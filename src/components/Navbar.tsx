import React from 'react';
import { Volume2, Mic, FileText, Image as ImageIcon, Sparkles, Film, HelpCircle, Radio } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenGeminiInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenGeminiInfo }) => {
  const tabs = [
    {
      id: 'tts' as TabType,
      label: 'টেক্সট টু ভয়েস',
      sublabel: 'Text to Bangla Voice',
      icon: Volume2,
      badge: 'Gemini TTS',
    },
    {
      id: 'voice-clone' as TabType,
      label: 'নিজের ভয়েস ট্রান্সফরমার',
      sublabel: 'Voice Clone & Transform',
      icon: Mic,
      badge: 'Transcribe + Voice',
    },
    {
      id: 'script' as TabType,
      label: 'এআই স্ক্রিপ্ট রাইটার',
      sublabel: 'AI Script & Story',
      icon: FileText,
      badge: 'Gemini 3.8',
    },
    {
      id: 'image' as TabType,
      label: 'টেক্সট টু ইমেজ',
      sublabel: 'AI Image Generator',
      icon: ImageIcon,
      badge: 'Image Studio',
    },
    {
      id: 'pipeline' as TabType,
      label: 'ভিডিও স্টোরিবোর্ড',
      sublabel: 'Full Pipeline Studio',
      icon: Film,
      badge: 'All-in-One',
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  BanglaVoice <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline-block">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">বাংলা ভয়েস, স্ক্রিপ্ট ও ইমেজ জেনারেটর স্টুডিও</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGeminiInfo}
              className="group flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-400"
            >
              <HelpCircle className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline">জেমিনি কী গাইড</span>
              <span className="sm:hidden">কী গাইড</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md shadow-emerald-500/5 border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{tab.label}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block">{tab.sublabel}</div>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
