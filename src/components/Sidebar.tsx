import React from 'react';
import {
  Volume2,
  Mic,
  FileText,
  Image as ImageIcon,
  Film,
  Radio,
  HelpCircle,
  X,
  QrCode,
  Lock,
} from 'lucide-react';
import { TabType } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenGeminiInfo: () => void;
  onNavigateToAdmin?: () => void;
}

interface MenuItem {
  id: TabType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  isOpenMobile,
  setIsOpenMobile,
  onOpenGeminiInfo,
  onNavigateToAdmin,
}) => {
  const t = TRANSLATIONS[language];

  const menuSections: { sectionTitle: string; items: MenuItem[] }[] = [
    {
      sectionTitle: t.menuHeadingVoice,
      items: [
        {
          id: 'tts',
          title: t.tabs.tts.title,
          subtitle: t.tabs.tts.subtitle,
          icon: Volume2,
          badge: t.tabs.tts.badge,
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        },
        {
          id: 'voice-clone',
          title: t.tabs.voiceClone.title,
          subtitle: t.tabs.voiceClone.subtitle,
          icon: Mic,
          badge: t.tabs.voiceClone.badge,
          badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
        },
      ],
    },
    {
      sectionTitle: t.menuHeadingContent,
      items: [
        {
          id: 'script',
          title: t.tabs.script.title,
          subtitle: t.tabs.script.subtitle,
          icon: FileText,
          badge: t.tabs.script.badge,
          badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        },
        {
          id: 'image',
          title: t.tabs.image.title,
          subtitle: t.tabs.image.subtitle,
          icon: ImageIcon,
          badge: t.tabs.image.badge,
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        },
      ],
    },
    {
      sectionTitle: t.menuHeadingProduction,
      items: [
        {
          id: 'pipeline',
          title: t.tabs.pipeline.title,
          subtitle: t.tabs.pipeline.subtitle,
          icon: Film,
          badge: t.tabs.pipeline.badge,
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        },
      ],
    },
    {
      sectionTitle: t.menuHeadingUtilities,
      items: [
        {
          id: 'qr-barcode',
          title: t.tabs.qrBarcode.title,
          subtitle: t.tabs.qrBarcode.subtitle,
          icon: QrCode,
          badge: t.tabs.qrBarcode.badge,
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        },
      ],
    },
  ];

  const handleSelectTab = (id: TabType) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950/98 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xl tracking-tight font-['Plus_Jakarta_Sans']">
                  freeall
                </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">freeall Studio & AI</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                {section.sectionTitle}
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white shadow-md ring-1 ring-emerald-500/50'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-900 text-slate-300 group-hover:text-white'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-100 leading-snug">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 font-medium">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Pill Badge */}
                      {item.badge && (
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold font-mono ${
                            item.badgeColor || 'border-slate-700 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Gemini Engine Card */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.engineActive}
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
                Online
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 font-medium">
              {t.engineDesc}
            </p>
            <button
              onClick={onOpenGeminiInfo}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              {t.geminiGuideBtn}
            </button>

            {onNavigateToAdmin && (
              <button
                onClick={() => {
                  setIsOpenMobile(false);
                  onNavigateToAdmin();
                }}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>অ্যাডমিন প্যানেল (/admin)</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
