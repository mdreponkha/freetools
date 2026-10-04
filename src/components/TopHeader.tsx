import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Volume2,
  Mic,
  FileText,
  Image as ImageIcon,
  Film,
  Sparkles,
  HelpCircle,
  Check,
  Languages,
  Globe,
  QrCode,
} from 'lucide-react';
import { TabType } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface TopHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenMobileMenu: () => void;
  onOpenGeminiInfo: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenMobileMenu,
  onOpenGeminiInfo,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[language];

  const tools = [
    {
      id: 'tts' as TabType,
      name: t.tabs.tts.title,
      sub: t.tabs.tts.subtitle,
      icon: Volume2,
      badge: 'TTS',
      color: 'text-emerald-400',
    },
    {
      id: 'voice-clone' as TabType,
      name: t.tabs.voiceClone.title,
      sub: t.tabs.voiceClone.subtitle,
      icon: Mic,
      badge: 'Clone',
      color: 'text-teal-400',
    },
    {
      id: 'script' as TabType,
      name: t.tabs.script.title,
      sub: t.tabs.script.subtitle,
      icon: FileText,
      badge: 'Gemini 3.8',
      color: 'text-indigo-400',
    },
    {
      id: 'image' as TabType,
      name: t.tabs.image.title,
      sub: t.tabs.image.subtitle,
      icon: ImageIcon,
      badge: 'Visual AI',
      color: 'text-cyan-400',
    },
    {
      id: 'pipeline' as TabType,
      name: t.tabs.pipeline.title,
      sub: t.tabs.pipeline.subtitle,
      icon: Film,
      badge: 'Studio',
      color: 'text-purple-400',
    },
    {
      id: 'qr-barcode' as TabType,
      name: t.tabs.qrBarcode.title,
      sub: t.tabs.qrBarcode.subtitle,
      icon: QrCode,
      badge: 'QR/Bar',
      color: 'text-amber-400',
    },
  ];

  const currentTool = tools.find((tool) => tool.id === activeTab) || tools[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-xl shadow-md">
      {/* Left: Mobile Toggle & Tool Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-100 hover:text-white lg:hidden shadow-sm"
          title="মেনু খুলুন / Open Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Current Active Tool Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/90 px-4 py-2.5 transition-all hover:border-emerald-500/50 hover:bg-slate-800 shadow-sm"
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 ${currentTool.color}`}>
              <currentTool.icon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {currentTool.name}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold hidden sm:inline-block">
                  {currentTool.badge}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Dropdown Menu Modal */}
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-700 bg-slate-900/98 p-2 shadow-2xl backdrop-blur-2xl z-50">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.toolsMenu}
              </div>
              <div className="space-y-1">
                {tools.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white font-bold ring-1 ring-emerald-500/50'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 text-sm">{item.name}</div>
                          <div className="text-[11px] text-slate-400">{item.sub}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Clean Desktop Quick Nav Pills */}
        <div className="hidden xl:flex items-center space-x-1.5 pl-2">
          {tools.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? item.color : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Language Switcher (বাংলা / English) & Gemini Key Guide */}
      <div className="flex items-center gap-3">
        {/* PROMINENT LANGUAGE SWITCHER TOGGLE */}
        <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900/90 p-1 shadow-inner">
          <button
            onClick={() => setLanguage('bn')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              language === 'bn'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md scale-102'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🇧🇩</span>
            <span>বাংলা</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md scale-102'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        {/* Gemini Guide Button */}
        <button
          onClick={onOpenGeminiInfo}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-400 shadow-sm"
        >
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <span className="hidden sm:inline">{t.geminiGuideBtn}</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>
    </header>
  );
};
