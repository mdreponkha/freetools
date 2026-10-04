import React, { useState } from 'react';
import { Sparkles, RefreshCw, Image as ImageIcon, Volume2, Copy, Check, Download, Film, FileText } from 'lucide-react';
import { GeneratedScript, ScriptScene } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface ScriptWriterTabProps {
  language: Language;
  onSendToStoryboard?: (script: GeneratedScript) => void;
}

export const ScriptWriterTab: React.FC<ScriptWriterTabProps> = ({ language, onSendToStoryboard }) => {
  const t = TRANSLATIONS[language].script;
  const [topic, setTopic] = useState<string>(
    language === 'bn'
      ? 'সুন্দরবনের গভীরে এক প্রাচীন রহস্যময় মন্দিরের সন্ধান'
      : 'Discovery of an ancient mysterious temple hidden deep in the Sundarbans'
  );
  const [scriptType, setScriptType] = useState<string>('shorts');
  const [tone, setTone] = useState<string>('mysterious');
  const [duration, setDuration] = useState<string>('60s');
  const [languageStyle, setLanguageStyle] = useState<string>('bn');

  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Per-scene generation state
  const [sceneImages, setSceneImages] = useState<{ [sceneNumber: number]: string }>({});
  const [sceneAudio, setSceneAudio] = useState<{ [sceneNumber: number]: string }>({});
  const [loadingScenes, setLoadingScenes] = useState<{ [sceneNumber: number]: { image?: boolean; audio?: boolean } }>({});

  // Full voiceover audio
  const [fullAudioUrl, setFullAudioUrl] = useState<string | null>(null);
  const [isGeneratingFullAudio, setIsGeneratingFullAudio] = useState<boolean>(false);

  const sampleTopics = language === 'bn' ? [
    { title: 'সুন্দরবনের রহস্য', topic: 'সুন্দরবনের গভীরে লুকিয়ে থাকা এক প্রাচীন স্বর্ণমন্দির ও রহস্যময় বাঘের গল্প' },
    { title: 'ভাইরাল সাইকোলজি হ্যাক', topic: 'মানুষের মন বোঝার ৩টি গোপন সাইকোলজিক্যাল ট্রিকস যা আপনাকে যেকেউ পছন্দ করতে বাধ্য করবে' },
    { title: 'মহাকাশে অদ্ভুত ঘটনা', topic: 'বিজ্ঞানীরা মহাকাশে এমন এক অদ্ভুত শব্দ শুনেছেন যা কাউকে চমকে দেবে - রহস্যময় সংকেত' },
    { title: 'বাঙালির চায়ের ইতিহাস', topic: 'যেভাবে চা ব্রিটিশদের হাত ধরে বাঙালির প্রাণের পানীয় হয়ে উঠলো - একটি রোমাঞ্চকর ইতিহাস' },
  ] : [
    { title: 'Sundarbans Mystery', topic: 'An ancient golden temple and mysterious Bengal tiger myth deep in the Sundarbans' },
    { title: 'Psychology Hacks', topic: '3 hidden psychological hacks to instantly build rapport and win any conversation' },
    { title: 'Deep Space Signal', topic: 'Astronomers detect a bizarre rhythmic acoustic signal from deep space' },
    { title: 'History of Bengal Tea', topic: 'How tea became the lifeblood of Bengali culture from the colonial era to today' },
  ];

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      setError(language === 'bn' ? 'দয়া করে স্ক্রিপ্টের বিষয়বস্তু লিখুন' : 'Please enter a script topic');
      return;
    }

    setIsGeneratingScript(true);
    setError(null);
    setSceneImages({});
    setSceneAudio({});
    setFullAudioUrl(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          scriptType,
          tone,
          duration,
          language: languageStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'bn' ? 'স্ক্রিপ্ট তৈরি করতে সমস্যা হয়েছে' : 'Failed to generate script'));
      }

      setScript(data.script);
    } catch (err: any) {
      console.error('Script generation error:', err);
      setError(err.message || 'Error generating script');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateSceneImage = async (scene: ScriptScene) => {
    setLoadingScenes((prev) => ({
      ...prev,
      [scene.sceneNumber]: { ...prev[scene.sceneNumber], image: true },
    }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.imagePrompt,
          aspectRatio: scriptType === 'shorts' ? '9:16' : '16:9',
          style: 'cinematic',
        }),
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setSceneImages((prev) => ({
          ...prev,
          [scene.sceneNumber]: data.imageUrl,
        }));
      }
    } catch (err) {
      console.error('Failed to generate scene image:', err);
    } finally {
      setLoadingScenes((prev) => ({
        ...prev,
        [scene.sceneNumber]: { ...prev[scene.sceneNumber], image: false },
      }));
    }
  };

  const handleGenerateSceneAudio = async (scene: ScriptScene) => {
    setLoadingScenes((prev) => ({
      ...prev,
      [scene.sceneNumber]: { ...prev[scene.sceneNumber], audio: true },
    }));

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scene.banglaVoiceover,
          voiceName: 'Puck',
          speechStyle: `${scene.emotion || 'Expressive'} Bengali story narration with high engagement`,
        }),
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        setSceneAudio((prev) => ({
          ...prev,
          [scene.sceneNumber]: audioSrc,
        }));
      }
    } catch (err) {
      console.error('Failed to generate scene audio:', err);
    } finally {
      setLoadingScenes((prev) => ({
        ...prev,
        [scene.sceneNumber]: { ...prev[scene.sceneNumber], audio: false },
      }));
    }
  };

  const handleGenerateFullAudio = async () => {
    if (!script?.fullVoiceoverText) return;

    setIsGeneratingFullAudio(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: script.fullVoiceoverText,
          voiceName: 'Puck',
          speechStyle: 'Master Bengali storytelling narrator, dynamic rhythm, captivating pacing',
        }),
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        setFullAudioUrl(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
      }
    } catch (err) {
      console.error('Full audio error:', err);
    } finally {
      setIsGeneratingFullAudio(false);
    }
  };

  const handleCopyScript = () => {
    if (!script) return;
    const fullText = `Title: ${script.title} (${script.englishTitle})\n${script.logline}\n\n` +
      script.scenes.map((s) => `[Scene ${s.sceneNumber} (${s.timeframe})]\nVisual: ${s.visualDescription}\nVoiceover: ${s.banglaVoiceover}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
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
        {/* Left Form: Topic & Options (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-bold text-white">
                <span>{t.topicLabel}</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.topicPlaceholder}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder-slate-400 outline-none focus:border-indigo-400 font-medium"
              />
            </div>

            {/* Topic Suggestions */}
            <div>
              <span className="text-xs font-bold text-slate-300 mb-1.5 block">{t.popularTopics}</span>
              <div className="flex flex-wrap gap-2">
                {sampleTopics.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopic(s.topic)}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 font-medium hover:border-indigo-400 hover:text-white transition-colors"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Script Format */}
            <div>
              <label className="text-xs font-bold text-white mb-2 block">
                {t.formatLabel}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'shorts', label: '📱 Shorts / Reels', desc: 'YouTube Shorts / TikTok' },
                  { id: 'story', label: '📖 Mystery / Story', desc: 'Narrative Storytelling' },
                  { id: 'ad', label: '📢 Commercial Ad', desc: 'Brand Promotion' },
                  { id: 'drama', label: '🎭 Dialogue', desc: 'Character Script' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setScriptType(fmt.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      scriptType === fmt.id
                        ? 'border-indigo-400 bg-indigo-500/20 text-white ring-1 ring-indigo-400/50'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{fmt.label}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone & Duration Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-white mb-1.5 block">{t.moodLabel}</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-medium outline-none focus:border-indigo-400"
                >
                  <option value="mysterious">{language === 'bn' ? 'রহস্যময় ও রোমাঞ্চকর' : 'Mysterious & Thrilling'}</option>
                  <option value="exciting">{language === 'bn' ? 'উত্তেজনাপূর্ণ ও ফাস্ট-পেসড' : 'Exciting & Fast-paced'}</option>
                  <option value="emotional">{language === 'bn' ? 'আবেগঘন ও হৃদয়স্পর্শী' : 'Emotional & Touching'}</option>
                  <option value="humorous">{language === 'bn' ? 'মজাদার ও হাস্যরসাত্মক' : 'Humorous & Fun'}</option>
                  <option value="informative">{language === 'bn' ? 'তথ্যবহুল ও বৈজ্ঞানিক' : 'Informative & Tech'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-white mb-1.5 block">{t.durationLabel}</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-medium outline-none focus:border-indigo-400"
                >
                  <option value="30s">30s (Shorts)</option>
                  <option value="60s">60s (Standard)</option>
                  <option value="2m">2m (Detailed)</option>
                </select>
              </div>
            </div>

            {/* Language style */}
            <div>
              <label className="text-xs font-bold text-white mb-1.5 block">{t.languageStyleLabel}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguageStyle('bn')}
                  className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                    languageStyle === 'bn'
                      ? 'border-indigo-400 bg-indigo-500/25 text-white ring-1 ring-indigo-400/50'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {t.pureBangla}
                </button>
                <button
                  onClick={() => setLanguageStyle('bn-en')}
                  className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                    languageStyle === 'bn-en'
                      ? 'border-indigo-400 bg-indigo-500/25 text-white ring-1 ring-indigo-400/50'
                      : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}
                >
                  {t.modernBanglish}
                </button>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript || !topic.trim()}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingScript ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.generatingBtn}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t.generateBtn}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Scenes & Integration (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {script ? (
            <div className="space-y-5">
              {/* Script Title Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="rounded-md bg-indigo-500/25 border border-indigo-400/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                      {script.targetAudience}
                    </span>
                    <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">{script.title}</h2>
                    <p className="text-xs text-slate-300 font-medium">{script.englishTitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyScript}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? t.copied : t.copyScript}
                    </button>

                    {onSendToStoryboard && (
                      <button
                        onClick={() => onSendToStoryboard(script)}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                      >
                        <Film className="h-3.5 w-3.5" />
                        {t.sendToStoryboard}
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-3.5 text-xs leading-relaxed text-slate-200 font-medium bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-indigo-300">{t.logline} </span>
                  {script.logline}
                </p>

                {/* Full Audio Generator Button */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{t.fullAudioTitle}</div>
                      <div className="text-xs text-slate-300 font-medium">{t.fullAudioDesc}</div>
                    </div>
                  </div>

                  {fullAudioUrl ? (
                    <div className="flex items-center gap-2">
                      <audio controls src={fullAudioUrl} className="h-8 max-w-xs" />
                      <a
                        href={fullAudioUrl}
                        download={`full-script-voice-${Date.now()}.wav`}
                        className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950"
                        title="ডাউনলোড"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateFullAudio}
                      disabled={isGeneratingFullAudio}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {isGeneratingFullAudio ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          {t.generatingVoice}
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" />
                          {t.generateFullAudio}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Scene Cards List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">
                  {t.scenesTitle} ({script.scenes.length})
                </h3>

                {script.scenes.map((scene) => {
                  const sceneImg = sceneImages[scene.sceneNumber];
                  const sceneAud = sceneAudio[scene.sceneNumber];
                  const isLoadingImg = loadingScenes[scene.sceneNumber]?.image;
                  const isLoadingAud = loadingScenes[scene.sceneNumber]?.audio;

                  return (
                    <div
                      key={scene.sceneNumber}
                      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-lg backdrop-blur-sm"
                    >
                      {/* Scene Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-300">
                            {scene.sceneNumber}
                          </span>
                          <span className="font-bold text-white">Scene {scene.sceneNumber}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-slate-300 font-semibold">{scene.timeframe}</span>
                        </div>
                        <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-purple-300 font-semibold">
                          {scene.emotion}
                        </span>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="space-y-3 md:col-span-8">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                              {t.visualDesc}
                            </span>
                            <p className="mt-1 text-xs text-slate-200 leading-relaxed font-medium">
                              {scene.visualDescription}
                            </p>
                          </div>

                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                            <span className="text-xs font-bold text-emerald-300 block mb-1">
                              {t.voiceoverText}
                            </span>
                            <p className="text-sm font-semibold text-white leading-relaxed">
                              "{scene.banglaVoiceover}"
                            </p>

                            {sceneAud && (
                              <div className="mt-2.5 flex items-center gap-2">
                                <audio controls src={sceneAud} className="h-7 w-full max-w-xs" />
                                <a
                                  href={sceneAud}
                                  download={`scene-${scene.sceneNumber}-voice.wav`}
                                  className="text-emerald-400 hover:text-emerald-300 p-1"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              onClick={() => handleGenerateSceneAudio(scene)}
                              disabled={isLoadingAud}
                              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50"
                            >
                              {isLoadingAud ? (
                                <>
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                  {t.generatingVoice}
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5" />
                                  {t.genSceneVoice}
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleGenerateSceneImage(scene)}
                              disabled={isLoadingImg}
                              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-50"
                            >
                              {isLoadingImg ? (
                                <>
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                  {t.generatingImage}
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="h-3.5 w-3.5" />
                                  {t.genSceneImage}
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col justify-center">
                          {sceneImg ? (
                            <div className="relative group overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                              <img
                                src={sceneImg}
                                alt={`Scene ${scene.sceneNumber}`}
                                referrerPolicy="no-referrer"
                                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <a
                                href={sceneImg}
                                download={`scene-${scene.sceneNumber}.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-2 right-2 rounded-lg bg-slate-900/90 p-1.5 text-white hover:bg-emerald-500 hover:text-slate-950"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleGenerateSceneImage(scene)}
                              className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-3 text-center transition-colors hover:border-cyan-400 hover:bg-slate-900"
                            >
                              {isLoadingImg ? (
                                <div className="flex flex-col items-center gap-1.5">
                                  <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
                                  <span className="text-xs font-bold text-cyan-300">{t.generatingImage}</span>
                                </div>
                              ) : (
                                <>
                                  <ImageIcon className="h-6 w-6 text-slate-400" />
                                  <span className="mt-1 text-xs font-bold text-slate-200">
                                    {t.genSceneImage}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-14 text-center">
              <FileText className="h-12 w-12 text-slate-500 mb-3" />
              <h3 className="text-base font-bold text-slate-200">{t.noScriptTitle}</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-300 font-medium">
                {t.noScriptDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
