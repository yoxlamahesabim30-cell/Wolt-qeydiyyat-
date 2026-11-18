import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LINKS } from '../data/fleetData';

export interface InstagramPromoSettings {
  enabled: boolean;
  instagramUrl: string;
  instagramHandle: string;
  title: string;
  description: string;
  buttonText: string;
}

export interface ReferralSettings {
  enabled: boolean;
  bonusAmount: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  greetingText: string;
}

export interface PublicSiteConfig {
  instagramPromo: InstagramPromoSettings;
  referralSettings: ReferralSettings;
  chatbotSettings: ChatbotSettings;
}

const DEFAULT_CONFIG: PublicSiteConfig = {
  instagramPromo: {
    enabled: true,
    instagramUrl: LINKS.instagram,
    instagramHandle: LINKS.instagramHandle,
    title: 'FLASHLY FLEET-i Instagram-da İzlə!',
    description:
      'Rəsmi Instagram səhifəmizdə kampaniyalar, kuryer yenilikləri və qeydiyyatda 1-ci növbə üstünlüyü əldə edin.',
    buttonText: 'Instagram-da bizi izlə',
  },
  referralSettings: {
    enabled: true,
    bonusAmount: '',
  },
  chatbotSettings: {
    enabled: true,
    greetingText:
      'Salam! Mən FLASHLY FLEET köməkçisiyəm. Wolt kuryer qeydiyyatı, sənədlər, iş prosesi və ödənişlər barədə sizə kömək edə bilərəm. Aşağıdakı mövzulardan birini seçin və ya sualınızı yazın.',
  },
};

const REF_STORAGE_KEY = 'flashly_ref_code';

interface SiteConfigContextValue {
  config: PublicSiteConfig;
  configLoaded: boolean;
  refreshConfig: () => Promise<void>;
  activeRefCode: string;
  setActiveRefCode: (code: string) => void;
  igPopupOpen: boolean;
  setIgPopupOpen: (open: boolean) => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<PublicSiteConfig>(DEFAULT_CONFIG);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [igPopupOpen, setIgPopupOpen] = useState(false);
  const [activeRefCode, setActiveRefCodeState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRef = (params.get('ref') || '').trim().toUpperCase();
      if (urlRef) {
        window.localStorage.setItem(REF_STORAGE_KEY, urlRef);
        return urlRef;
      }
      return (window.localStorage.getItem(REF_STORAGE_KEY) || '').trim().toUpperCase();
    } catch {
      return '';
    }
  });

  const setActiveRefCode = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    setActiveRefCodeState(clean);
    if (typeof window !== 'undefined') {
      try {
        if (clean) {
          window.localStorage.setItem(REF_STORAGE_KEY, clean);
        } else {
          window.localStorage.removeItem(REF_STORAGE_KEY);
        }
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/public-config');
      if (!res.ok) return;
      const data = (await res.json()) as Partial<PublicSiteConfig>;
      setConfig((prev) => ({
        instagramPromo: data.instagramPromo ?? prev.instagramPromo,
        referralSettings: data.referralSettings ?? prev.referralSettings,
        chatbotSettings: data.chatbotSettings ?? prev.chatbotSettings,
      }));
    } catch {
      // keep existing defaults on transient network issue
    } finally {
      setConfigLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refreshConfig();
  }, [refreshConfig]);

  // If user landed with ?ref=CODE, smoothly scroll to the referral section once loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref')) {
      const timer = window.setTimeout(() => {
        const el = document.getElementById('dostunu-getir');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        configLoaded,
        refreshConfig,
        activeRefCode,
        setActiveRefCode,
        igPopupOpen,
        setIgPopupOpen,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used inside SiteConfigProvider');
  }
  return ctx;
}
