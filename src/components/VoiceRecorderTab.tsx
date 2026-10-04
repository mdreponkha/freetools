import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Sparkles, Upload, Wand2, Download, CheckCircle } from 'lucide-react';
import { GEMINI_VOICES } from '../data/voices';
import { VoiceOption } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface VoiceRecorderTabProps {
  language: Language;
}

export const VoiceRecorderTab: React.FC<VoiceRecorderTabProps> = ({ language }) => {
  const t = TRANSLATIONS[language].voiceClone;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Transcription & Transformation State
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedTone, setDetectedTone] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  // Target voice & transformation
  const [targetVoice, setTargetVoice] = useState<VoiceOption>(GEMINI_VOICES[1]); // Puck
  const [transformStyle, setTransformStyle] = useState<string>('Energetic, clear, high-fidelity Bengali radio jockey with charismatic delivery');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformedAudioUrl, setTransformedAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Playback states
  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [isPlayingTransformed, setIsPlayingTransformed] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const transformedAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const voiceTransformationPresets = language === 'bn' ? [
    {
      label: '🎙️ রেডিও জকি / আরজে স্টাইল (Radio Jockey)',
      style: 'Ultra-vibrant, charismatic, engaging Bengali Radio Jockey / podcast host. Fast-paced and friendly.',
      voiceId: 'Puck',
    },
    {
      label: '📖 গভীর গল্প পাঠক (Late Night Storyteller)',
      style: 'Deep, atmospheric, mysterious Bengali horror and thriller storyteller with dramatic pauses.',
      voiceId: 'Charon',
    },
    {
      label: '🌸 মিষ্টি ও আবেগপূর্ণ নারী কণ্ঠ (Sweet Female Voice)',
      style: 'Warm, emotional, sweet and melodious Bengali female speaker with crystal clear clarity.',
      voiceId: 'Kore',
    },
    {
      label: '🎬 সিনেমাটিক মুভি ট্রেলার (Cinematic Trailer)',
      style: 'Deep, booming, epic cinematic movie trailer voice with intense gravitas in Bengali.',
      voiceId: 'Fenrir',
    },
    {
      label: '📰 পেশাদার সংবাদ উপস্থাপক (News Anchor)',
      style: 'Crisp, articulate, professional Bengali television news anchor delivery.',
      voiceId: 'Zephyr',
    },
  ] : [
    {
      label: '🎙️ Vibrant Radio Jockey / Host',
      style: 'Ultra-vibrant, charismatic, engaging Bengali Radio Jockey / podcast host. Fast-paced and friendly.',
      voiceId: 'Puck',
    },
    {
      label: '📖 Deep Atmospheric Storyteller',
      style: 'Deep, atmospheric, mysterious Bengali horror and thriller storyteller with dramatic pauses.',
      voiceId: 'Charon',
    },
    {
      label: '🌸 Sweet & Emotional Female Voice',
      style: 'Warm, emotional, sweet and melodious Bengali female speaker with crystal clear clarity.',
      voiceId: 'Kore',
    },
    {
      label: '🎬 Cinematic Trailer Voice',
      style: 'Deep, booming, epic cinematic movie trailer voice with intense gravitas in Bengali.',
      voiceId: 'Fenrir',
    },
    {
      label: '📰 Professional Television Anchor',
      style: 'Crisp, articulate, professional Bengali television news anchor delivery.',
      voiceId: 'Zephyr',
    },
  ];

  // Start recording from user's microphone
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(language === 'bn' ? 'মাইক্রোফোন পারমিশন এলাও করুন' : 'Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRecordedAudioBlob(file);
    setRecordedAudioUrl(url);
    setError(null);
  };

  // Transcribe recorded audio using gemini-3.5-transcribe
  const handleTranscribe = async () => {
    if (!recordedAudioBlob) {
      setError(language === 'bn' ? 'প্রথমে আপনার ভয়েস রেকর্ড করুন' : 'Please record your voice or upload audio first');
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(recordedAudioBlob);
      reader.onloadend = async () => {
        const resultStr = reader.result ? (reader.result as string) : '';
        const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
        const audioMime = recordedAudioBlob.type || 'audio/webm';

        const response = await fetch('/api/transcribe-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: audioMime,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || (language === 'bn' ? 'ট্রান্সক্রিপশন ব্যর্থ হয়েছে' : 'Transcription failed'));
        }

        setTranscript(data.transcript || '');
        setDetectedLanguage(data.detectedLanguage || (language === 'bn' ? 'বাংলা' : 'Bengali'));
        setDetectedTone(data.tone || 'Natural');
        setSummary(data.summary || '');
        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('Transcribe error:', err);
      setError(err.message || 'Error transcribing audio');
      setIsTranscribing(false);
    }
  };

  // Transform into new AI voice
  const handleTransformVoice = async () => {
    if (!transcript.trim()) {
      setError(language === 'bn' ? 'ট্রান্সক্রিপশনে কোনো লেখা পাওয়া যায়নি' : 'No transcript found. Please record or enter text first.');
      return;
    }

    setIsTransforming(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript.trim(),
          voiceName: targetVoice.id,
          speechStyle: transformStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'bn' ? 'ভয়েস রূপান্তর ব্যর্থ হয়েছে' : 'Voice transformation failed'));
      }

      const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      setTransformedAudioUrl(audioSrc);

      setTimeout(() => {
        if (transformedAudioRef.current) {
          transformedAudioRef.current.play().then(() => setIsPlayingTransformed(true)).catch(() => {});
        }
      }, 200);
    } catch (err: any) {
      console.error('Transform error:', err);
      setError(err.message || 'Error transforming voice');
    } finally {
      setIsTransforming(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8">
      {/* Hidden audio tags */}
      {recordedAudioUrl && (
        <audio
          ref={originalAudioRef}
          src={recordedAudioUrl}
          onEnded={() => setIsPlayingOriginal(false)}
        />
      )}
      {transformedAudioUrl && (
        <audio
          ref={transformedAudioRef}
          src={transformedAudioUrl}
          onEnded={() => setIsPlayingTransformed(false)}
        />
      )}

      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-teal-300 font-bold">
            <Mic className="h-5 w-5" />
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
        {/* Step 1 & 2: Recording and Transcription (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          {/* Recorder Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
                  1
                </span>
                {t.step1Title}
              </h3>
              {recordDuration > 0 && isRecording && (
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  {formatTimer(recordDuration)}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              {/* Record Button Animation */}
              <div className="relative">
                {isRecording && (
                  <div className="absolute -inset-4 rounded-full bg-rose-500/25 animate-ping" />
                )}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105 shadow-rose-500/30'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 hover:scale-105 shadow-emerald-500/30'
                  }`}
                >
                  {isRecording ? <Square className="h-8 w-8 fill-current" /> : <Mic className="h-9 w-9" />}
                </button>
              </div>

              <p className="mt-4 font-bold text-white text-base">
                {isRecording ? t.recordingActive : t.startRecording}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-medium max-w-xs">
                {t.recordingPrompt}
              </p>

              {/* Upload alternative */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {t.uploadAudio}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Playback of Recorded Audio */}
            {recordedAudioUrl && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-3.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!originalAudioRef.current) return;
                      if (isPlayingOriginal) {
                        originalAudioRef.current.pause();
                        setIsPlayingOriginal(false);
                      } else {
                        originalAudioRef.current.play();
                        setIsPlayingOriginal(true);
                      }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    {isPlayingOriginal ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white">{t.originalVoice}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {recordedAudioBlob ? `${(recordedAudioBlob.size / 1024).toFixed(1)} KB` : 'Recorded'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className="flex items-center gap-2 rounded-xl bg-teal-500/20 border border-teal-500/50 px-3.5 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/30 disabled:opacity-50"
                >
                  {isTranscribing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {t.transcribingBtn}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      {t.transcribeBtn}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Transcript Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">
                  2
                </span>
                {t.step2Title}
              </h3>
              {detectedTone && (
                <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-cyan-300 font-semibold">
                  {t.tone} {detectedTone}
                </span>
              )}
            </div>

            <div className="mt-3">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={t.transcriptPlaceholder}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder-slate-400 outline-none focus:border-teal-400 font-medium"
              />
            </div>

            {summary && (
              <div className="mt-2 text-xs text-slate-300 font-medium italic">
                {t.summary} {summary}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Select Target AI Persona and Transform (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                  3
                </span>
                {t.step3Title}
              </h3>
            </div>

            <p className="mt-2 text-xs text-slate-300 font-medium">
              {t.step3Desc}
            </p>

            {/* Presets */}
            <div className="mt-4 space-y-2.5">
              {voiceTransformationPresets.map((preset, idx) => {
                const isSelected = targetVoice.id === preset.voiceId && transformStyle === preset.style;
                const matchedVoice = GEMINI_VOICES.find((v) => v.id === preset.voiceId) || GEMINI_VOICES[0];
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setTargetVoice(matchedVoice);
                      setTransformStyle(preset.style);
                    }}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/40 ring-1 ring-purple-400/60 shadow-md'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{preset.label}</span>
                      <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-purple-300 font-mono font-bold">
                        {matchedVoice.name}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed font-medium">{preset.style}</p>
                  </div>
                );
              })}
            </div>

            {/* Transform Button */}
            <div className="mt-6">
              <button
                onClick={handleTransformVoice}
                disabled={isTransforming || !transcript.trim()}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/20 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTransforming ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {t.transformingBtn}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t.transformBtn}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transformed Result Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              {t.resultTitle}
            </h3>

            {transformedAudioUrl ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-purple-500/40 bg-purple-950/30 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!transformedAudioRef.current) return;
                        if (isPlayingTransformed) {
                          transformedAudioRef.current.pause();
                          setIsPlayingTransformed(false);
                        } else {
                          transformedAudioRef.current.play();
                          setIsPlayingTransformed(true);
                        }
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-slate-950 shadow-md hover:scale-105"
                    >
                      {isPlayingTransformed ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-sm font-bold text-white">{targetVoice.name} {t.transformedStudioVoice}</div>
                      <div className="text-xs text-slate-300 font-medium">{t.resultDesc}</div>
                    </div>
                  </div>

                  <a
                    href={transformedAudioUrl}
                    download={`transformed-bangla-voice-${Date.now()}.wav`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4" />
                    WAV
                  </a>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200">
                  <span className="font-bold text-purple-300">{t.spokenWords} </span>
                  "{transcript}"
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                {t.emptyPrompt}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-4 text-xs font-bold text-rose-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
