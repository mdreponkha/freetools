import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {
  QrCode,
  Barcode as BarcodeIcon,
  Download,
  Sparkles,
  Link,
  Type,
  Wifi,
  Phone,
  Mail,
  User,
  Sliders,
  Palette,
  Eye,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Globe,
  Share2,
} from 'lucide-react';
import { Language } from '../data/translations';
import { CenterLogoType, SOCIAL_LOGOS } from '../data/socialLogos';

interface QrBarcodeTabProps {
  language: Language;
}

type GeneratorMode = 'qr' | 'barcode';
type QrContentType = 'facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'youtube' | 'url' | 'text' | 'wifi' | 'contact' | 'phone' | 'email';
type BarcodeFormat = 'CODE128' | 'EAN13' | 'UPC' | 'CODE39' | 'ITF14' | 'pharmacode';

export const QrBarcodeTab: React.FC<QrBarcodeTabProps> = ({ language }) => {
  const [mode, setMode] = useState<GeneratorMode>('qr');

  // QR Code States
  const [qrContentType, setQrContentType] = useState<QrContentType>('facebook');
  const [qrValue, setQrValue] = useState<string>('https://facebook.com/yourpage');
  const [centerLogo, setCenterLogo] = useState<CenterLogoType>('facebook');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  // Styling States
  const [qrFgColor, setQrFgColor] = useState<string>('#1877F2');
  const [qrBgColor, setQrBgColor] = useState<string>('#ffffff');
  const [qrCorrection, setQrCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H'); // Default H for logo safety
  const [qrMargin, setQrMargin] = useState<number>(2);
  const [qrSize, setQrSize] = useState<number>(600);

  // Wi-Fi helper inputs
  const [wifiSsid, setWifiSsid] = useState<string>('MyWiFiNetwork');
  const [wifiPassword, setWifiPassword] = useState<string>('SecretPassword123');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');

  // Contact helper inputs
  const [contactName, setContactName] = useState<string>('Creative Design Agency');
  const [contactPhone, setContactPhone] = useState<string>('+8801700000000');
  const [contactEmail, setContactEmail] = useState<string>('contact@agency.com');

  // Barcode States
  const [barcodeValue, setBarcodeValue] = useState<string>('PROD-982471');
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>('CODE128');
  const [barcodeWidth, setBarcodeWidth] = useState<number>(2);
  const [barcodeHeight, setBarcodeHeight] = useState<number>(80);
  const [barcodeLineColor, setBarcodeLineColor] = useState<string>('#000000');
  const [barcodeBgColor, setBarcodeBgColor] = useState<string>('#ffffff');
  const [displayBarcodeText, setDisplayBarcodeText] = useState<boolean>(true);
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  // Previews & Canvas references
  const [compositeQrDataUrl, setCompositeQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);
  const customFileInputRef = useRef<HTMLInputElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick Social Switcher helper
  const handleSelectSocialType = (type: QrContentType) => {
    setQrContentType(type);
    if (type === 'facebook') {
      setQrValue('https://facebook.com/yourpage');
      setCenterLogo('facebook');
      setQrFgColor('#1877F2');
      setQrCorrection('H');
    } else if (type === 'instagram') {
      setQrValue('https://instagram.com/yourusername');
      setCenterLogo('instagram');
      setQrFgColor('#d6249f');
      setQrCorrection('H');
    } else if (type === 'linkedin') {
      setQrValue('https://linkedin.com/in/yourprofile');
      setCenterLogo('linkedin');
      setQrFgColor('#0A66C2');
      setQrCorrection('H');
    } else if (type === 'whatsapp') {
      setQrValue('https://wa.me/8801700000000');
      setCenterLogo('whatsapp');
      setQrFgColor('#25D366');
      setQrCorrection('H');
    } else if (type === 'youtube') {
      setQrValue('https://youtube.com/@yourchannel');
      setCenterLogo('youtube');
      setQrFgColor('#FF0000');
      setQrCorrection('H');
    } else if (type === 'url') {
      setQrValue('https://google.com');
      setCenterLogo('none');
      setQrFgColor('#000000');
    } else if (type === 'text') {
      setQrValue('স্বাগতম আমাদের স্টুডিওতে!');
      setCenterLogo('none');
      setQrFgColor('#000000');
    }
  };

  // Generate QR code and composite center logo onto canvas
  useEffect(() => {
    let finalValue = qrValue;

    if (qrContentType === 'wifi') {
      finalValue = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
    } else if (qrContentType === 'contact') {
      finalValue = `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
    }

    if (!finalValue.trim()) return;

    // Determine active logo URI
    let activeLogoUri: string | null = null;
    if (centerLogo === 'custom' && customLogoUrl) {
      activeLogoUri = customLogoUrl;
    } else if (centerLogo !== 'none' && centerLogo !== 'custom') {
      activeLogoUri = SOCIAL_LOGOS[centerLogo]?.svgDataUri || null;
    }

    // Force error correction to 'H' when logo is present
    const correctionLevel = activeLogoUri ? 'H' : qrCorrection;

    // 1. Generate base QR code
    QRCode.toDataURL(finalValue, {
      width: qrSize,
      margin: qrMargin,
      color: {
        dark: qrFgColor,
        light: qrBgColor,
      },
      errorCorrectionLevel: correctionLevel,
    })
      .then((baseQrUrl) => {
        if (!activeLogoUri) {
          setCompositeQrDataUrl(baseQrUrl);
          return;
        }

        // Draw composite image with center logo badge on HTML5 Canvas
        const baseImg = new Image();
        baseImg.src = baseQrUrl;
        baseImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = qrSize;
          canvas.height = qrSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Draw base QR
          ctx.drawImage(baseImg, 0, 0, qrSize, qrSize);

          // Draw logo badge
          const logoImg = new Image();
          logoImg.src = activeLogoUri!;
          logoImg.onload = () => {
            const logoBoxSize = qrSize * 0.24; // 24% of QR code width
            const cx = (qrSize - logoBoxSize) / 2;
            const cy = (qrSize - logoBoxSize) / 2;
            const radius = logoBoxSize * 0.25;

            // Rounded badge background
            ctx.save();
            ctx.fillStyle = qrBgColor === 'transparent' ? '#ffffff' : qrBgColor;
            ctx.beginPath();
            ctx.roundRect(cx - 4, cy - 4, logoBoxSize + 8, logoBoxSize + 8, radius + 2);
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#e2e8f0';
            ctx.stroke();

            // Draw logo image inside
            ctx.drawImage(logoImg, cx + 4, cy + 4, logoBoxSize - 8, logoBoxSize - 8);
            ctx.restore();

            const compositeData = canvas.toDataURL('image/png');
            setCompositeQrDataUrl(compositeData);
          };
        };
      })
      .catch((err) => console.error('QR code generation error:', err));

    // 2. Generate pure SVG string and inject center logo badge
    QRCode.toString(finalValue, {
      type: 'svg',
      width: qrSize,
      margin: qrMargin,
      color: {
        dark: qrFgColor,
        light: qrBgColor,
      },
      errorCorrectionLevel: correctionLevel,
    })
      .then((rawSvg) => {
        if (!activeLogoUri) {
          setQrSvgString(rawSvg);
          return;
        }

        // Inject SVG badge into SVG string before </svg>
        const logoBoxSize = qrSize * 0.24;
        const cx = (qrSize - logoBoxSize) / 2;
        const cy = (qrSize - logoBoxSize) / 2;

        const badgeSvgFragment = `
          <g transform="translate(${cx - 4}, ${cy - 4})">
            <rect width="${logoBoxSize + 8}" height="${logoBoxSize + 8}" rx="${logoBoxSize * 0.25}" fill="${qrBgColor === 'transparent' ? '#ffffff' : qrBgColor}" stroke="#e2e8f0" stroke-width="3" />
            <image href="${activeLogoUri}" x="8" y="8" width="${logoBoxSize - 8}" height="${logoBoxSize - 8}" />
          </g>
        `;

        const finalSvg = rawSvg.replace('</svg>', `${badgeSvgFragment}</svg>`);
        setQrSvgString(finalSvg);
      })
      .catch((err) => console.error('QR SVG error:', err));
  }, [
    qrContentType,
    qrValue,
    centerLogo,
    customLogoUrl,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    contactName,
    contactPhone,
    contactEmail,
    qrFgColor,
    qrBgColor,
    qrCorrection,
    qrMargin,
    qrSize,
  ]);

  // Generate Barcode whenever parameters change
  useEffect(() => {
    if (!barcodeSvgRef.current) return;
    setBarcodeError(null);

    try {
      JsBarcode(barcodeSvgRef.current, barcodeValue.trim() || '12345678', {
        format: barcodeFormat,
        width: barcodeWidth,
        height: barcodeHeight,
        lineColor: barcodeLineColor,
        background: barcodeBgColor,
        displayValue: displayBarcodeText,
        fontSize: 14,
        margin: 12,
      });
    } catch (err: any) {
      console.warn('Barcode render error:', err);
      setBarcodeError(
        language === 'bn'
          ? `ভ্যালিডেশন সমস্যা: এই ফরম্যাটের (${barcodeFormat}) জন্য সঠিক নাম্বার বা কোড দিন।`
          : `Format validation error: Please provide valid characters/length for ${barcodeFormat}.`
      );
    }
  }, [
    barcodeValue,
    barcodeFormat,
    barcodeWidth,
    barcodeHeight,
    barcodeLineColor,
    barcodeBgColor,
    displayBarcodeText,
    language,
    mode,
  ]);

  // Handle custom logo upload
  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomLogoUrl(result);
      setCenterLogo('custom');
      setQrCorrection('H');
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // Download Helpers for QR Code (JPG, PNG, SVG)
  // -------------------------------------------------------------
  const downloadQrPng = () => {
    if (!compositeQrDataUrl) return;
    const a = document.createElement('a');
    a.href = compositeQrDataUrl;
    a.download = `qrcode-${centerLogo !== 'none' ? centerLogo + '-' : ''}${Date.now()}.png`;
    a.click();
  };

  const downloadQrJpg = () => {
    if (!compositeQrDataUrl) return;
    const img = new Image();
    img.src = compositeQrDataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Solid background for JPG
      ctx.fillStyle = qrBgColor === 'transparent' ? '#ffffff' : qrBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.98);
      const a = document.createElement('a');
      a.href = jpgUrl;
      a.download = `qrcode-${centerLogo !== 'none' ? centerLogo + '-' : ''}${Date.now()}.jpg`;
      a.click();
    };
  };

  const downloadQrSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${centerLogo !== 'none' ? centerLogo + '-' : ''}${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // Download Helpers for Barcode (JPG, PNG, SVG)
  // -------------------------------------------------------------
  const downloadBarcodeSvg = () => {
    if (!barcodeSvgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(barcodeSvgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${barcodeFormat}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBarcodePngOrJpg = (format: 'png' | 'jpeg') => {
    if (!barcodeSvgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(barcodeSvgRef.current);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // High-res 2x
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'jpeg' || barcodeBgColor !== 'transparent') {
        ctx.fillStyle = barcodeBgColor === 'transparent' ? '#ffffff' : barcodeBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const exportUrl = canvas.toDataURL(mime, 0.98);
      const a = document.createElement('a');
      a.href = exportUrl;
      a.download = `barcode-${barcodeFormat}-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      a.click();
      URL.revokeObjectURL(url);
    };
  };

  const handleCopyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/50 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wider">
                {language === 'bn' ? 'সোশ্যাল মিডিয়া লোগোসহ কিউআর ও বারকোড স্টুডিও' : 'Social Logo QR & Barcode Studio'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              {language === 'bn'
                ? 'কিউআর কোড (লোগোসহ) ও বারকোড জেনারেটর'
                : 'QR Code (with Center Logo) & Barcode Studio'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl">
              {language === 'bn'
                ? 'ফেসবুক, ইনস্টাগ্রাম, লিংকডইন বা নিজের ব্র্যান্ড লোগো বসিয়ে আকর্ষণীয় কিউআর কোড বানান এবং JPG, PNG ও SVG ফরম্যাটে ফ্রি ডাউনলোড করুন।'
                : 'Generate branded QR codes with Facebook, Instagram, LinkedIn or custom center logos with vector SVG, PNG, and JPG exports.'}
            </p>
          </div>

          {/* Mode Selector Tabs (QR Code vs Barcode) */}
          <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950 p-1.5 shadow-lg">
            <button
              onClick={() => setMode('qr')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                mode === 'qr'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>{language === 'bn' ? 'কিউআর কোড (লোগোসহ)' : 'QR Code'}</span>
            </button>

            <button
              onClick={() => setMode('barcode')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                mode === 'barcode'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarcodeIcon className="h-4 w-4" />
              <span>{language === 'bn' ? 'বারকোড লাইন (Barcode)' : 'Barcode Lines'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. QR CODE GENERATOR WITH CENTER LOGO SECTION           */}
      {/* ======================================================== */}
      {mode === 'qr' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Form: Inputs & Customization (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Social Media & Content Type Cards */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-amber-400" />
                  {language === 'bn' ? 'সোশ্যাল মিডিয়া ও কিউআর ধরন নির্বাচন করুন' : 'Select Social Media or Content Type'}
                </span>
              </div>

              {/* Prominent Social Media Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {/* Facebook */}
                <button
                  onClick={() => handleSelectSocialType('facebook')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    qrContentType === 'facebook'
                      ? 'border-[#1877F2] bg-[#1877F2]/20 text-white ring-2 ring-[#1877F2]/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.facebook.svgDataUri} alt="FB" className="h-7 w-7 mb-1.5 drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">Facebook</span>
                  <span className="text-[10px] text-blue-300 font-medium">পেজ / আইডি</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => handleSelectSocialType('instagram')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    qrContentType === 'instagram'
                      ? 'border-[#d6249f] bg-[#d6249f]/20 text-white ring-2 ring-[#d6249f]/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.instagram.svgDataUri} alt="IG" className="h-7 w-7 mb-1.5 drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">Instagram</span>
                  <span className="text-[10px] text-pink-300 font-medium">প্রোফাইল</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleSelectSocialType('linkedin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    qrContentType === 'linkedin'
                      ? 'border-[#0A66C2] bg-[#0A66C2]/20 text-white ring-2 ring-[#0A66C2]/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.linkedin.svgDataUri} alt="LI" className="h-7 w-7 mb-1.5 drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">LinkedIn</span>
                  <span className="text-[10px] text-cyan-300 font-medium">কানেকশন</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleSelectSocialType('whatsapp')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    qrContentType === 'whatsapp'
                      ? 'border-[#25D366] bg-[#25D366]/20 text-white ring-2 ring-[#25D366]/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.whatsapp.svgDataUri} alt="WA" className="h-7 w-7 mb-1.5 drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">WhatsApp</span>
                  <span className="text-[10px] text-emerald-300 font-medium">ডাইরেক্ট চ্যাট</span>
                </button>

                {/* YouTube */}
                <button
                  onClick={() => handleSelectSocialType('youtube')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    qrContentType === 'youtube'
                      ? 'border-[#FF0000] bg-[#FF0000]/20 text-white ring-2 ring-[#FF0000]/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.youtube.svgDataUri} alt="YT" className="h-7 w-7 mb-1.5 drop-shadow-sm" />
                  <span className="text-xs font-bold text-white">YouTube</span>
                  <span className="text-[10px] text-rose-300 font-medium">চ্যানেল</span>
                </button>
              </div>

              {/* General Types: URL, Text, WiFi, Contact */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                {[
                  { id: 'url', label: 'Website Link', icon: Link },
                  { id: 'text', label: 'Plain Text (বাংলা / Eng)', icon: Type },
                  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
                  { id: 'contact', label: 'vCard Contact', icon: User },
                  { id: 'phone', label: 'Phone Call', icon: Phone },
                  { id: 'email', label: 'Email', icon: Mail },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSocialType(item.id as QrContentType)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      qrContentType === item.id
                        ? 'border-amber-400 bg-amber-500/20 text-white ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 text-amber-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs according to content type */}
              <div className="pt-2">
                {qrContentType === 'wifi' ? (
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'bn' ? 'ওয়াইফাই নাম (SSID Network Name)' : 'Wi-Fi Network Name (SSID)'}
                      </label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white font-medium outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'bn' ? 'ওয়াইফাই পাসওয়ার্ড (Password)' : 'Wi-Fi Password'}
                      </label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white font-medium outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ) : qrContentType === 'contact' ? (
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'bn' ? 'নাম বা প্রতিষ্ঠানের নাম' : 'Full Name / Business'}
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm text-white font-medium outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'bn' ? 'ফোন নাম্বার' : 'Phone'}
                        </label>
                        <input
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm text-white font-medium outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'bn' ? 'ইমেইল' : 'Email'}
                        </label>
                        <input
                          type="text"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm text-white font-medium outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      {qrContentType === 'facebook'
                        ? language === 'bn' ? 'ফেসবুক পেজ বা প্রোফাইল লিংক (Facebook URL)' : 'Enter Facebook Page or Profile URL'
                        : qrContentType === 'instagram'
                        ? language === 'bn' ? 'ইনস্টাগ্রাম প্রোফাইল লিংক (Instagram URL)' : 'Enter Instagram Profile URL'
                        : qrContentType === 'linkedin'
                        ? language === 'bn' ? 'লিংকডইন প্রোফাইল লিংক (LinkedIn URL)' : 'Enter LinkedIn Profile URL'
                        : qrContentType === 'whatsapp'
                        ? language === 'bn' ? 'হোয়াটসঅ্যাপ লিংক (WhatsApp URL / wa.me)' : 'Enter WhatsApp URL (wa.me/phone)'
                        : qrContentType === 'youtube'
                        ? language === 'bn' ? 'ইউটিউব চ্যানেল লিংক (YouTube URL)' : 'Enter YouTube Channel URL'
                        : qrContentType === 'url'
                        ? language === 'bn' ? 'ওয়েবসাইট লিংক দিন (Website URL)' : 'Enter Website URL'
                        : language === 'bn' ? 'আপনার বাংলা বা ইংরেজি টেক্সট লিখুন' : 'Enter Text or Message'}
                    </label>
                    <textarea
                      value={qrValue}
                      onChange={(e) => setQrValue(e.target.value)}
                      rows={2}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Center Logo Selector */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    {language === 'bn' ? 'কিউআর কোডের মাঝখানে লোগো (Center Logo Badge)' : 'Center Logo in QR Code'}
                  </span>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {language === 'bn' ? 'মাঝখানের লোগো নির্বাচন করুন অথবা নিজের লোগো আপলোড করুন' : 'Select center logo badge or upload custom image'}
                  </p>
                </div>
                {centerLogo !== 'none' && (
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 font-bold">
                    লোগো সক্রিয়
                  </span>
                )}
              </div>

              {/* Logo Badges Row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {/* Facebook Logo */}
                <button
                  onClick={() => {
                    setCenterLogo('facebook');
                    setQrCorrection('H');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'facebook'
                      ? 'border-[#1877F2] bg-[#1877F2]/20 ring-2 ring-[#1877F2]/60 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.facebook.svgDataUri} alt="FB" className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold text-white">Facebook</span>
                </button>

                {/* Instagram Logo */}
                <button
                  onClick={() => {
                    setCenterLogo('instagram');
                    setQrCorrection('H');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'instagram'
                      ? 'border-[#d6249f] bg-[#d6249f]/20 ring-2 ring-[#d6249f]/60 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.instagram.svgDataUri} alt="IG" className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold text-white">Instagram</span>
                </button>

                {/* LinkedIn Logo */}
                <button
                  onClick={() => {
                    setCenterLogo('linkedin');
                    setQrCorrection('H');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'linkedin'
                      ? 'border-[#0A66C2] bg-[#0A66C2]/20 ring-2 ring-[#0A66C2]/60 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.linkedin.svgDataUri} alt="LI" className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold text-white">LinkedIn</span>
                </button>

                {/* WhatsApp Logo */}
                <button
                  onClick={() => {
                    setCenterLogo('whatsapp');
                    setQrCorrection('H');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'whatsapp'
                      ? 'border-[#25D366] bg-[#25D366]/20 ring-2 ring-[#25D366]/60 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <img src={SOCIAL_LOGOS.whatsapp.svgDataUri} alt="WA" className="h-8 w-8 mb-1" />
                  <span className="text-xs font-bold text-white">WhatsApp</span>
                </button>

                {/* Custom Upload */}
                <button
                  onClick={() => customFileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'custom'
                      ? 'border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400/60 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  {customLogoUrl ? (
                    <img src={customLogoUrl} alt="Custom" className="h-8 w-8 mb-1 object-contain rounded" />
                  ) : (
                    <Upload className="h-8 w-8 mb-1 text-emerald-400" />
                  )}
                  <span className="text-xs font-bold text-white">{language === 'bn' ? 'কাস্টম লোগো' : 'Upload Logo'}</span>
                </button>

                {/* None (No Logo) */}
                <button
                  onClick={() => setCenterLogo('none')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    centerLogo === 'none'
                      ? 'border-slate-500 bg-slate-800 ring-2 ring-slate-500 shadow-md'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 font-bold text-xs mb-1">
                    ✕
                  </div>
                  <span className="text-xs font-bold text-slate-300">{language === 'bn' ? 'লোগো ছাড়া' : 'No Logo'}</span>
                </button>
              </div>

              <input
                ref={customFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomLogoUpload}
                className="hidden"
              />
            </div>

            {/* Colors and QR Style Customizer */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="h-4 w-4 text-emerald-400" />
                  {language === 'bn' ? 'রং ও মার্জিন কাস্টমাইজেশন (Colors & Margins)' : 'Colors & Customization'}
                </span>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {language === 'bn' ? 'কিউআর কোডের রং (Foreground)' : 'QR Code Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1"
                    />
                    <input
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {language === 'bn' ? 'ব্যাকগ্রাউন্ড রং (Background)' : 'Background Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1"
                    />
                    <input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Color Pairs */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  {language === 'bn' ? 'জনপ্রিয় কালার প্রিসেট:' : 'Popular Color Presets:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Classic Black', fg: '#000000', bg: '#ffffff' },
                    { name: 'Facebook Blue', fg: '#1877F2', bg: '#ffffff' },
                    { name: 'Instagram Pink', fg: '#d6249f', bg: '#ffffff' },
                    { name: 'LinkedIn Blue', fg: '#0A66C2', bg: '#ffffff' },
                    { name: 'Emerald Brand', fg: '#059669', bg: '#ffffff' },
                    { name: 'Dark Theme', fg: '#38bdf8', bg: '#0f172a' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQrFgColor(p.fg);
                        setQrBgColor(p.bg);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-slate-500"
                    >
                      <span className="h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: p.fg }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Correction & Margin Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? 'এরর কারেকশন লেভেল' : 'Error Correction Level'}
                  </label>
                  <select
                    value={qrCorrection}
                    onChange={(e) => setQrCorrection(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-bold outline-none"
                  >
                    <option value="H">High (30% recovery - Best for logo)</option>
                    <option value="Q">Quartile (25% recovery)</option>
                    <option value="M">Medium (15% recovery)</option>
                    <option value="L">Low (7% recovery)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? 'মার্জিন / বর্ডার' : 'Margin / Quiet Zone'}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={qrMargin}
                    onChange={(e) => setQrMargin(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live QR Preview & Downloads (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-sm text-center">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  {language === 'bn' ? 'লাইভ কিউআর প্রিভিউ (লোগোসহ)' : 'Live QR Preview (with Logo)'}
                </span>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-emerald-400 font-mono font-bold">
                  {centerLogo !== 'none' ? `${centerLogo.toUpperCase()} LOGO` : 'NO LOGO'}
                </span>
              </div>

              {/* Display Box */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
                {compositeQrDataUrl ? (
                  <div className="p-3.5 rounded-2xl shadow-2xl transition-all" style={{ backgroundColor: qrBgColor }}>
                    <img
                      src={compositeQrDataUrl}
                      alt="Generated QR Code with Logo"
                      className="max-h-72 max-w-full rounded-xl object-contain drop-shadow"
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                    Generating QR with Logo...
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-200 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'স্মার্টফোনে স্ক্যান করার জন্য ১০০% প্রস্তুত' : '100% Scannable with any smartphone camera'}</span>
                </div>
              </div>

              {/* 3 Explicit Download Buttons (JPG, PNG, SVG) */}
              <div className="mt-6 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 text-left">
                  {language === 'bn' ? 'লোগোসহ কিউআর কোড ডাউনলোড করুন:' : 'Download QR Code with Center Logo:'}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Download PNG */}
                  <button
                    onClick={downloadQrPng}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>PNG ফাইল</span>
                    <span className="text-[10px] text-slate-300 font-medium">HD Image</span>
                  </button>

                  {/* Download JPG */}
                  <button
                    onClick={downloadQrJpg}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-500/50 bg-amber-500/15 p-3 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all shadow-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>JPG ফাইল</span>
                    <span className="text-[10px] text-slate-300 font-medium">Web / Print</span>
                  </button>

                  {/* Download SVG */}
                  <button
                    onClick={downloadQrSvg}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-cyan-500/50 bg-cyan-500/15 p-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
                  >
                    <FileCode className="h-4 w-4" />
                    <span>SVG ভেক্টর</span>
                    <span className="text-[10px] text-slate-300 font-medium">Vector Logo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BARCODE GENERATOR SECTION                             */}
      {/* ======================================================== */}
      {mode === 'barcode' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Form: Barcode Settings (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <BarcodeIcon className="h-4 w-4 text-emerald-400" />
                  {language === 'bn' ? 'বারকোড তথ্য ও ফরম্যাট' : 'Barcode Value & Format'}
                </span>
              </div>

              {/* Barcode Value Input */}
              <div>
                <label className="text-xs font-bold text-white block mb-1.5">
                  {language === 'bn' ? 'বারকোড নাম্বার বা টেক্সট (Barcode Value)' : 'Barcode Number or Code Text'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={barcodeValue}
                    onChange={(e) => setBarcodeValue(e.target.value)}
                    placeholder="e.g. 890123456789 or PROD-9824"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-base font-mono font-bold text-white outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={() => handleCopyValue(barcodeValue)}
                    className="absolute right-3 top-3.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Barcode Formats Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  {language === 'bn' ? 'বারকোড ফরম্যাট নির্বাচন করুন:' : 'Select Barcode Standard:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'CODE128', label: 'CODE 128', sub: 'Universal (Letters & Numbers)' },
                    { id: 'EAN13', label: 'EAN-13', sub: 'Standard 13 Digit Retail' },
                    { id: 'UPC', label: 'UPC-A', sub: '12 Digit US Retail' },
                    { id: 'CODE39', label: 'CODE 39', sub: 'Industrial / Inventory' },
                    { id: 'ITF14', label: 'ITF-14', sub: '14 Digit Packaging' },
                    { id: 'pharmacode', label: 'Pharmacode', sub: 'Medical & Pharma' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        setBarcodeFormat(fmt.id as BarcodeFormat);
                        if (fmt.id === 'EAN13' && barcodeValue.length !== 13) setBarcodeValue('9780201379624');
                        if (fmt.id === 'UPC' && barcodeValue.length !== 12) setBarcodeValue('123456789012');
                        if (fmt.id === 'ITF14' && barcodeValue.length !== 14) setBarcodeValue('10012345678902');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        barcodeFormat === fmt.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-white ring-1 ring-emerald-400/50 shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{fmt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{fmt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {barcodeError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs font-bold text-rose-200">
                  {barcodeError}
                </div>
              )}
            </div>

            {/* Barcode Dimensions & Colors Customizer */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  {language === 'bn' ? 'বারকোড সাইজ ও লাইন কাস্টমাইজেশন' : 'Barcode Sizing & Line Options'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? `লাইনের ঘনত্ব / প্রস্থ: ${barcodeWidth}px` : `Bar Line Width: ${barcodeWidth}px`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={barcodeWidth}
                    onChange={(e) => setBarcodeWidth(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? `উচ্চতা (Height): ${barcodeHeight}px` : `Height: ${barcodeHeight}px`}
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    step="5"
                    value={barcodeHeight}
                    onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Barcode Colors */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? 'বারকোড লাইনের রং' : 'Barcode Line Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={barcodeLineColor}
                      onChange={(e) => setBarcodeLineColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1"
                    />
                    <input
                      type="text"
                      value={barcodeLineColor}
                      onChange={(e) => setBarcodeLineColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === 'bn' ? 'ব্যাকগ্রাউন্ড রং' : 'Background Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={barcodeBgColor}
                      onChange={(e) => setBarcodeBgColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-700 bg-slate-950 p-1"
                    />
                    <input
                      type="text"
                      value={barcodeBgColor}
                      onChange={(e) => setBarcodeBgColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Text display toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayBarcodeText}
                    onChange={(e) => setDisplayBarcodeText(e.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">
                    {language === 'bn' ? 'বারকোডের নিচে নাম্বার/টেক্সট প্রদর্শন করুন' : 'Show readable text underneath barcode lines'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Live Barcode Preview & Downloads (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-sm text-center">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  {language === 'bn' ? 'বারকোড প্রিভিউ' : 'Live Barcode Preview'}
                </span>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs text-emerald-400 font-mono font-bold">
                  {barcodeFormat}
                </span>
              </div>

              {/* Display Box */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner overflow-x-auto">
                <div className="p-4 rounded-xl shadow-xl transition-all" style={{ backgroundColor: barcodeBgColor }}>
                  <svg ref={barcodeSvgRef} className="max-w-full" />
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'স্ক্যানার ও প্রিন্টের জন্য প্রস্তুত' : 'Ready for barcode scanner & packaging'}</span>
                </div>
              </div>

              {/* 3 Explicit Download Buttons (JPG, PNG, SVG) */}
              <div className="mt-6 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 text-left">
                  {language === 'bn' ? 'বারকোড ডাউনলোড ফরম্যাট নির্বাচন করুন:' : 'Download Barcode Format:'}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Download PNG */}
                  <button
                    onClick={() => downloadBarcodePngOrJpg('png')}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>PNG ফাইল</span>
                    <span className="text-[10px] text-slate-400 font-normal">HD Raster</span>
                  </button>

                  {/* Download JPG */}
                  <button
                    onClick={() => downloadBarcodePngOrJpg('jpeg')}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-500/50 bg-amber-500/15 p-3 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all shadow-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>JPG ফাইল</span>
                    <span className="text-[10px] text-slate-400 font-normal">Solid Background</span>
                  </button>

                  {/* Download SVG */}
                  <button
                    onClick={downloadBarcodeSvg}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-cyan-500/50 bg-cyan-500/15 p-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
                  >
                    <FileCode className="h-4 w-4" />
                    <span>SVG ভেক্টর</span>
                    <span className="text-[10px] text-slate-400 font-normal">Print / Packaging</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
