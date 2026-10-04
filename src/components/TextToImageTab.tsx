import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, Download, Copy, Check, Maximize2, X, Wand2 } from 'lucide-react';
import { GeneratedImageItem } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface TextToImageTabProps {
  language: Language;
}

export const TextToImageTab: React.FC<TextToImageTabProps> = ({ language }) => {
  const t = TRANSLATIONS[language].image;
  const [prompt, setPrompt] = useState<string>(
    language === 'bn'
      ? 'সুন্দরবনের গভীর ম্যানগ্রোভ অরণ্যে চাঁদের আলোয় দাঁড়িয়ে থাকা এক রাজকীয় বেঙ্গল টাইগার'
      : 'A majestic Royal Bengal Tiger standing under moonlight in a misty deep mangrove forest of Sundarbans'
  );
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [style, setStyle] = useState<string>('cinematic');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentPromptUsed, setCurrentPromptUsed] = useState<string>('');
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const styleOptions = language === 'bn' ? [
    { id: 'cinematic', label: '🎬 সিনেমাটিক ৮K', desc: 'নাটকীয় আলো ও বাস্তবসম্মত দৃশ্য' },
    { id: 'bengali-cultural', label: '🇧🇩 বাংলার ঐতিহ্য ও রূপ', desc: 'গ্রামবাংলার মনোরম প্রকৃতি ও ঐতিহ্য' },
    { id: 'anime', label: '🌸 অ্যানিমে আর্ট স্টাইল', desc: 'মাকোতো শিনকাই ভাইব্রেন্ট অ্যানিমেশন' },
    { id: 'digital-art', label: '🌌 ডিজিটাল আর্ট', desc: 'মডার্ন কনসেপ্ট আর্ট ও গ্লোয়িং কালার' },
    { id: 'fantasy', label: '🔮 মিস্টিক ফ্যান্টাসি', desc: 'জাদুকরী ও পৌরাণিক পরিবেশ' },
  ] : [
    { id: 'cinematic', label: '🎬 Cinematic 8K', desc: 'Dramatic lighting, octane render, photorealism' },
    { id: 'bengali-cultural', label: '🇧🇩 Bengal Cultural Heritage', desc: 'Authentic Bengal landscapes and vivid atmosphere' },
    { id: 'anime', label: '🌸 Anime Studio Ghibli', desc: 'Makoto Shinkai vibrant anime concept art' },
    { id: 'digital-art', label: '🌌 Digital Concept Art', desc: 'Trending on Artstation, glowing neon highlights' },
    { id: 'fantasy', label: '🔮 Mythic Fantasy', desc: 'Epic ethereal lore, magical ambiance' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square', sub: 'Instagram / Post', icon: '■' },
    { id: '16:9', label: '16:9 Landscape', sub: 'YouTube / Thumbnail', icon: '▬' },
    { id: '9:16', label: '9:16 Portrait', sub: 'Shorts / Reels', icon: '▮' },
    { id: '4:3', label: '4:3 Standard', sub: 'Presentation & Photo', icon: '▰' },
  ];

  const samplePrompts = language === 'bn' ? [
    'ভবিষ্যতের ঢাকা শহর ২০৮০ সাল, নিয়ন লাইট, উড়ন্ত যানবাহন, সাইবারপাঙ্ক আর্ট',
    'একটি প্রাচীন বাঙালি জমিদার বাড়ির উঠোনে একলা দাঁড়িয়ে থাকা এক রাজকন্যা, গোধূলির সোনালী আলো',
    'সুন্দরবনের ঘন কুয়াশাচ্ছন্ন ম্যানগ্রোভ বনে নৌকা বেয়ে যাওয়া এক বৃদ্ধ মাঝি',
    'হিমালয়ের বরফাচ্ছাদিত পাহাড়ের ওপর ভাসমান এক প্রাচীন মায়াবী মন্দির',
    'বাংলা নববর্ষের বৈশাখী মেলা, রঙিন মুখোশ, ঢাক-ঢোল ও প্রাণবন্ত উৎসবের চিত্র',
  ] : [
    'Futuristic cyberpunk city of Dhaka 2080, neon reflections, flying cars, rain',
    'A solitary princess in golden hour standing in an ancient aristocratic Bengal palace courtyard',
    'An elderly boatman rowing through misty Sundarbans mangrove river at sunrise',
    'A mythical temple floating atop snowy Himalayan peaks with ethereal glowing aura',
    'Vibrant Bengali New Year festival (Pohela Boishakh) with colorful masks and celebrations',
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError(language === 'bn' ? 'দয়া করে ছবির বর্ণনা লিখুন' : 'Please enter an image prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setCurrentImage(data.imageUrl);
      setCurrentPromptUsed(data.prompt || prompt);

      const newItem: GeneratedImageItem = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        imageUrl: data.imageUrl,
        aspectRatio,
        style,
        timestamp: new Date().toLocaleTimeString(),
        provider: data.provider || 'gemini',
      };

      setGallery((prev) => [newItem, ...prev.slice(0, 11)]);
    } catch (err: any) {
      console.error('Image gen error:', err);
      setError(err.message || 'Error generating image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wider">{t.badge}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
            {t.heading}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl">
            {t.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Prompt & Styles (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-bold text-white">
                  {t.promptLabel}
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptPlaceholder}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            {/* Sample Prompts */}
            <div>
              <span className="text-xs font-bold text-slate-300 mb-1.5 block">{t.samplePrompts}</span>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p)}
                    className="truncate max-w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 font-medium hover:border-cyan-400 hover:text-white transition-colors"
                  >
                    {p.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-bold text-white mb-2 block">
                {t.aspectRatioLabel}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      aspectRatio === ar.id
                        ? 'border-cyan-400 bg-cyan-500/20 text-white ring-1 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>{ar.icon}</span>
                      <span>{ar.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{ar.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Art Style */}
            <div>
              <label className="text-xs font-bold text-white mb-2 block">
                {t.styleLabel}
              </label>
              <div className="space-y-2">
                {styleOptions.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setStyle(st.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      style === st.id
                        ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{st.label}</div>
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim()}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/20 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin text-slate-950" />
                  {t.generatingBtn}
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 text-slate-950" />
                  {t.generateBtn}
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-4 text-xs font-bold text-rose-200">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Output: Current Image & Gallery (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Main Image Display */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{t.resultTitle}</h3>
              {currentImage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightboxImage(currentImage)}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-200 hover:text-white"
                    title={t.fullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <a
                    href={currentImage}
                    download={`bangla-ai-art-${Date.now()}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    <Download className="h-4 w-4" />
                    {t.download}
                  </a>
                </div>
              )}
            </div>

            {currentImage ? (
              <div className="mt-4 space-y-3">
                <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[300px]">
                  <img
                    src={currentImage}
                    alt={prompt}
                    referrerPolicy="no-referrer"
                    className="w-full object-contain max-h-[500px] rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        // Alternative direct seed fallback
                        const fallbackSeed = Math.floor(Math.random() * 899999) + 100000;
                        target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(currentPromptUsed || prompt)}?seed=${fallbackSeed}&nologo=true`;
                      }
                    }}
                  />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200">
                  <span className="font-bold text-cyan-300">{t.promptUsed} </span>
                  {currentPromptUsed || prompt}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 text-slate-500 mb-3">
                  <ImageIcon className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">{t.noImageTitle}</h4>
                <p className="mt-1 text-xs text-slate-300 font-medium max-w-xs">
                  {t.noImageDesc}
                </p>
              </div>
            )}
          </div>

          {/* Image History / Gallery */}
          {gallery.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white mb-3">
                {t.galleryTitle} ({gallery.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentImage(item.imageUrl);
                      setPrompt(item.prompt);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-950 transition-all hover:border-cyan-400"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      referrerPolicy="no-referrer"
                      className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <p className="text-xs font-semibold text-white line-clamp-1">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-2">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 rounded-full bg-slate-900/80 p-2 text-white hover:bg-rose-500"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Fullscreen view"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
