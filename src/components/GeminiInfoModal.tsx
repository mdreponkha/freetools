import React from 'react';
import { X, CheckCircle2, Sparkles, Volume2, Mic, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface GeminiInfoModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiInfoModal: React.FC<GeminiInfoModalProps> = ({ language, isOpen, onClose }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language].modal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-400 font-bold mt-0.5">
              {t.answerTag}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1">
                  {t.answerHighlight}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {t.answerBody}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white pt-2">
            {t.modelsHeading}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* TTS */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Volume2 className="h-4 w-4" />
                <span>Text-to-Speech (TTS)</span>
              </div>
              <div className="font-mono text-xs text-slate-400 font-bold">gemini-3.8-flash-lite-tts</div>
              <p className="text-slate-200 text-xs font-medium leading-relaxed">
                {language === 'bn'
                  ? 'বাংলা উচ্চারণের সঠিক স্বরভঙ্গি, নাটকীয়তা ও আবেগসহ স্পষ্ট স্টুডিও-কোয়ালিটি ২৪kHz WAV অডিও তৈরি করে।'
                  : 'Synthesizes high-fidelity 24kHz WAV audio in Bengali with natural intonation, timing, and cadence.'}
              </p>
            </div>

            {/* Voice Transcribe */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Mic className="h-4 w-4" />
                <span>Voice Transcribe</span>
              </div>
              <div className="font-mono text-xs text-slate-400 font-bold">gemini-3.5-transcribe</div>
              <p className="text-slate-200 text-xs font-medium leading-relaxed">
                {language === 'bn'
                  ? 'আপনার মুখের অডিও শুনে তা নিখুঁতভাবে বাংলায় লিখে ফেলে এবং বিভিন্ন স্টাইলে রূপান্তর করে।'
                  : 'Accurately transcribes spoken Bengali & mixed speech word-for-word and identifies vocal mood.'}
              </p>
            </div>

            {/* Script Writer */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <FileText className="h-4 w-4" />
                <span>Script & Story</span>
              </div>
              <div className="font-mono text-xs text-slate-400 font-bold">gemini-3.8-flash</div>
              <p className="text-slate-200 text-xs font-medium leading-relaxed">
                {language === 'bn'
                  ? 'ইউটিউব শর্টস, রিলস বা ভৌতিক গল্পের সিন-বাই-সিন দৃশ্য ও ভয়েসওভার তৈরি করে।'
                  : 'Writes production-ready video scripts with scene breakdowns, image prompts, and dialogues.'}
              </p>
            </div>

            {/* Image Generator */}
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                <span>Visual Studio</span>
              </div>
              <div className="font-mono text-xs text-slate-400 font-bold">gemini-3.1-flash-lite-image</div>
              <p className="text-slate-200 text-xs font-medium leading-relaxed">
                {language === 'bn'
                  ? 'স্ক্রিপ্টের সাথে মিলিয়ে সিনেমাটিক, অ্যানিমে বা বাংলার লোকজ আর্ট স্টাইলের ছবি তৈরি করে।'
                  : 'Generates high-resolution cinematic artwork matching prompt aesthetics and aspect ratios.'}
              </p>
            </div>
          </div>

          {/* Key Security Note */}
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5 text-xs sm:text-sm">
                  {t.securityTitle}
                </span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {t.securityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md hover:opacity-95"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
