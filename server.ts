import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_ADS_CONFIG } from './src/data/defaultAds';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Ads Configuration File Path
const ADS_CONFIG_PATH = path.join(__dirname, 'ads-config.json');

// Initialize ads-config.json if not present
function getAdsConfig() {
  try {
    if (fs.existsSync(ADS_CONFIG_PATH)) {
      const data = fs.readFileSync(ADS_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading ads-config.json:', err);
  }
  return DEFAULT_ADS_CONFIG;
}

function saveAdsConfig(config: any) {
  try {
    fs.writeFileSync(ADS_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving ads-config.json:', err);
    return false;
  }
}

// Ensure file exists on startup
if (!fs.existsSync(ADS_CONFIG_PATH)) {
  saveAdsConfig(DEFAULT_ADS_CONFIG);
}

// Admin Authentication endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'Repon@1997@') {
    return res.json({
      success: true,
      token: 'freeall-auth-admin-session',
      companyName: 'freeall',
      user: {
        username: 'admin',
        role: 'superadmin',
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'ভুল ইউজারনেম বা পাসওয়ার্ড (Invalid admin credentials)',
  });
});

// Public GET ads configuration
app.get('/api/ads', (req: Request, res: Response) => {
  const config = getAdsConfig();
  res.json({
    success: true,
    config,
  });
});

// Admin POST update ads configuration
app.post('/api/admin/ads', (req: Request, res: Response) => {
  const { config } = req.body;
  if (!config) {
    return res.status(400).json({ error: 'Config data is required' });
  }

  const saved = saveAdsConfig(config);
  if (!saved) {
    return res.status(500).json({ error: 'Failed to write ads config to disk' });
  }

  return res.json({
    success: true,
    message: 'Ads configuration saved successfully',
    config,
  });
});

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Check backend and Gemini API status
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    ok: true,
    hasKey,
    models: {
      tts: 'gemini-3.8-flash-lite-tts',
      voiceDesign: 'gemini-3.8-flash-tts',
      transcription: 'gemini-3.5-transcribe',
      script: 'gemini-3.8-flash',
      image: 'gemini-3.1-flash-lite-image',
    },
  });
});

// 1. Text to Bangla Voice Generation (TTS)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore', speechStyle, pitch, speed } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const cleanText = text.trim();
    const ai = getGeminiClient();

    // Bengali context style guidance
    const stylePrompt = speechStyle
      ? `${speechStyle}. Speak natural Bengali with clear pronunciation and expressive emotional cadence.`
      : 'Natural, smooth, and friendly native Bengali voice actor. Crystal clear articulation and appropriate pacing.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Standard prebuilt voices: Kore, Puck, Charon, Fenrir, Zephyr, Aoede
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p) => p.inlineData && p.inlineData.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error('Gemini TTS did not return audio data.');
    }

    const base64Audio = audioPart.inlineData.data;
    const mimeType = audioPart.inlineData.mimeType || 'audio/wav';

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
      voiceName,
      textLength: cleanText.length,
      modelUsed: 'gemini-3.8-flash-lite-tts',
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate voice audio',
    });
  }
});

// 2. Transcribe User's Own Voice (Audio to Text & Voice Analysis)
app.post('/api/transcribe-voice', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    const ai = getGeminiClient();

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this user speech. The audio might be in Bengali (Bangla), English, or mixed. Accurately transcribe word-for-word into proper Bengali script if spoken in Bangla. Also determine detected language, speaking tone, and key emotions.',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: {
              type: Type.STRING,
              description: 'The verbatim transcription in Bangla or English script',
            },
            detectedLanguage: {
              type: Type.STRING,
              description: 'e.g. Bengali (বাংলা), English, or Mixed Banglish',
            },
            tone: {
              type: Type.STRING,
              description: 'The vocal tone: e.g. Energetic, Storytelling, Calm, Dramatic, Casual',
            },
            summary: {
              type: Type.STRING,
              description: 'Brief one-line summary of what was spoken',
            },
            suggestedVoices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Recommended voice personas to transform this speech into',
            },
          },
          required: ['transcript', 'detectedLanguage', 'tone'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    return res.status(500).json({
      error: error.message || 'Failed to transcribe audio',
    });
  }
});

// 3. AI Script Generator (Shorts, Story, Ads, Dialogues with scene breakdown)
app.post('/api/generate-script', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      scriptType = 'story', // 'story' | 'shorts' | 'ad' | 'drama' | 'educational'
      tone = 'dramatic', // 'emotional' | 'inspirational' | 'funny' | 'scary' | 'rj' | 'informative'
      duration = '60s',
      language = 'bn', // 'bn' | 'bn-en'
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic or idea is required' });
    }

    const ai = getGeminiClient();

    const prompt = `You are a master Bengali scriptwriter and video creator.
Topic: "${topic.trim()}"
Format: ${scriptType}
Tone: ${tone}
Target Length: ${duration}
Language: ${language === 'bn-en' ? 'Bengali with modern natural English terms' : 'Pure expressive Bengali (বাংলা)'}

Write a complete, highly engaging video/audio production script with scene-by-scene visual descriptions, AI image prompts, and Bengali voiceover narrations.

Return the result as structured JSON:
{
  "title": "Catchy Bengali title",
  "englishTitle": "English translation of title",
  "logline": "1-2 sentence compelling summary in Bengali",
  "targetAudience": "e.g. Facebook Reels, YouTube Shorts, Story listeners",
  "scenes": [
    {
      "sceneNumber": 1,
      "timeframe": "0:00 - 0:10",
      "visualDescription": "What happens visually on screen in detail",
      "imagePrompt": "Detailed English image generation prompt for this scene with aesthetic style and lighting (ready for text-to-image AI)",
      "banglaVoiceover": "Exact Bengali dialogue or narration words to be spoken by TTS",
      "speaker": "Narrator or Character Name",
      "emotion": "e.g. Mystery, Excitement, Calm, Wonder"
    }
  ],
  "fullVoiceoverText": "All scene voiceovers concatenated into one clean Bengali paragraph ready for voice generation",
  "recommendedVoice": "Kore (Female) or Puck (Young male) or Charon (Deep male) or Fenrir (Cinematic)",
  "hashtags": ["#বাংলা_গল্প", "#BanglaAI", "..."]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      script: parsed,
    });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate script',
    });
  }
});

// Global state to track if Gemini paid image model is available on this API key
let geminiImageQuotaExceeded = false;

// 4. Text to Image Generation (Powered by Gemini + Fallback engine)
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1', style = 'cinematic' } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Image prompt is required' });
    }

    const ai = getGeminiClient();

    // 1. If the prompt contains Bengali characters, translate and enrich it with Gemini 3.8 Flash
    let englishVisualPrompt = prompt.trim();
    if (/[\u0980-\u09FF]/.test(prompt)) {
      try {
        const transResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate and expand this Bengali image idea into a vivid, descriptive, high-quality visual prompt for AI image generation: "${prompt.trim()}". Return ONLY the expanded English visual prompt sentence, without quotes or explanations.`,
        });
        if (transResponse.text && transResponse.text.trim()) {
          englishVisualPrompt = transResponse.text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        // Translation fallback silently
      }
    }

    // 2. Add style modifiers
    let styleModifier = '';
    switch (style) {
      case 'cinematic':
        styleModifier = 'cinematic lighting, photorealistic 8k, dramatic atmosphere, depth of field, octane render';
        break;
      case 'anime':
        styleModifier = 'Makoto Shinkai studio ghibli anime aesthetic, vibrant sky, detailed illustration, masterpiece';
        break;
      case 'digital-art':
        styleModifier = 'digital concept art, trending on artstation, sharp details, vivid glowing palette';
        break;
      case 'bengali-cultural':
        styleModifier = 'authentic Bengal cultural scenery, rich traditional details, golden hour warmth, ultra detailed';
        break;
      case 'fantasy':
        styleModifier = 'epic mythical fantasy environment, ethereal lighting, magical glow, hyperdetailed';
        break;
      default:
        styleModifier = 'high quality, beautiful lighting, award winning composition';
    }

    const enhancedPrompt = `${englishVisualPrompt}, ${styleModifier}`;

    let imageUrl: string | null = null;
    let provider = 'gemini';

    // 3. Try Gemini Image Model only if not previously marked as quota limit 0 (free tier)
    if (!geminiImageQuotaExceeded) {
      try {
        const geminiImageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: (['1:1', '16:9', '9:16', '4:3', '3:4'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
            },
          },
        });

        const parts = geminiImageResponse.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData && p.inlineData.data);

        if (imagePart && imagePart.inlineData?.data) {
          imageUrl = `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
        }
      } catch (geminiErr: any) {
        // Handle 429 / limit 0 gracefully without alarming warnings
        const isQuotaLimitZero =
          geminiErr?.status === 'RESOURCE_EXHAUSTED' ||
          geminiErr?.message?.includes('limit: 0') ||
          geminiErr?.error?.code === 429;

        if (isQuotaLimitZero) {
          geminiImageQuotaExceeded = true;
        }
      }
    }

    // 4. Ultra-reliable Flux image generation fallback
    if (!imageUrl) {
      provider = 'flux-studio';
      const width = aspectRatio === '16:9' ? 1024 : aspectRatio === '9:16' ? 576 : aspectRatio === '4:3' ? 800 : 768;
      const height = aspectRatio === '16:9' ? 576 : aspectRatio === '9:16' ? 1024 : aspectRatio === '4:3' ? 600 : 768;
      const seed = Math.floor(Math.random() * 899999) + 100000;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

      try {
        const fetchRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(6000) });
        if (fetchRes.ok) {
          const arrayBuffer = await fetchRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString('base64');
          const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
          imageUrl = `data:${contentType};base64,${base64}`;
        } else {
          imageUrl = fallbackUrl;
        }
      } catch {
        imageUrl = fallbackUrl;
      }
    }

    return res.json({
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt.trim(),
      aspectRatio,
      provider,
    });
  } catch (error: any) {
    console.error('Error in image generation route:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image',
    });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BanglaVoice & Studio AI server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
