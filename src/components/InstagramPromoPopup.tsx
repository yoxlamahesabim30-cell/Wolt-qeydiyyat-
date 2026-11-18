import React, { useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useSiteConfig } from '../context/SiteConfigContext';

const IG_POPUP_SEEN_KEY = 'flashly_ig_popup_seen';

export const InstagramPromoPopup: React.FC = () => {
  const { config, configLoaded, igPopupOpen, setIgPopupOpen } = useSiteConfig();
  const { instagramPromo } = config;

  useEffect(() => {
    if (!configLoaded || !instagramPromo.enabled) return;
    if (typeof window === 'undefined') return;

    try {
      if (window.localStorage.getItem(IG_POPUP_SEEN_KEY) === '1') {
        return;
      }
    } catch {
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(IG_POPUP_SEEN_KEY, '1');
      } catch {
        // ignore storage errors
      }
      setIgPopupOpen(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [configLoaded, instagramPromo.enabled, setIgPopupOpen]);

  useEffect(() => {
    if (!igPopupOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIgPopupOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [igPopupOpen, setIgPopupOpen]);

  const handleClose = () => {
    try {
      window.localStorage.setItem(IG_POPUP_SEEN_KEY, '1');
    } catch {
      // ignore
    }
    setIgPopupOpen(false);
  };

  if (!igPopupOpen || !instagramPromo.enabled) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B1B2B]/65 p-3 sm:p-6 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ig-promo-popup-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#0099C6]/40 bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0B1B2B] dark:text-[#E2E8F0] shadow-2xl shadow-[#0B1B2B]/45 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Header */}
        <div className="relative bg-gradient-to-br from-[#0B1B2B] via-[#0E2A44] to-[#007FA6] px-6 pt-7 pb-6 text-[#F8FAFC]">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Instagram pəncərəsini bağla"
            title="Bağla"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#F8FAFC]/20 bg-[#F8FAFC]/10 text-[#F8FAFC] hover:bg-[#0099C6] hover:border-[#0099C6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8FAFC]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F8FAFC] p-2.5 shadow-lg ring-4 ring-[#0099C6]/35">
              <InstagramIcon className="h-11 w-11" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0099C6]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#E4F4FA]">
                <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Rəsmi Səhifə</span>
              </span>
              <p className="mt-1 font-[var(--font-display)] text-sm font-extrabold text-[#7DD3FC] truncate">
                {instagramPromo.instagramHandle}
              </p>
              <p className="text-[11px] font-medium text-[#CBD5E1]">
                FLASHLY FLEET · Bakı
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h2
            id="ig-promo-popup-title"
            className="font-[var(--font-display)] text-xl font-extrabold text-[#0B1B2B] dark:text-[#E2E8F0] leading-snug"
          >
            {instagramPromo.title}
          </h2>

          <p className="mt-2.5 text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
            {instagramPromo.description}
          </p>

          <div className="mt-4 space-y-2 rounded-2xl border border-[#0099C6]/25 bg-[#E4F4FA] dark:bg-[#0F172A] p-3.5 text-xs font-semibold text-[#0B1B2B] dark:text-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
              <span>Qeydiyyatda 1-ci növbə üstünlüyü</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0099C6]" aria-hidden="true" />
              <span>Sənədlər və kampaniyalar barədə operativ yeniliklər</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href={instagramPromo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#0099C6] px-5 py-3 text-sm sm:text-base font-extrabold text-[#F8FAFC] shadow-md shadow-[#0099C6]/25 hover:bg-[#007FA6] active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099C6]"
            >
              <InstagramIcon className="h-5 w-5 shrink-0" />
              <span>{instagramPromo.buttonText}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#0099C6]/25 bg-[#EEF2F6] dark:bg-[#0F172A] px-4 py-2 text-xs font-bold text-[#334155] dark:text-[#CBD5E1] hover:border-[#0099C6] transition-colors"
            >
              Daha sonra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
