export type TabType = 'tts' | 'voice-clone' | 'script' | 'image' | 'pipeline' | 'qr-barcode';

export interface VoiceOption {
  id: string;
  name: string;
  banglaName: string;
  gender: 'female' | 'male';
  description: string;
  engDescription?: string;
  previewText: string;
  tag: string;
  engTag?: string;
  color: string;
}

export interface ScriptScene {
  sceneNumber: number;
  timeframe: string;
  visualDescription: string;
  imagePrompt: string;
  banglaVoiceover: string;
  speaker: string;
  emotion: string;
  generatedImageUrl?: string;
  generatedAudioUrl?: string;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

export interface GeneratedScript {
  title: string;
  englishTitle: string;
  logline: string;
  targetAudience: string;
  scenes: ScriptScene[];
  fullVoiceoverText: string;
  recommendedVoice: string;
  hashtags: string[];
}

export interface GeneratedAudioItem {
  id: string;
  text: string;
  audioUrl: string;
  voiceName: string;
  timestamp: string;
  duration?: number;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  style: string;
  timestamp: string;
  provider: string;
}
