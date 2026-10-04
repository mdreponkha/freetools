import React, { useEffect, useRef } from 'react';
import { AdUnitConfig } from '../data/defaultAds';

interface AdDisplayProps {
  adUnit?: AdUnitConfig;
  className?: string;
  showPlaceholderIfEmpty?: boolean;
}

export const AdDisplay: React.FC<AdDisplayProps> = ({
  adUnit,
  className = '',
  showPlaceholderIfEmpty = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adUnit || !adUnit.enabled || !adUnit.code.trim() || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Check if code contains script tags
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
    const hasScript = scriptRegex.test(adUnit.code);

    if (hasScript) {
      // Create sandboxed or dynamic iframe to execute ad scripts safely
      const iframe = document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.overflow = 'hidden';
      iframe.scrolling = 'no';
      container.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank">
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
              </style>
            </head>
            <body>
              ${adUnit.code}
            </body>
          </html>
        `);
        doc.close();
      }
    } else {
      // Pure HTML or smartlink image tag
      container.innerHTML = adUnit.code;
    }
  }, [adUnit?.code, adUnit?.enabled]);

  if (!adUnit || !adUnit.enabled) {
    if (showPlaceholderIfEmpty) {
      return (
        <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-3 text-center text-xs text-slate-300 font-mono ${className}`}>
          <span>{adUnit?.name || 'Ad Slot'}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Inactive in Admin Panel</span>
        </div>
      );
    }
    return null;
  }

  if (!adUnit.code.trim()) {
    if (showPlaceholderIfEmpty) {
      return (
        <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center text-xs text-slate-300 font-mono ${className}`}>
          <span className="font-bold text-amber-400">{adUnit.name}</span>
          <span className="text-[11px] text-slate-400 mt-1">
            (অ্যাড কোড অ্যাডমিন প্যানেলে ফাঁকা আছে — কোড বসালে লাইভ দেখাবে)
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    />
  );
};
