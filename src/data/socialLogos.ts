export type CenterLogoType = 'none' | 'facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'youtube' | 'custom';

export interface SocialPreset {
  id: CenterLogoType;
  name: string;
  banglaName: string;
  prefixUrl: string;
  placeholder: string;
  defaultFgColor: string;
  badgeColor: string;
  svgDataUri: string;
}

export const SOCIAL_LOGOS: Record<Exclude<CenterLogoType, 'none' | 'custom'>, { name: string; banglaName: string; svgDataUri: string }> = {
  facebook: {
    name: 'Facebook',
    banglaName: 'ফেসবুক',
    svgDataUri: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="%231877F2"/><path d="M57 50h-6v24H41V50h-5v-8h5v-5.5C41 30.5 44.5 26 52 26c3.6 0 6 .5 6 .5v7.5h-4.5c-2.4 0-2.5 1-2.5 2.8V42h7l-1 8z" fill="%23ffffff"/></svg>`,
  },
  instagram: {
    name: 'Instagram',
    banglaName: 'ইনস্টাগ্রাম',
    svgDataUri: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ig-grad" x1="0%25" y1="100%25" x2="100%25" y2="0%25"><stop offset="0%25" stop-color="%23fdf497"/><stop offset="45%25" stop-color="%23fd5949"/><stop offset="70%25" stop-color="%23d6249f"/><stop offset="100%25" stop-color="%23285AEB"/></linearGradient></defs><rect x="6" y="6" width="88" height="88" rx="24" fill="url(%23ig-grad)"/><rect x="22" y="22" width="56" height="56" rx="16" fill="none" stroke="%23ffffff" stroke-width="6"/><circle cx="50" cy="50" r="14" fill="none" stroke="%23ffffff" stroke-width="6"/><circle cx="66" cy="34" r="4" fill="%23ffffff"/></svg>`,
  },
  linkedin: {
    name: 'LinkedIn',
    banglaName: 'লিংকডইন',
    svgDataUri: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="88" height="88" rx="18" fill="%230A66C2"/><path d="M33 42h8v32h-8V42zm4-13c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm13 13h7.7v4.4h.1c1.1-2.1 3.8-4.4 7.9-4.4 8.5 0 10 5.6 10 12.8V74h-8V60.7c0-3.2-.1-7.3-4.5-7.3-4.5 0-5.2 3.5-5.2 7.1V74h-8V42z" fill="%23ffffff"/></svg>`,
  },
  whatsapp: {
    name: 'WhatsApp',
    banglaName: 'হোয়াটসঅ্যাপ',
    svgDataUri: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="%2325D366"/><path d="M50 20c-16.6 0-30 13.4-30 30 0 5.3 1.4 10.3 3.8 14.7L20 80l15.8-4.1c4.2 2.3 9 3.6 14.2 3.6 16.6 0 30-13.4 30-30s-13.4-29.5-30-29.5zm14.7 41.8c-.6 1.8-3.6 3.4-5 3.6-1.3.2-3 .3-8.8-2.1-7.4-3-12.2-10.6-12.6-11.1-.4-.5-3.1-4.1-3.1-7.9 0-3.7 2-5.6 2.7-6.3.7-.8 1.5-.9 2-.9.5 0 1.1 0 1.5.1.5.1 1.2-.2 1.8 1.4.7 1.6 2.3 5.6 2.5 6 .2.4.3.9.1 1.4-.2.5-.5 1-.9 1.4-.4.4-.8.9-1.2 1.2-.4.4-.8.8-.3 1.7.5.9 2.1 3.5 4.6 5.7 3.2 2.8 5.8 3.7 6.7 4.1.9.4 1.4.3 1.9-.3.5-.6 2.2-2.6 2.8-3.5.6-.9 1.2-.8 2-.5.8.3 5.3 2.5 6.2 3 .9.4 1.5.7 1.7 1.1.2.6.2 2.5-.4 4.3z" fill="%23ffffff"/></svg>`,
  },
  youtube: {
    name: 'YouTube',
    banglaName: 'ইউটিউব',
    svgDataUri: `data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="16" width="88" height="68" rx="22" fill="%23FF0000"/><path d="M42 34l22 16-22 16V34z" fill="%23ffffff"/></svg>`,
  },
};
