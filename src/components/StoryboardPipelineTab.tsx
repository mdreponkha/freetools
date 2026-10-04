import React, { useState, useEffect, useRef } from 'react';
import { Film, Play, Pause, SkipForward, SkipBack, Sparkles, Volume2, Image as ImageIcon, Wand2, ArrowRight, RefreshCw } from 'lucide-react';
import { GeneratedScript, ScriptScene } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface StoryboardPipelineTabProps {
  language: Language;
  initialScript?: GeneratedScript | null;
  onNavigateToScript: () => void;
}

export const StoryboardPipelineTab: React.FC<StoryboardPipelineTabProps> = ({
  language,
  initialScript,
  onNavigateToScript,
}) => {
  const t = TRANSLATIONS[language].storyboard;
  const [pipelineScript, setPipelineScript] = useState<GeneratedScript | null>(initialScript || null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoGeneratingAll, setIsAutoGeneratingAll] = useState<boolean>(false);

  // Per-scene assets
  const [sceneImages, setSceneImages] = useState<{ [sceneNumber: number]: string }>({});
  const [sceneAudios, setSceneAudios] = useState<{ [sceneNumber: number]: string }>({});

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialScript) {
      setPipelineScript(initialScript);
    }
  }, [initialScript]);

  const currentScene = pipelineScript?.scenes?.[currentSceneIndex] || null;

  const togglePlay = () => {
    if (!currentScene) return;

    const audioUrl = sceneAudios[currentScene.sceneNumber];
    if (audioUrl) {
      if (!currentAudioRef.current) {
        currentAudioRef.current = new Audio(audioUrl);
      } else {
        currentAudioRef.current.src = audioUrl;
      }

      if (isPlaying) {
        currentAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        currentAudioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);

        currentAudioRef.current.onended = () => {
          setIsPlaying(false);
          if (pipelineScript && currentSceneIndex < pipelineScript.scenes.length - 1) {
            setCurrentSceneIndex((prev) => prev + 1);
          }
        };
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const generateImageForScene = async (scene: ScriptScene) => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.imagePrompt,
          aspectRatio: '16:9',
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
      console.error(err);
    }
  };

  const generateAudioForScene = async (scene: ScriptScene) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scene.banglaVoiceover,
          voiceName: 'Puck',
          speechStyle: `${scene.emotion} Bengali storytelling narrator`,
        }),
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        setSceneAudios((prev) => ({
          ...prev,
          [scene.sceneNumber]: audioSrc,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoGenerateAllAssets = async () => {
    if (!pipelineScript) return;
    setIsAutoGeneratingAll(true);

    for (const scene of pipelineScript.scenes) {
      if (!sceneImages[scene.sceneNumber]) {
        await generateImageForScene(scene);
      }
      if (!sceneAudios[scene.sceneNumber]) {
        await generateAudioForScene(scene);
      }
    }

    setIsAutoGeneratingAll(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Film className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wider">{t.badge}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              {t.heading}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl">
              {t.desc}
            </p>
          </div>

          {pipelineScript && (
            <button
              onClick={handleAutoGenerateAllAssets}
              disabled={isAutoGeneratingAll}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-teal-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-purple-500/20 hover:opacity-95 disabled:opacity-50"
            >
              {isAutoGeneratingAll ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.generatingAllBtn}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  {t.generateAllBtn}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {pipelineScript ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Visual Storyboard Player (8 cols) */}
          <div className="space-y-4 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                {currentScene && sceneImages[currentScene.sceneNumber] ? (
                  <img
                    src={sceneImages[currentScene.sceneNumber]}
                    alt={`Scene ${currentScene.sceneNumber}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <ImageIcon className="h-12 w-12 text-slate-600 mb-2" />
                    <p className="text-sm font-bold text-slate-300">{t.noImageYet}</p>
                    {currentScene && (
                      <button
                        onClick={() => generateImageForScene(currentScene)}
                        className="mt-3 flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
                      >
                        <Wand2 className="h-4 w-4" />
                        {t.generateSceneImg}
                      </button>
                    )}
                  </div>
                )}

                {/* Subtitle / Bangla Voiceover Overlay */}
                {currentScene && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6 pt-12">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-lg bg-emerald-500/30 border border-emerald-500/60 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                        Scene {currentScene.sceneNumber} / {pipelineScript.scenes.length}
                      </span>
                      <span className="text-xs text-slate-200 font-mono font-semibold">{currentScene.timeframe}</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white drop-shadow-md leading-relaxed">
                      "{currentScene.banglaVoiceover}"
                    </p>
                  </div>
                )}
              </div>

              {/* Player Controls Bar */}
              <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentSceneIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSceneIndex === 0}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:text-white disabled:opacity-30"
                    title="Previous Scene"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-slate-950 shadow-lg hover:scale-105"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </button>

                  <button
                    onClick={() =>
                      setCurrentSceneIndex((prev) => Math.min(pipelineScript.scenes.length - 1, prev + 1))
                    }
                    disabled={currentSceneIndex === pipelineScript.scenes.length - 1}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:text-white disabled:opacity-30"
                    title="Next Scene"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  {currentScene && !sceneAudios[currentScene.sceneNumber] && (
                    <button
                      onClick={() => generateAudioForScene(currentScene)}
                      className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25"
                    >
                      <Volume2 className="h-4 w-4" />
                      {t.generateVoice}
                    </button>
                  )}

                  {currentScene && sceneAudios[currentScene.sceneNumber] && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {t.sceneVoiceReady}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scenes Queue / Thumbnails (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white mb-3">
                {t.scenesList} ({pipelineScript.scenes.length})
              </h3>

              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {pipelineScript.scenes.map((scene, idx) => {
                  const isCurrent = currentSceneIndex === idx;
                  const hasImage = Boolean(sceneImages[scene.sceneNumber]);
                  const hasAudio = Boolean(sceneAudios[scene.sceneNumber]);

                  return (
                    <div
                      key={scene.sceneNumber}
                      onClick={() => setCurrentSceneIndex(idx)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                        isCurrent
                          ? 'border-purple-400 bg-purple-950/40 ring-1 ring-purple-400/60 shadow-md'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white">Scene {scene.sceneNumber}</span>
                        <span className="text-slate-400 font-mono font-medium">{scene.timeframe}</span>
                      </div>

                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                        {scene.banglaVoiceover}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center gap-1 font-semibold ${
                              hasImage ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            {hasImage ? t.hasImage : 'No Img'}
                          </span>
                          <span
                            className={`flex items-center gap-1 font-semibold ${
                              hasAudio ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            {hasAudio ? t.hasVoice : 'No Voice'}
                          </span>
                        </div>
                        {isCurrent && <span className="text-purple-300 font-bold">Active</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-16 text-center">
          <Film className="h-16 w-16 text-slate-500 mb-4" />
          <h3 className="text-lg font-bold text-white">{t.noScriptTitle}</h3>
          <p className="mt-1 text-sm text-slate-300 font-medium max-w-md">
            {t.noScriptDesc}
          </p>
          <button
            onClick={onNavigateToScript}
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-purple-500/20 hover:opacity-95"
          >
            <span>{t.goToScriptBtn}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
