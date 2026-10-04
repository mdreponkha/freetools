import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Radio,
  Sliders,
  Code2,
  Sparkles,
  ExternalLink,
  Layers,
  Copy,
  Check,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { AdUnitConfig, AdsSystemConfig, DEFAULT_ADS_CONFIG } from '../data/defaultAds';

interface AdminPanelProps {
  onBackToStudio: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStudio }) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('freeall_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Ads Configuration State
  const [adsConfig, setAdsConfig] = useState<AdsSystemConfig>(DEFAULT_ADS_CONFIG);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Active filter category
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSlotId, setCopiedSlotId] = useState<string | null>(null);

  // Fetch current ads configuration from server
  useEffect(() => {
    fetch('/api/ads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setAdsConfig(data.config);
        }
      })
      .catch((err) => console.error('Error fetching ads config:', err))
      .finally(() => setIsLoadingConfig(false));
  }, []);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ভুল ইউজারনেম বা পাসওয়ার্ড');
      }

      sessionStorage.setItem('freeall_admin_auth', 'true');
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('freeall_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Update a single ad slot configuration
  const handleUpdateAdUnit = (slotId: string, updates: Partial<AdUnitConfig>) => {
    setAdsConfig((prev) => ({
      ...prev,
      adUnits: {
        ...prev.adUnits,
        [slotId]: {
          ...prev.adUnits[slotId],
          ...updates,
        },
      },
    }));
  };

  // Save all ads to server
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            ...adsConfig,
            lastUpdated: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'কনফিগ সেভ করতে ব্যর্থ হয়েছে');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'সেভ করতে ত্রুটি ঘটেছে');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySlotCode = (slotId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSlotId(slotId);
    setTimeout(() => setCopiedSlotId(null), 2000);
  };

  // Filter ad units
  const adUnitList = Object.values(adsConfig.adUnits || {});
  const filteredUnits = adUnitList.filter((unit) => {
    const matchesCategory = filterCategory === 'all' || unit.category === filterCategory;
    const matchesQuery =
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.dimensions && unit.dimensions.includes(searchQuery));
    return matchesCategory && matchesQuery;
  });

  const activeCount = adUnitList.filter((u) => u.enabled).length;

  // -------------------------------------------------------------
  // 1. RENDER LOGIN SCREEN (WHEN NOT LOGGED IN)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-full max-w-md space-y-6">
          {/* Back button */}
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>মূল স্টুডিওতে ফিরে যান (Back to Studio)</span>
          </button>

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                  <ShieldCheck className="h-7 w-7 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">freeall Admin Portal</h1>
              <p className="text-xs text-slate-300 font-medium">
                অ্যাড কোড ও মনেটাইজেশন কন্ট্রোল প্যানেল
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              {/* Username Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ইউজারনেম (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs font-bold text-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn || !usernameInput || !passwordInput}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.99]"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>লগইন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>অ্যাডমিন প্যানেলে প্রবেশ করুন (Login)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RENDER AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Hind_Siliguri']">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-8 py-4 shadow-lg">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>মূল স্টুডিও (Studio)</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg tracking-tight font-['Plus_Jakarta_Sans']">
                  freeall
                </span>
                <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400">
                  Ads & Monetization Control
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save All Button */}
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>কোড সংরক্ষণ করুন (Save All Codes)</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-8 py-8 space-y-6">
        {/* Status / Notice Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>ম্যানেজমেন্ট কনসোল সক্রিয়</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white tracking-tight">
                বিজ্ঞাপন ও মনেটাইজেশন কোড ম্যানেজার (Ads Manager)
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-3xl">
                Adsterra, Monetag, Google AdSense, PropellerAds বা যেকোনো অ্যাড নেটওয়ার্কের স্ক্রিপ্ট ও ব্যানার কোড নিচে পেস্ট করুন। কোড সেভ করলেই তা স্বয়ংক্রিয়ভাবে ফ্রিঅল (freeall) স্টুডিওতে লাইভ হয়ে যাবে।
              </p>
            </div>

            {/* Stats badges */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
                <div className="text-xl font-bold text-white font-mono">{adUnitList.length}</div>
                <div className="text-[11px] text-slate-400 font-medium">মোট স্লট</div>
              </div>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-center">
                <div className="text-xl font-bold text-emerald-400 font-mono">{activeCount}</div>
                <div className="text-[11px] text-emerald-300 font-medium">সক্রিয় বিজ্ঞাপন</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success / Error Toasts */}
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500/20 p-4 text-sm font-bold text-emerald-300 shadow-xl">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>সবগুলো বিজ্ঞাপন কোড সফলভাবে সংরক্ষণ করা হয়েছে এবং সাইটে লাইভ করা হয়েছে!</span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500 bg-rose-500/20 p-4 text-sm font-bold text-rose-300 shadow-xl">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'সকল অ্যাড (All Units)' },
              { id: 'pop', label: 'Popunder' },
              { id: 'banner', label: 'Banners' },
              { id: 'social', label: 'Social Bar' },
              { id: 'native', label: 'Native Widget' },
              { id: 'smartlink', label: 'Smartlink' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="স্লট বা সাইজ খুঁজুন (e.g. 300x250)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Ad Units List (All 10 Requested Slots) */}
        <div className="space-y-6">
          {filteredUnits.map((unit) => {
            return (
              <div
                key={unit.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  unit.enabled
                    ? 'border-emerald-500/40 bg-slate-900/95 shadow-xl ring-1 ring-emerald-500/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {/* Slot Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                        unit.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{unit.name}</h3>
                        {unit.dimensions && (
                          <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                            {unit.dimensions}
                          </span>
                        )}
                        <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                          {unit.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">
                        {unit.banglaDesc}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold ${
                        unit.enabled ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {unit.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateAdUnit(unit.id, { enabled: !unit.enabled })}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        unit.enabled ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          unit.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Code Input & Preview Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span>অ্যাড কোড বা স্ক্রিপ্ট পেস্ট করুন (HTML / JavaScript / URL):</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 italic">
                          {unit.placementNote}
                        </span>
                        {unit.code && (
                          <button
                            onClick={() => handleCopySlotCode(unit.id, unit.code)}
                            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium"
                          >
                            {copiedSlotId === unit.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>{copiedSlotId === unit.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                        {unit.code && (
                          <button
                            onClick={() => handleUpdateAdUnit(unit.id, { code: '' })}
                            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={unit.code}
                      onChange={(e) => handleUpdateAdUnit(unit.id, { code: e.target.value })}
                      rows={4}
                      placeholder={`<!-- এখানে ${unit.name} এর বিজ্ঞাপন কোড পেস্ট করুন -->\n<script type="text/javascript">\n  // ad network code goes here\n</script>`}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-emerald-300 placeholder-slate-600 outline-none focus:border-emerald-400 font-medium"
                    />
                  </div>

                  {/* Live Status indicator */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          unit.code.trim() && unit.enabled
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-slate-600'
                        }`}
                      />
                      <span>
                        {unit.code.trim() && unit.enabled
                          ? 'কোড যুক্ত আছে এবং লাইভ চলবে'
                          : unit.code.trim()
                          ? 'কোড সেভ আছে কিন্তু স্লট নিষ্ক্রিয়'
                          : 'কোনো কোড দেওয়া হয়নি (ফাঁকা)'}
                      </span>
                    </div>

                    {unit.code.trim() && (
                      <span className="font-mono text-slate-400">
                        {unit.code.length} characters
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 font-medium">
            কোড পরিবর্তন করার পর অবশ্যই নিচের <span className="font-bold text-emerald-400">"কোড সংরক্ষণ করুন"</span> বাটনে চাপ দিন।
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>কোড সংরক্ষণ করুন (Save All Codes)</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
