import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TextToVoiceTab } from './components/TextToVoiceTab';
import { VoiceRecorderTab } from './components/VoiceRecorderTab';
import { ScriptWriterTab } from './components/ScriptWriterTab';
import { TextToImageTab } from './components/TextToImageTab';
import { StoryboardPipelineTab } from './components/StoryboardPipelineTab';
import { QrBarcodeTab } from './components/QrBarcodeTab';
import { GeminiInfoModal } from './components/GeminiInfoModal';
import { AdminPanel } from './components/AdminPanel';
import { AdDisplay } from './components/AdDisplay';
import { GeneratedScript, TabType } from './types';
import { Language, TRANSLATIONS } from './data/translations';
import { AdsSystemConfig, DEFAULT_ADS_CONFIG } from './data/defaultAds';
import { Radio, Cpu, Lock, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tts');
  const [language, setLanguage] = useState<Language>('bn');
  const [pipelineScript, setPipelineScript] = useState<GeneratedScript | null>(null);
  const [isGeminiInfoOpen, setIsGeminiInfoOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [apiReady, setApiReady] = useState<boolean>(false);

  // Admin routing state: detects /admin or #/admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#/admin' ||
      window.location.search.includes('route=admin')
    );
  });

  // Ads system state
  const [adsConfig, setAdsConfig] = useState<AdsSystemConfig>(DEFAULT_ADS_CONFIG);

  useEffect(() => {
    // Check backend status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setApiReady(true);
      })
      .catch((err) => console.log('Backend status check:', err));

    // Fetch active ads configuration
    fetch('/api/ads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setAdsConfig(data.config);
        }
      })
      .catch((err) => console.log('Ads fetch check:', err));

    // Handle browser navigation (back/forward)
    const handlePopState = () => {
      const isNowAdmin =
        window.location.pathname === '/admin' ||
        window.location.hash === '#/admin' ||
        window.location.search.includes('route=admin');
      setIsAdminRoute(isNowAdmin);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Execute Popunder & Social Bar background scripts if enabled
  useEffect(() => {
    const popunder = adsConfig.adUnits?.popunder;
    if (popunder?.enabled && popunder.code.trim()) {
      const handleUserClickOnce = () => {
        try {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = popunder.code;
          const scripts = wrapper.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
            newScript.textContent = oldScript.textContent;
            document.head.appendChild(newScript);
          });
        } catch (e) {
          console.error('Popunder execution error:', e);
        }
        window.removeEventListener('click', handleUserClickOnce);
      };

      window.addEventListener('click', handleUserClickOnce, { once: true });
    }

    const socialBar = adsConfig.adUnits?.socialBar;
    if (socialBar?.enabled && socialBar.code.trim()) {
      try {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = socialBar.code;
        const scripts = wrapper.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          document.head.appendChild(newScript);
        });
      } catch (e) {
        console.error('SocialBar execution error:', e);
      }
    }
  }, [adsConfig]);

  const handleNavigateToAdmin = () => {
    setIsAdminRoute(true);
    window.history.pushState(null, '', '/admin');
  };

  const handleBackToStudio = () => {
    setIsAdminRoute(false);
    window.history.pushState(null, '', '/');
  };

  const handleSendToStoryboard = (script: GeneratedScript) => {
    setPipelineScript(script);
    setActiveTab('pipeline');
  };

  const t = TRANSLATIONS[language];

  // -------------------------------------------------------------
  // If user requested /admin route, display the full Admin Panel!
  // -------------------------------------------------------------
  if (isAdminRoute) {
    return <AdminPanel onBackToStudio={handleBackToStudio} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-['Hind_Siliguri']">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onOpenGeminiInfo={() => setIsGeminiInfoOpen(true)}
        onNavigateToAdmin={handleNavigateToAdmin}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Quick Menu Selector & Language Toggle */}
        <TopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenGeminiInfo={() => setIsGeminiInfoOpen(true)}
        />

        {/* Ad Unit: Header Leaderboard 728×90 (Desktop) */}
        {adsConfig.adUnits?.banner728x90?.enabled && (
          <div className="w-full flex justify-center py-2 px-4 bg-slate-950/80 border-b border-slate-900/60 hidden sm:flex">
            <div className="w-[728px] max-w-full min-h-[90px]">
              <AdDisplay adUnit={adsConfig.adUnits.banner728x90} showPlaceholderIfEmpty={false} />
            </div>
          </div>
        )}

        {/* Ad Unit: Mobile Leaderboard 320×50 (Mobile) */}
        {adsConfig.adUnits?.banner320x50?.enabled && (
          <div className="w-full flex justify-center py-1.5 px-2 bg-slate-950/80 border-b border-slate-900/60 sm:hidden">
            <div className="w-[320px] max-w-full min-h-[50px]">
              <AdDisplay adUnit={adsConfig.adUnits.banner320x50} showPlaceholderIfEmpty={false} />
            </div>
          </div>
        )}

        {/* Workspace Body */}
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'tts' && (
            <TextToVoiceTab
              language={language}
              onSendToPipeline={(_audioUrl, _text) => {
                setActiveTab('pipeline');
              }}
            />
          )}

          {activeTab === 'voice-clone' && (
            <VoiceRecorderTab language={language} />
          )}

          {activeTab === 'script' && (
            <ScriptWriterTab
              language={language}
              onSendToStoryboard={handleSendToStoryboard}
            />
          )}

          {activeTab === 'image' && (
            <TextToImageTab language={language} />
          )}

          {activeTab === 'pipeline' && (
            <StoryboardPipelineTab
              language={language}
              initialScript={pipelineScript}
              onNavigateToScript={() => setActiveTab('script')}
            />
          )}

          {activeTab === 'qr-barcode' && (
            <QrBarcodeTab language={language} />
          )}

          {/* Ad Unit: Native Banner (Below main workspace tools) */}
          {adsConfig.adUnits?.nativeBanner?.enabled && (
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <AdDisplay adUnit={adsConfig.adUnits.nativeBanner} showPlaceholderIfEmpty={false} />
            </div>
          )}

          {/* Ad Unit: 468×60 Banner (Mid content) */}
          {adsConfig.adUnits?.banner468x60?.enabled && (
            <div className="mt-8 flex justify-center">
              <div className="w-[468px] max-w-full min-h-[60px]">
                <AdDisplay adUnit={adsConfig.adUnits.banner468x60} showPlaceholderIfEmpty={false} />
              </div>
            </div>
          )}
        </main>

        {/* Studio Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-white tracking-wide">freeall Studio</span>
              <span>—</span>
              <span className="font-medium text-slate-300">All-in-One Voice, Script, Image & Barcode AI</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Cpu className="h-3.5 w-3.5" />
                <span>Gemini 3.8 Powered</span>
              </div>

              <button
                onClick={() => setIsGeminiInfoOpen(true)}
                className="text-cyan-400 hover:underline font-bold"
              >
                {t.geminiGuideBtn}
              </button>

              {/* Explicit Admin Portal Link Button */}
              <button
                onClick={handleNavigateToAdmin}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                title="Admin Login (/admin)"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Admin Panel (/admin)</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Gemini Info Modal */}
      <GeminiInfoModal
        language={language}
        isOpen={isGeminiInfoOpen}
        onClose={() => setIsGeminiInfoOpen(false)}
      />
    </div>
  );
}
