export interface AdUnitConfig {
  id: string;
  name: string;
  category: 'pop' | 'native' | 'social' | 'smartlink' | 'banner';
  dimensions?: string;
  description: string;
  banglaDesc: string;
  enabled: boolean;
  code: string;
  placementNote: string;
}

export interface AdsSystemConfig {
  companyName: string;
  globalEnabled: boolean;
  lastUpdated?: string;
  adUnits: Record<string, AdUnitConfig>;
}

export const DEFAULT_ADS_CONFIG: AdsSystemConfig = {
  companyName: 'freeall',
  globalEnabled: true,
  lastUpdated: new Date().toISOString(),
  adUnits: {
    popunder: {
      id: 'popunder',
      name: 'Popunder (High-CPM background pop script)',
      category: 'pop',
      description: 'High-CPM background pop script triggering upon first user interaction.',
      banglaDesc: 'হাই-সিপিএম ব্যাকগ্রাউন্ড পপ স্ক্রিপ্ট (ইউজার কোনো বাটনে ক্লিক করলে ওপেন হয়)',
      enabled: false,
      code: '',
      placementNote: 'Loads in background on user interaction / clicks',
    },
    nativeBanner: {
      id: 'nativeBanner',
      name: 'Native Banner (Responsive content recommendations widget)',
      category: 'native',
      dimensions: 'Responsive Grid',
      description: 'Responsive content recommendations widget blending seamlessly with studio tools.',
      banglaDesc: 'রেসপনসিভ কনটেন্ট রেকমেন্ডেশন উইজেট (টুলসের নিচে বা রেজাল্ট সেকশনে)',
      enabled: false,
      code: '',
      placementNote: 'Displays below generation results and storyboards',
    },
    socialBar: {
      id: 'socialBar',
      name: 'Social Bar (Interactive in-page notification format)',
      category: 'social',
      description: 'Interactive in-page notification / push notification format.',
      banglaDesc: 'ইন্টারেক্টিভ ইন-পেজ সোশ্যাল নোটিফিকেশন বার / পুশ মেসেজ',
      enabled: false,
      code: '',
      placementNote: 'Displays as interactive corner notification widget',
    },
    smartlink: {
      id: 'smartlink',
      name: 'Smartlink (Direct monetized action URL or tag)',
      category: 'smartlink',
      description: 'Direct monetized action URL or tag with dynamic auto-targeting.',
      banglaDesc: 'ডাইরেক্ট মনেটাইজড লিংক বা অ্যাকশন ইউআরএল (Smartlink URL/Tag)',
      enabled: false,
      code: '',
      placementNote: 'Triggered via direct action buttons or auto-redirect links',
    },
    banner300x250: {
      id: 'banner300x250',
      name: 'Banner — 300×250 (Medium Rectangle)',
      category: 'banner',
      dimensions: '300×250',
      description: 'Medium rectangle banner for sidebar or workspace side panels.',
      banglaDesc: 'মিডিয়াম রেক্টেঙ্গেল ব্যানার (সাইডবার বা টুলের ডানে)',
      enabled: false,
      code: '',
      placementNote: 'Right workspace panel or sidebar widget',
    },
    banner468x60: {
      id: 'banner468x60',
      name: 'Banner — 468×60 (Full Banner)',
      category: 'banner',
      dimensions: '468×60',
      description: 'Classic horizontal full banner for mid-content sections.',
      banglaDesc: 'হরাইজন্টাল ফুল ব্যানার (টুলস ও রেজাল্টের মাঝখানে)',
      enabled: false,
      code: '',
      placementNote: 'Between studio input forms and player controls',
    },
    banner160x600: {
      id: 'banner160x600',
      name: 'Banner — 160×600 (Wide Skyscraper)',
      category: 'banner',
      dimensions: '160×600',
      description: 'Vertical wide skyscraper banner for widescreen desktops.',
      banglaDesc: 'লম্বা ওয়াইড স্কাইস্ক্র্যাপার ব্যানার (ডেস্কটপ স্ক্রিনে ডানে/বামে)',
      enabled: false,
      code: '',
      placementNote: 'Widescreen desktop side gutter',
    },
    banner160x300: {
      id: 'banner160x300',
      name: 'Banner — 160×300 (Half Skyscraper)',
      category: 'banner',
      dimensions: '160×300',
      description: 'Compact vertical half skyscraper banner.',
      banglaDesc: 'কমপ্যাক্ট হাফ স্কাইস্ক্র্যাপার ব্যানার',
      enabled: false,
      code: '',
      placementNote: 'Compact vertical slot beside player',
    },
    banner320x50: {
      id: 'banner320x50',
      name: 'Banner — 320×50 (Mobile Leaderboard)',
      category: 'banner',
      dimensions: '320×50',
      description: 'Optimized mobile leaderboard for smartphones & tablets.',
      banglaDesc: 'মোবাইল লিডারবোর্ড ব্যানার (স্মার্টফোন ও ট্যাবলেটের নিচে/উপরে)',
      enabled: false,
      code: '',
      placementNote: 'Sticky top/bottom on mobile viewport',
    },
    banner728x90: {
      id: 'banner728x90',
      name: 'Banner — 728×90 (Header Leaderboard)',
      category: 'banner',
      dimensions: '728×90',
      description: 'Prominent top horizontal header leaderboard banner.',
      banglaDesc: 'টপ হেডার লিডারবোর্ড ব্যানার (সাইটের একদম উপরে দৃশ্যমান)',
      enabled: false,
      code: '',
      placementNote: 'Directly below top header bar across all tools',
    },
  },
};
