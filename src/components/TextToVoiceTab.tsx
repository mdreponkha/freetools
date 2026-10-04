import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Download, Sparkles, RefreshCw, Copy, Check, RotateCcw, Sliders, Music } from 'lucide-react';
import { GEMINI_VOICES, SAMPLE_BANGLA_TEXTS } from '../data/voices';
import { GeneratedAudioItem, VoiceOption } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface TextToVoiceTabProps {
  language: Language;
  onSendToPipeline?: (audioUrl: string, text: string) => void;
}

export const TextToVoiceTab: React.FC<TextToVoiceTabProps> = ({ language, onSendToPipeline }) => {
  const t = TRANSLATIONS[language].tts;
  const [inputText, setInputText] = useState<string>(SAMPLE_BANGLA_TEXTS[0].text);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(GEMINI_VOICES[0]);
  const [speechStyle, setSpeechStyle] = useState<string>('Natural and expressive Bengali narrator with warm intonation');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Audio playback state
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<GeneratedAudioItem[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stylePresets = language === 'bn' ? [
    { label: 'স্বাভাবিক ও সুন্দর', value: 'Natural, clear, and melodious Bengali pronunciation with warm conversational tone' },
    { label: 'গল্প ও নাটকীয়', value: 'Captivating and dramatic Bengali story narrator with expressive pauses and mystery' },
    { label: 'উদ্যমী আরজে/শর্টস', value: 'Energetic, fast-paced, vibrant Bengali YouTube Shorts host / Radio Jockey style' },
    { label: 'সংবাদ উপস্থাপক', value: 'Authoritative, calm, professional Bengali television news anchor' },
    { label: 'কোমল ও মেডিটেশন', value: 'Soft, whispering, soothing Bengali voice for relaxation and poetry' },
    { label: 'সিনেমাটিক ট্রেলার', value: 'Deep, cinematic, impactful movie trailer voice in Bengali' },
  ] : [
    { label: 'Natural & Warm', value: 'Natural, clear, and melodious Bengali pronunciation with warm conversational tone' },
    { label: 'Dramatic Storyteller', value: 'Captivating and dramatic Bengali story narrator with expressive pauses and mystery' },
    { label: 'Energetic Shorts / RJ', value: 'Energetic, fast-paced, vibrant Bengali YouTube Shorts host / Radio Jockey style' },
    { label: 'News Anchor', value: 'Authoritative, calm, professional Bengali television news anchor' },
    { label: 'Gentle & Meditative', value: 'Soft, whispering, soothing Bengali voice for relaxation and poetry' },
    { label: 'Cinematic Movie Trailer', value: 'Deep, cinematic, impactful movie trailer voice in Bengali' },
  ];

  // Handle Audio playback lifecycle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleGenerateVoice = async () => {
    if (!inputText.trim()) {
      setError(language === 'bn' ? 'দয়া করে কিছু বাংলা লেখা দিন' : 'Please enter Bengali text to speak');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          voiceName: selectedVoice.id,
          speechStyle: speechStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'bn' ? 'ভয়েস তৈরি করতে সমস্যা হয়েছে' : 'Failed to generate voice'));
      }

      const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      setCurrentAudioUrl(audioSrc);

      const newItem: GeneratedAudioItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        audioUrl: audioSrc,
        voiceName: selectedVoice.name,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 9)]);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 200);
    } catch (err: any) {
      console.error('TTS error:', err);
      setError(err.message || (language === 'bn' ? 'ভয়েস জেনারেটরে সাময়িক ত্রুটি। পুনরায় চেষ্টা করুন।' : 'TTS error. Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSample = (sample: (typeof SAMPLE_BANGLA_TEXTS)[0]) => {
    setInputText(sample.text);
    const voice = GEMINI_VOICES.find((v) => v.id === sample.voice) || GEMINI_VOICES[0];
    setSelectedVoice(voice);
    setSpeechStyle(sample.style);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="space-y-8">
      {/* Hidden audio element for playback */}
      {currentAudioUrl && <audio ref={audioRef} src={currentAudioUrl} preload="auto" />}

      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
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

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300">{t.sampleLabel}</span>
            {SAMPLE_BANGLA_TEXTS.slice(0, 3).map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(sample)}
                className="rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-emerald-400 hover:bg-slate-800 hover:text-white"
              >
                {sample.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Text Input & Voice Selection (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Text Input Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-white">
                <Volume2 className="h-4 w-4 text-emerald-400" />
                {t.inputLabel}
              </label>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                <span>{inputText.length} {t.characters}</span>
                <span>•</span>
                <span>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} {t.words}</span>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold"
                  title="লেখা কপি করুন"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.inputPlaceholder}
                rows={6}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-base leading-relaxed text-white placeholder-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute right-3 bottom-3 rounded-lg bg-slate-800/90 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors"
                >
                  {t.clear}
                </button>
              )}
            </div>

            {/* Quick Sample Selector Bar */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="shrink-0 font-bold text-slate-400">{t.presets}</span>
              {SAMPLE_BANGLA_TEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(sample)}
                  className="shrink-0 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-200 font-medium transition-colors hover:border-slate-500 hover:text-emerald-300"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Personas Selection */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{t.selectVoice}</h3>
                <p className="text-xs text-slate-300 font-medium">{t.selectVoiceDesc}</p>
              </div>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-emerald-400 font-bold font-mono">
                {selectedVoice.name} {t.selectedBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {GEMINI_VOICES.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;
                const voiceDesc = language === 'en' && voice.engDescription ? voice.engDescription : voice.description;
                const voiceTag = language === 'en' && voice.engTag ? voice.engTag : voice.tag;

                return (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? `bg-slate-800 ${voice.color} ring-2 ring-emerald-500/70 shadow-lg`
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{voice.name}</span>
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300 font-semibold">
                            {voice.gender === 'female' ? t.female : t.male}
                          </span>
                        </div>
                        <span className="mt-1 inline-block text-xs font-bold text-emerald-300">
                          {voiceTag}
                        </span>
                      </div>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                      {voiceDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speech Tone & Style Customizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <label className="mb-1 flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="h-4 w-4 text-cyan-400" />
              {t.speechStyle}
            </label>
            <p className="mb-3 text-xs text-slate-300 font-medium">
              {t.speechStyleDesc}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {stylePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSpeechStyle(preset.value)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    speechStyle === preset.value
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400 ring-1 ring-emerald-400/50'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={speechStyle}
              onChange={(e) => setSpeechStyle(e.target.value)}
              placeholder={t.customStylePlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-medium outline-none focus:border-cyan-400"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVoice}
            disabled={isGenerating || !inputText.trim()}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:opacity-95 hover:shadow-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin text-slate-950" />
                <span>{t.generatingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-slate-950 transition-transform group-hover:scale-110" />
                <span>{t.generateBtn}</span>
              </>
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-4 text-sm font-semibold text-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Audio Output Player & History (5 Cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Player Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.playerTitle}</h3>
                  <p className="text-xs text-slate-300 font-medium">{t.playerSubtitle}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-emerald-400 font-mono font-bold">
                Gemini 3.8
              </span>
            </div>

            {currentAudioUrl ? (
              <div className="mt-6 space-y-6">
                {/* Visualizer Waveform mockup */}
                <div className="relative flex h-24 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex h-full w-full items-end justify-between gap-1 px-2">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const heights = [
                        25, 45, 65, 85, 40, 75, 95, 60, 30, 70, 90, 50, 35, 80, 100, 65, 40, 85,
                        95, 55, 30, 70, 85, 45, 60, 90, 75, 40, 80, 95, 50, 35, 65, 85, 45, 30,
                      ];
                      const activePercentage = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
                      const barPercentage = (i / 36) * 100;
                      const isPlayed = barPercentage <= activePercentage;

                      return (
                        <div
                          key={i}
                          style={{
                            height: isPlaying ? `${Math.max(15, (heights[i] * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : `${heights[i] * 0.6}%`,
                          }}
                          className={`w-full rounded-full transition-all duration-150 ${
                            isPlayed
                              ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                              : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Playhead Time Overlay */}
                  <div className="absolute top-2 right-3 rounded-lg bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-slate-700">
                    {formatTime(currentTime)} / {formatTime(audioDuration || 0)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max={audioDuration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => {
                      const newTime = Number(e.target.value);
                      setCurrentTime(newTime);
                      if (audioRef.current) audioRef.current.currentTime = newTime;
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
                  />
                  <div className="flex justify-between font-mono text-xs font-semibold text-slate-300">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime = 0;
                      setCurrentTime(0);
                    }}
                    className="rounded-full border border-slate-700 bg-slate-950 p-3 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
                    title="পুনরায় শুরু / Replay"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </button>

                  <a
                    href={currentAudioUrl}
                    download={`bangla-voice-${selectedVoice.id}-${Date.now()}.wav`}
                    className="rounded-full border border-slate-700 bg-slate-950 p-3 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors"
                    title="ডাউনলোড WAV অডিও / Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={currentAudioUrl}
                    download={`bangla-voice-${selectedVoice.id}-${Date.now()}.wav`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    <Download className="h-4 w-4" />
                    {t.downloadWav}
                  </a>

                  {onSendToPipeline && (
                    <button
                      onClick={() => onSendToPipeline(currentAudioUrl, inputText)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-3 text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/25"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t.addToStoryboard}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 text-slate-400">
                  <Volume2 className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-slate-200">{t.noAudioTitle}</h4>
                <p className="mt-1 max-w-xs text-xs text-slate-300 font-medium">
                  {t.noAudioDesc}
                </p>
              </div>
            )}
          </div>

          {/* Voice Generation History */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-bold text-white">{t.historyTitle} ({history.length})</h3>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentAudioUrl(item.audioUrl);
                      setInputText(item.text);
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 transition-colors hover:border-slate-600 hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400">{item.voiceName}</span>
                        <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="truncate text-xs text-slate-200 mt-0.5 font-medium">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentAudioUrl(item.audioUrl);
                          setTimeout(() => {
                            if (audioRef.current) audioRef.current.play();
                          }, 100);
                        }}
                        className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
