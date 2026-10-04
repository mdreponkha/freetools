export type Language = 'bn' | 'en';

export interface Translations {
  appName: string;
  appTagline: string;
  menuHeadingVoice: string;
  menuHeadingContent: string;
  menuHeadingProduction: string;
  menuHeadingUtilities: string;
  
  // Navigation tabs
  tabs: {
    tts: { title: string; subtitle: string; badge: string };
    voiceClone: { title: string; subtitle: string; badge: string };
    script: { title: string; subtitle: string; badge: string };
    image: { title: string; subtitle: string; badge: string };
    pipeline: { title: string; subtitle: string; badge: string };
    qrBarcode: { title: string; subtitle: string; badge: string };
  };

  // Top header
  toolsMenu: string;
  geminiGuideBtn: string;
  engineActive: string;
  engineDesc: string;

  // Text to Voice
  tts: {
    badge: string;
    heading: string;
    desc: string;
    sampleLabel: string;
    inputLabel: string;
    inputPlaceholder: string;
    characters: string;
    words: string;
    copy: string;
    copied: string;
    clear: string;
    presets: string;
    selectVoice: string;
    selectVoiceDesc: string;
    selectedBadge: string;
    female: string;
    male: string;
    speechStyle: string;
    speechStyleDesc: string;
    customStylePlaceholder: string;
    generateBtn: string;
    generatingBtn: string;
    playerTitle: string;
    playerSubtitle: string;
    downloadWav: string;
    addToStoryboard: string;
    noAudioTitle: string;
    noAudioDesc: string;
    historyTitle: string;
  };

  // Voice Recorder & Transformer
  voiceClone: {
    badge: string;
    heading: string;
    desc: string;
    step1Title: string;
    step1Desc: string;
    startRecording: string;
    recordingActive: string;
    recordingPrompt: string;
    uploadAudio: string;
    originalVoice: string;
    transcribeBtn: string;
    transcribingBtn: string;
    step2Title: string;
    tone: string;
    transcriptPlaceholder: string;
    summary: string;
    step3Title: string;
    step3Desc: string;
    transformBtn: string;
    transformingBtn: string;
    resultTitle: string;
    transformedStudioVoice: string;
    resultDesc: string;
    spokenWords: string;
    emptyPrompt: string;
  };

  // Script Writer
  script: {
    badge: string;
    heading: string;
    desc: string;
    topicLabel: string;
    topicPlaceholder: string;
    popularTopics: string;
    formatLabel: string;
    moodLabel: string;
    durationLabel: string;
    languageStyleLabel: string;
    pureBangla: string;
    modernBanglish: string;
    generateBtn: string;
    generatingBtn: string;
    copyScript: string;
    copied: string;
    sendToStoryboard: string;
    logline: string;
    fullAudioTitle: string;
    fullAudioDesc: string;
    generateFullAudio: string;
    scenesTitle: string;
    visualDesc: string;
    voiceoverText: string;
    genSceneVoice: string;
    genSceneImage: string;
    generatingVoice: string;
    generatingImage: string;
    noScriptTitle: string;
    noScriptDesc: string;
  };

  // Image Studio
  image: {
    badge: string;
    heading: string;
    desc: string;
    promptLabel: string;
    promptPlaceholder: string;
    samplePrompts: string;
    aspectRatioLabel: string;
    styleLabel: string;
    generateBtn: string;
    generatingBtn: string;
    resultTitle: string;
    download: string;
    fullscreen: string;
    promptUsed: string;
    noImageTitle: string;
    noImageDesc: string;
    galleryTitle: string;
  };

  // Storyboard
  storyboard: {
    badge: string;
    heading: string;
    desc: string;
    generateAllBtn: string;
    generatingAllBtn: string;
    noImageYet: string;
    generateSceneImg: string;
    sceneVoiceReady: string;
    generateVoice: string;
    scenesList: string;
    hasImage: string;
    hasVoice: string;
    noScriptTitle: string;
    noScriptDesc: string;
    goToScriptBtn: string;
  };

  // Gemini Modal
  modal: {
    title: string;
    answerTag: string;
    answerHighlight: string;
    answerBody: string;
    modelsHeading: string;
    securityTitle: string;
    securityDesc: string;
    closeBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  bn: {
    appName: 'freeall',
    appTagline: 'freeall অল-ইন-ওয়ান স্টুডিও ও এআই',
    menuHeadingVoice: 'ভয়েস ও অডিও স্টুডিও',
    menuHeadingContent: 'কনটেন্ট ও ভিজ্যুয়াল এআই',
    menuHeadingProduction: 'প্রোডাকশন ও পাইপলাইন',
    menuHeadingUtilities: 'কিউআর ও বারকোড টুলস',

    tabs: {
      tts: { title: 'টেক্সট টু ভয়েস', subtitle: 'বাংলা স্পিচ সিন্থেসিস', badge: 'TTS' },
      voiceClone: { title: 'ভয়েস ট্রান্সফরমার', subtitle: 'রেকর্ড ও কণ্ঠ রূপান্তর', badge: 'Clone' },
      script: { title: 'এআই স্ক্রিপ্ট রাইটার', subtitle: 'গল্প ও শর্টস মেকার', badge: 'Gemini 3.8' },
      image: { title: 'টেক্সট টু ইমেজ', subtitle: 'সিনেমাটিক আর্ট স্টুডিও', badge: 'Visual AI' },
      pipeline: { title: 'ভিডিও স্টোরিবোর্ড', subtitle: 'অল-ইন-ওয়ান প্লেয়ার', badge: 'Studio' },
      qrBarcode: { title: 'কিউআর ও বারকোড', subtitle: 'JPG, PNG, SVG জেনারেটর', badge: 'QR & Barcode' },
    },

    toolsMenu: 'টুলস মেনু',
    geminiGuideBtn: 'জেমিনি কী গাইড',
    engineActive: 'Gemini 3.8 ইঞ্জিন সক্রিয়',
    engineDesc: 'বাংলা ভয়েস, স্ক্রিপ্ট ও ইমেজ ইঞ্জিন সচল আছে',

    tts: {
      badge: 'গুগল জেমিনি টিটিএস মডেল',
      heading: 'বাংলা টেক্সট টু স্পিচ ভয়েস জেনারেটর',
      desc: 'যেকোনো বাংলা লেখা লিখুন — জেমিনি এআই মডেল প্রাকৃতিক ও সুন্দর কণ্ঠে তা রূপান্তর করবে।',
      sampleLabel: 'নমুনা লেখা:',
      inputLabel: 'আপনার বাংলা টেক্সট লিখুন',
      inputPlaceholder: 'এখানে আপনার বাংলা গল্প, সংবাদ, ইউটিউব স্ক্রিপ্ট বা বার্তা লিখুন...',
      characters: 'অক্ষর',
      words: 'শব্দ',
      copy: 'কপি',
      copied: 'কপি হয়েছে',
      clear: 'মুছুন',
      presets: 'প্রিসেট:',
      selectVoice: 'ভয়েস পছন্দ করুন (Gemini Voice)',
      selectVoiceDesc: 'প্রতিটি কণ্ঠের নিজস্ব ব্যক্তিত্ব ও উচ্চারণ ধারা রয়েছে',
      selectedBadge: 'সিলেক্টেড',
      female: 'নারী কণ্ঠ',
      male: 'পুরুষ কণ্ঠ',
      speechStyle: 'ভয়েস স্টাইল ও আবেগ (Speech Emotion & Style)',
      speechStyleDesc: 'জেমিনি মডেল এই নির্দেশনা অনুযায়ী গলার স্বর, গতি ও আবেগ নিয়ন্ত্রণ করবে',
      customStylePlaceholder: 'যেমন: গভীর আবেগপূর্ণ নাটকীয় ভয়েস বা ফাস্ট পেসড আরজে স্টাইল...',
      generateBtn: 'বাংলা ভয়েস তৈরি করুন (Generate Voice)',
      generatingBtn: 'বাংলা ভয়েস তৈরি হচ্ছে (Generating Gemini Speech)...',
      playerTitle: 'অডিও আউটপুট প্লেয়ার',
      playerSubtitle: '২৪kHz স্টুডিও গ্রেড WAV অডিও',
      downloadWav: 'WAV ডাউনলোড',
      addToStoryboard: 'স্টোরিবোর্ডে যোগ করুন',
      noAudioTitle: 'এখনো কোনো অডিও তৈরি করা হয়নি',
      noAudioDesc: 'বাম পাশে আপনার বাংলা টেক্সট লিখে "বাংলা ভয়েস তৈরি করুন" বাটনে ক্লিক করুন।',
      historyTitle: 'সম্প্রতি তৈরি অডিও',
    },

    voiceClone: {
      badge: 'ভয়েস ক্লোন ও ট্রান্সফরমার',
      heading: 'নিজের কণ্ঠ রেকর্ড করুন ও এআই কণ্ঠে রূপান্তর করুন',
      desc: 'আপনার মাইক্রোফোনে কথা বলুন — জেমিনি আপনার কণ্ঠ বুঝবে এবং যেকোনো পেশাদার কণ্ঠে পুনর্নির্মাণ করবে।',
      step1Title: '১. ভয়েস রেকর্ড বা আপলোড করুন',
      step1Desc: 'মাইক্রোফোনে কথা বলুন অথবা অডিও ফাইল যুক্ত করুন',
      startRecording: 'রেকর্ড করতে ক্লিক করুন',
      recordingActive: 'রেকর্ডিং চলছে... কথা বলুন',
      recordingPrompt: 'বাংলায় যেকোনো একটি বাক্য বা গল্প বলুন',
      uploadAudio: 'অডিও ফাইল আপলোড',
      originalVoice: 'আপনার মূল ভয়েস (Original Voice)',
      transcribeBtn: 'জেমিনি দিয়ে টেক্সট করুন',
      transcribingBtn: 'ট্রান্সক্রাইব হচ্ছে...',
      step2Title: '২. স্পোকেন টেক্সট ট্রান্সক্রিপ্ট (Gemini 3.5 Transcribe)',
      tone: 'টোন:',
      transcriptPlaceholder: 'আপনার রেকর্ডিং ট্রান্সক্রাইব করলে এখানে সরাসরি টেক্সট চলে আসবে...',
      summary: 'সারসংক্ষেপ:',
      step3Title: '৩. টার্গেট এআই পারসোনা সিলেক্ট করুন',
      step3Desc: 'আপনার কথাটি কোন পেশাদার কণ্ঠে শুনতে চান নির্বাচন করুন:',
      transformBtn: 'আমার ভয়েস রূপান্তর করুন (Transform to AI Voice)',
      transformingBtn: 'ভয়েস রূপান্তর হচ্ছে...',
      resultTitle: 'রূপান্তরিত নতুন ভয়েস রেজাল্ট (Transformed AI Voice)',
      transformedStudioVoice: 'স্টুডিও কোয়ালিটি কণ্ঠ',
      resultDesc: 'জেমিনি মডেল দ্বারা নতুনভাবে তৈরিকৃত অডিও',
      spokenWords: 'উচ্চারিত বাক্য:',
      emptyPrompt: 'প্রথমে ভয়েস রেকর্ড করুন এবং রূপান্তর বাটনে চাপ দিন।',
    },

    script: {
      badge: 'জেমিনি ৩.৮ ফ্ল্যাশ স্ক্রিপ্ট স্টুডিও',
      heading: 'বাংলা এআই স্ক্রিপ্ট ও দৃশ্যপট জেনারেটর',
      desc: 'ইউটিউব শর্টস, রিলস, গল্প ও বিজ্ঞাপনের জন্য সিন-বাই-সিন দৃশ্য, ছবি ও ভয়েসওভার তৈরি করুন।',
      topicLabel: 'স্ক্রিপ্টের বিষয়বস্তু বা আইডিয়া (Topic)',
      topicPlaceholder: 'যেমন: রহস্যময় পাহাড়ের চূড়ায় একটি রাত, বা ৩টি দারুণ টেক ট্রিকস...',
      popularTopics: 'পপুলার টপিক আইডিয়া:',
      formatLabel: 'ফরম্যাট (Format)',
      moodLabel: 'টোন (Mood)',
      durationLabel: 'দৈর্ঘ্য (Duration)',
      languageStyleLabel: 'ভাষার ধরন',
      pureBangla: 'খাঁটি বাংলা',
      modernBanglish: 'আধুনিক কথ্য (Bangla + English)',
      generateBtn: 'বাংলা স্ক্রিপ্ট তৈরি করুন (Generate Script)',
      generatingBtn: 'স্ক্রিপ্ট লেখা হচ্ছে (Generating with Gemini 3.8)...',
      copyScript: 'স্ক্রিপ্ট কপি',
      copied: 'কপি হয়েছে',
      sendToStoryboard: 'স্টোরিবোর্ডে পাঠান',
      logline: 'লগলাইন / হুক:',
      fullAudioTitle: 'সম্পূর্ণ স্ক্রিপ্টের ভয়েসওভার',
      fullAudioDesc: 'সবগুলো সিনের ভয়েস একসাথে শুনুন',
      generateFullAudio: 'সম্পূর্ণ ভয়েস তৈরি করুন',
      scenesTitle: 'দৃশ্যপট ও সিন ব্রেকডাউন',
      visualDesc: 'ভিজ্যুয়াল দৃশ্য (Visual):',
      voiceoverText: '🎙️ বাংলা ভয়েসওভার কথা (Voiceover):',
      genSceneVoice: 'সিন ভয়েস তৈরি করুন',
      genSceneImage: 'সিন ইমেজ জেনারেট করুন',
      generatingVoice: 'ভয়েস হচ্ছে...',
      generatingImage: 'ছবি আঁকা হচ্ছে...',
      noScriptTitle: 'কোনো স্ক্রিপ্ট নেই',
      noScriptDesc: 'বাম পাশের ফর্মে আপনার পছন্দের বিষয় লিখে "বাংলা স্ক্রিপ্ট তৈরি করুন" বাটনে ক্লিক করুন।',
    },

    image: {
      badge: 'টেক্সট টু ইমেজ স্টুডিও',
      heading: 'এআই দিয়ে যেকোনো দৃশ্য বা ছবি তৈরি করুন',
      desc: 'বাংলা বা ইংরেজিতে আপনার দৃশ্য কল্পনা করুন — এআই মুহূর্তেই ফুটিয়ে তুলবে আপনার ছবি।',
      promptLabel: 'ছবির প্রম্পট / বর্ণনা (Image Prompt)',
      promptPlaceholder: 'আপনি কী ধরনের ছবি চান বিস্তারিত লিখুন (বাংলা বা ইংরেজি)...',
      samplePrompts: 'নমুনা প্রম্পট আইডিয়া:',
      aspectRatioLabel: 'আকার / অ্যাসপেক্ট রেশিও (Aspect Ratio)',
      styleLabel: 'আর্ট স্টাইল (Visual Style)',
      generateBtn: 'ছবি তৈরি করুন (Generate Image)',
      generatingBtn: 'ছবি তৈরি হচ্ছে (Generating Image)...',
      resultTitle: 'তৈরিকৃত ছবি (Generated Artwork)',
      download: 'ডাউনলোড',
      fullscreen: 'ফুলস্ক্রিন দেখুন',
      promptUsed: 'প্রম্পট:',
      noImageTitle: 'কোনো ছবি তৈরি করা হয়নি',
      noImageDesc: 'বাম পাশে আপনার কাঙ্ক্ষিত ছবির বর্ণনা লিখে "ছবি তৈরি করুন" বাটনে ক্লিক করুন।',
      galleryTitle: 'পূর্বে তৈরি ছবি গ্যালারি',
    },

    storyboard: {
      badge: 'ফুল স্টুডিও পাইপলাইন',
      heading: 'ভিডিও স্টোরিবোর্ড ও সিন প্লেয়ার',
      desc: 'স্ক্রিপ্ট, এআই ইমেজ ও বাংলা ভয়েস একত্রিত করে তৈরি করুন ফুল ভিডিও প্রেজেন্টেশন।',
      generateAllBtn: 'এক ক্লিকে সব ছবি ও ভয়েস তৈরি করুন',
      generatingAllBtn: 'সব সিন তৈরি হচ্ছে...',
      noImageYet: 'এই সিনের ছবি এখনও জেনারেট করা হয়নি',
      generateSceneImg: 'এই সিনের ছবি তৈরি করুন',
      sceneVoiceReady: 'ভয়েস প্রস্তুত',
      generateVoice: 'ভয়েস তৈরি',
      scenesList: 'দৃশ্য তালিকা',
      hasImage: 'ইমেজ আছে',
      hasVoice: 'ভয়েস আছে',
      noScriptTitle: 'এখনও কোনো স্ক্রিপ্ট লোড করা হয়নি',
      noScriptDesc: 'প্রথমে "এআই স্ক্রিপ্ট রাইটার" ট্যাবে গিয়ে আপনার পছন্দের বিষয়ের উপর স্ক্রিপ্ট তৈরি করুন।',
      goToScriptBtn: 'স্ক্রিপ্ট তৈরি করতে যান',
    },

    modal: {
      title: 'জেমিনি কী (Gemini API Key) দিয়ে কি সম্ভব?',
      answerTag: 'উত্তর: হ্যাঁ, ১০০% সম্ভব এবং এই স্টুডিওর সবকিছুই জেমিনি মডেল দ্বারা পরিচালিত!',
      answerHighlight: 'গুগল জেমিনি (Google Gemini) এর আধুনিক মাল্টিমোডাল ক্ষমতা:',
      answerBody: 'গুগল জেমিনি শুধু টেক্সট নয়, বরং ভয়েস সিন্থেসিস (TTS), স্পিচ ট্রান্সক্রিপশন এবং ইমেজ তৈরিতে বিশ্বমানের সক্ষমতা রাখে।',
      modelsHeading: 'এই অ্যাপে জেমিনির কোন কোন মডেল ব্যবহার করা হচ্ছে:',
      securityTitle: 'নিরাপদ ব্যাকএন্ড ইন্টিগ্রেশন (Secure API Handling)',
      securityDesc: 'আপনার Gemini API Key টি স্বয়ংক্রিয়ভাবে ক্লাউড সার্ভারের নিরাপদ এনভায়রনমেন্ট (process.env.GEMINI_API_KEY) থেকে লোড হয়। ব্রাউজারে কখনো কী লিক হওয়ার ঝুঁকি নেই।',
      closeBtn: 'বুঝেছি, স্টুডিও ব্যবহার করুন',
    },
  },

  en: {
    appName: 'freeall',
    appTagline: 'freeall All-in-One Studio & AI',
    menuHeadingVoice: 'Voice & Audio Studio',
    menuHeadingContent: 'Content & Visual AI',
    menuHeadingProduction: 'Production & Pipeline',
    menuHeadingUtilities: 'QR & Barcode Utilities',

    tabs: {
      tts: { title: 'Text to Voice', subtitle: 'Bangla Speech Synthesis', badge: 'TTS' },
      voiceClone: { title: 'Voice Transformer', subtitle: 'Record & Tone Morph', badge: 'Clone' },
      script: { title: 'AI Script Writer', subtitle: 'Story & Shorts Creator', badge: 'Gemini 3.8' },
      image: { title: 'Text to Image', subtitle: 'Cinematic Visual Studio', badge: 'Visual AI' },
      pipeline: { title: 'Video Storyboard', subtitle: 'All-in-One Player', badge: 'Studio' },
      qrBarcode: { title: 'QR & Barcode Studio', subtitle: 'JPG, PNG, SVG Exports', badge: 'QR & Barcode' },
    },

    toolsMenu: 'Tools Menu',
    geminiGuideBtn: 'Gemini Key Guide',
    engineActive: 'Gemini 3.8 Engine Active',
    engineDesc: 'Bangla speech, script, and image engines online',

    tts: {
      badge: 'Google Gemini TTS Model',
      heading: 'Bangla Text-to-Speech Voice Generator',
      desc: 'Enter any Bengali text — Gemini AI models transform it into natural, high-fidelity studio voice.',
      sampleLabel: 'Sample Texts:',
      inputLabel: 'Enter Bangla Text',
      inputPlaceholder: 'Write your story, news, video script, or message in Bengali here...',
      characters: 'characters',
      words: 'words',
      copy: 'Copy',
      copied: 'Copied!',
      clear: 'Clear',
      presets: 'Presets:',
      selectVoice: 'Select Gemini Voice Persona',
      selectVoiceDesc: 'Each voice offers distinct emotional timbre and articulation',
      selectedBadge: 'Selected',
      female: 'Female Voice',
      male: 'Male Voice',
      speechStyle: 'Speech Style & Emotion',
      speechStyleDesc: 'Gemini controls vocal pitch, pacing, and emotional expression based on this guide',
      customStylePlaceholder: 'e.g. Deep emotional storytelling narrator or energetic fast-paced radio jockey...',
      generateBtn: 'Generate Bangla Voice',
      generatingBtn: 'Synthesizing Audio with Gemini...',
      playerTitle: 'Audio Output Player',
      playerSubtitle: '24kHz Studio Grade WAV Audio',
      downloadWav: 'Download WAV',
      addToStoryboard: 'Send to Storyboard',
      noAudioTitle: 'No audio generated yet',
      noAudioDesc: 'Type your Bangla text on the left and click "Generate Bangla Voice".',
      historyTitle: 'Recent Audio Generations',
    },

    voiceClone: {
      badge: 'Voice Clone & Transformer',
      heading: 'Record Your Voice & Transform to AI Studio Voice',
      desc: 'Speak into your microphone — Gemini will accurately transcribe your speech and transform it into your selected persona.',
      step1Title: '1. Record or Upload Your Voice',
      step1Desc: 'Speak into microphone or upload an audio file',
      startRecording: 'Click to Record',
      recordingActive: 'Recording in progress... speak now',
      recordingPrompt: 'Speak any sentence or story in Bengali or English',
      uploadAudio: 'Upload Audio File',
      originalVoice: 'Your Original Voice',
      transcribeBtn: 'Transcribe with Gemini 3.5',
      transcribingBtn: 'Transcribing speech...',
      step2Title: '2. Spoken Transcript (Gemini 3.5 Transcribe)',
      tone: 'Tone:',
      transcriptPlaceholder: 'Transcribed words will appear here automatically...',
      summary: 'Summary:',
      step3Title: '3. Select Target Voice Persona',
      step3Desc: 'Choose how you want your spoken words to be re-voiced:',
      transformBtn: 'Transform to AI Studio Voice',
      transformingBtn: 'Transforming voice...',
      resultTitle: 'Transformed Studio Voice Result',
      transformedStudioVoice: 'Studio Voice Persona',
      resultDesc: 'Synthesized voice generated from your spoken transcript',
      spokenWords: 'Spoken Script:',
      emptyPrompt: 'Record your voice first and click transform.',
    },

    script: {
      badge: 'Gemini 3.8 Flash Script Studio',
      heading: 'Bangla AI Script & Scene Generator',
      desc: 'Generate scene-by-scene video scripts with visual prompts, narration, and 1-click voice and image generation.',
      topicLabel: 'Script Topic or Premise',
      topicPlaceholder: 'e.g. A thrilling night in the Sundarbans, or 3 psychological hacks to win friends...',
      popularTopics: 'Popular Topic Ideas:',
      formatLabel: 'Format',
      moodLabel: 'Mood & Tone',
      durationLabel: 'Duration',
      languageStyleLabel: 'Language Style',
      pureBangla: 'Pure Bengali',
      modernBanglish: 'Modern Conversational (Bangla + English)',
      generateBtn: 'Generate Script with Gemini 3.8',
      generatingBtn: 'Writing Script with Gemini 3.8...',
      copyScript: 'Copy Script',
      copied: 'Copied!',
      sendToStoryboard: 'Send to Storyboard',
      logline: 'Logline / Hook:',
      fullAudioTitle: 'Full Script Voiceover',
      fullAudioDesc: 'Generate continuous audio for all scenes at once',
      generateFullAudio: 'Generate Full Voice',
      scenesTitle: 'Scene Breakdown & Production Cues',
      visualDesc: 'Visual Scene Description:',
      voiceoverText: '🎙️ Spoken Voiceover Text:',
      genSceneVoice: 'Generate Scene Voice',
      genSceneImage: 'Generate Scene Image',
      generatingVoice: 'Generating voice...',
      generatingImage: 'Generating visual...',
      noScriptTitle: 'No script generated yet',
      noScriptDesc: 'Enter your topic idea on the left and click "Generate Script".',
    },

    image: {
      badge: 'Text-to-Image Studio',
      heading: 'Generate Stunning Visuals & Concept Art',
      desc: 'Describe any scene in Bengali or English — Gemini Visual AI creates high-resolution imagery in seconds.',
      promptLabel: 'Image Prompt / Description',
      promptPlaceholder: 'Describe the scene you want to visualize in detail...',
      samplePrompts: 'Sample Prompt Ideas:',
      aspectRatioLabel: 'Aspect Ratio',
      styleLabel: 'Art Style',
      generateBtn: 'Generate Artwork',
      generatingBtn: 'Rendering Image with AI...',
      resultTitle: 'Generated Artwork',
      download: 'Download PNG',
      fullscreen: 'View Fullscreen',
      promptUsed: 'Prompt:',
      noImageTitle: 'No artwork generated yet',
      noImageDesc: 'Describe your scene on the left and click "Generate Artwork".',
      galleryTitle: 'Recent Image Gallery',
    },

    storyboard: {
      badge: 'Full Studio Pipeline',
      heading: 'Video Storyboard & Scene Player',
      desc: 'Combine scripts, visuals, and voiceover audio into an interactive synchronized video storyboard.',
      generateAllBtn: 'Auto-Generate All Scene Assets',
      generatingAllBtn: 'Generating all scenes...',
      noImageYet: 'Visual asset not yet generated for this scene',
      generateSceneImg: 'Generate Scene Image',
      sceneVoiceReady: 'Voiceover Ready',
      generateVoice: 'Generate Voice',
      scenesList: 'Scenes List',
      hasImage: 'Image Ready',
      hasVoice: 'Audio Ready',
      noScriptTitle: 'No script loaded yet',
      noScriptDesc: 'First generate a script in the "AI Script Writer" tab, then send it here to preview.',
      goToScriptBtn: 'Create a Script First',
    },

    modal: {
      title: 'Can this be done with Gemini API Key?',
      answerTag: 'Answer: Yes, 100% possible and this entire Studio is powered by Gemini models!',
      answerHighlight: 'Google Gemini Multimodal Capabilities:',
      answerBody: 'Gemini models support native Text-to-Speech synthesis, speech transcription, text scripting, and image generation.',
      modelsHeading: 'Gemini Models Powering this App:',
      securityTitle: 'Secure Backend Integration',
      securityDesc: 'Your Gemini API Key is stored safely on the cloud server (process.env.GEMINI_API_KEY) and is never exposed to the client browser.',
      closeBtn: 'Got it, let’s use the Studio',
    },
  },
};
